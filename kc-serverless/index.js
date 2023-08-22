const { ethers } = require("ethers");
const contractObj = require("./abi/FKCController.json");
const gameObj = require("./abi/FKCGame.json");
const jsChessEngine = require('js-chess-engine');

if (process.env.NODE_ENV != "production") {
  require("dotenv").config({
    path: '.env.local', override: true
  })
}

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8']
const COLORS = {
  BLACK: 'black',
  WHITE: 'white',
}

function isLocationValid(location) {
  return typeof location === 'string' && location.match('^[a-hA-H]{1}[1-8]{1}$')
}

function getJSONfromFEN(fen = '') {
  const [board, player, castlings, enPassant, halfmove, fullmove] = fen.split(' ')

  // pieces
  const configuration = {
    pieces: Object.fromEntries(board.split('/').flatMap((row, rowIdx) => {
      let colIdx = 0
      return row.split('').reduce((acc, sign) => {
        const piece = sign.match(/k|b|q|n|p|r/i)
        if (piece) {
          acc.push([`${COLUMNS[colIdx]}${ROWS[7 - rowIdx]}`, piece[0]])
          colIdx += 1
        }
        const squares = sign.match(/[1-8]/)
        if (squares) {
          colIdx += Number(squares)
        }
        return acc
      }, [])
    })),
  }

  // playing player
  if (player === 'b') {
    configuration.turn = COLORS.BLACK
  } else {
    configuration.turn = COLORS.WHITE
  }

  // castlings
  configuration.castling = {
    whiteLong: false,
    whiteShort: false,
    blackLong: false,
    blackShort: false,
  }
  if (castlings.includes('K')) {
    configuration.castling.whiteShort = true
  }
  if (castlings.includes('k')) {
    configuration.castling.blackShort = true
  }
  if (castlings.includes('Q')) {
    configuration.castling.whiteLong = true
  }
  if (castlings.includes('q')) {
    configuration.castling.blackLong = true
  }

  // enPassant
  if (isLocationValid(enPassant)) {
    configuration.enPassant = enPassant.toUpperCase()
  }

  // halfmoves
  configuration.halfMove = parseInt(halfmove)

  // fullmoves
  configuration.fullMove = parseInt(fullmove)

  return configuration
}

const registerPlayers = async (wallets, contract, currentGame, isBlack) => {
  console.log(`\nChecking ${isBlack ? "BLACK" : "WHITE"} Players Registration`)
  await Promise.all(wallets.map(async e => {
    const token = isBlack ? await contract.registeredBlackPlayer(e.address) : await contract.registeredWhitePlayer(e.address);
    // console.log("Token", token);
    if ((token).lt(currentGame)) {
      console.log(` registering ${e.address} as ${isBlack ? "BLACK" : "WHITE"} player`)
      const res = await contract.connect(e).register(isBlack);
      await res.wait();
    }
    else {
      // console.log(' ', e.address, "already registered as ", isBlack ? "BLACK player" : "WHITE player");
    }
  }));
}

const makeNextMove = async (contract, nextMove, owner, gameContract) => {
  console.log(' committing move to the blockchain');
  const currentGame = (await contract.currentToken());
  const gameState = await gameContract.getGameState(currentGame);
  const move = (Buffer.from(nextMove.move.replace('0x', ''), 'hex')).toString();
  /**
   * State as follows:
   * uint8 public constant WHITE_WIN = 1;
   * uint8 public constant BLACK_WIN = 2;
   */

  const config = getJSONfromFEN(gameState.currentGameState);
  const newState = jsChessEngine.move(config, move.substring(0, 2), move.substring(2, 4));
  const newFEN = jsChessEngine.getFen(newState);

  const result = newState.checkMate ? (newState.turn === 'black' ? 2 : 1) : 0;
  console.log(' newFEN is', newFEN, 'and result is', result);

  const res = await (contract.connect(owner)).makeNextMove(newFEN, result);
  await res.wait();
  console.log(' processing is completed');
}

const createWallets = async (provider) => {

  const b1 = new ethers.Wallet(process.env.BLACK_PLAYER_1, provider);
  const b2 = new ethers.Wallet(process.env.BLACK_PLAYER_2, provider);
  const b3 = new ethers.Wallet(process.env.BLACK_PLAYER_3, provider);

  const w1 = new ethers.Wallet(process.env.WHITE_PLAYER_1, provider);
  const w2 = new ethers.Wallet(process.env.WHITE_PLAYER_2, provider);
  const w3 = new ethers.Wallet(process.env.WHITE_PLAYER_3, provider);
  const owner = new ethers.Wallet(process.env.OWNER, provider);

  return { b1, b2, b3, w1, w2, w3, owner }
}

const chooseMoves = async (wallets, contract, gameState, currentStep, isBlack) => {
  console.log('Making moves for', isBlack ? "Black players" : "White players", "current step", currentStep);
  const knowledge = isBlack ? 1 : 3;

  const fen = gameState.currentGameState;
  console.log(' current state is', fen, currentStep);
  // console.log(getJSONfromFEN(fen));
  const config = getJSONfromFEN(fen);
  // wallet 1 - smart
  const c1 = jsChessEngine.aiMove(config, knowledge);
  console.log(' move chosen is p1', c1);
  const m1 = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(Object.entries(c1)[0].join("")));
  let res = await contract.connect(wallets[0]).requestMove(m1, currentStep);
  await res.wait();

  // wallet 2 - dumb
  const c2 = jsChessEngine.aiMove(config, knowledge - 1);
  console.log(' move chosen is p2', c2);
  const m2 = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(Object.entries(c2)[0].join("")));
  res = await contract.connect(wallets[1]).requestMove(m2, currentStep);
  await res.wait();

  // wallet 3 - random chooser
  const m3 = Math.random() > 0.5 ? m2 : m1;
  console.log(m3 === m2 ? ' move p2 was chosen' : ' move p1 was chosen');
  res = await contract.connect(wallets[2]).requestMove(m3, currentStep);
  await res.wait();
}

const processor = async (event, context) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  const { b1, b2, b3, w1, w2, w3, owner } = await createWallets(provider);

  console.log(`Bot Players starting up ${new Date()}`);
  const contract = new ethers.Contract(process.env.CONTRACT_FKCCONTROLLER, contractObj.abi, provider);
  const gameContract = new ethers.Contract(process.env.CONTRACT_FKCGAME, gameObj.abi, provider);

  // for (let i = 0; i < 30; ++i) {
  const nextMove = await contract.canMoveNext();

  console.log('next move is', nextMove);

  if (nextMove.total.gt(0)) {
    try {
      await makeNextMove(contract, nextMove, owner, gameContract);
    }
    catch (e) {
      console.log('exception thrown trying to make the next move. maybe it will work next round', e);
      return;
    }
  }
  const currentGame = (await contract.currentToken());
  const gameState = await gameContract.getGameState(currentGame);
  const game = await contract.games(currentGame - 1);

  // console.log(game, game.nextPlayTimer.toNumber(), Date.now());
  if ((game.nextPlayTimer.toNumber() * 1000 - Date.now()) / 1000 > 570) {
    console.log((game.nextPlayTimer.toNumber() * 1000 - Date.now()) / 1000);
    console.log('  Giving system time to process');
    return;
  }

  try {
    if (game.isBlackToPlay) {
      await registerPlayers([b1, b2, b3], contract, currentGame, true);
      await chooseMoves([b1, b2, b3], contract, gameState, game.currentStep, true);
    } else {
      await registerPlayers([w1, w2, w3], contract, currentGame, false);
      await chooseMoves([w1, w2, w3], contract, gameState, game.currentStep, false);
    }
    console.log(' Processing completed');
  }
  catch (e) {
    console.log('exception thrown trying to propose a move, maybe it will work next round', e);
    return;
  }
};

module.exports.run = processor

