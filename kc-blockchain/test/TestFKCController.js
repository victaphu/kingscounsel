const FKCController = artifacts.require("FKCController");
const FKCGame = artifacts.require("FKCGame");  // Assuming you have this mock
const web3 = require("web3");
const BigNumber = require('bignumber.js');
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("FKCController", accounts => {
  let fkcController;
  let fkcGame;

  const whitePlayer = accounts[1];
  const blackPlayer = accounts[2];

  const [owner, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = accounts;

  beforeEach(async () => {
    fkcController = await FKCController.new();
    fkcGame = await FKCGame.new(fkcController.address);
    await fkcController.configure(fkcGame.address);
  });

  it("should be able to create a new game", async () => {
    const game = await fkcController.games.call(0);
    assert.equal(game.gameId.toString(), "1", "Game ID should be 1");
  });

  it("should allow a user to register as white player", async () => {
    await fkcController.register(false, { from: whitePlayer });
    const registeredWhite = await fkcController.registeredWhitePlayer.call(whitePlayer);
    assert.equal(registeredWhite.toString(), "1", "User should be registered for game 1 as white player");
  });

  it("should allow a user to register as black player", async () => {
    await fkcController.register(true, { from: blackPlayer });
    const registeredBlack = await fkcController.registeredBlackPlayer(blackPlayer);
    assert.equal(registeredBlack.toString(), "1", "User should be registered for game 1 as black player");
  });

  it("should not allow a user to register twice", async () => {
    await fkcController.register(false, { from: whitePlayer });
    try {
      await fkcController.register(false, { from: whitePlayer });
      assert.fail("Shouldn't allow the user to register twice");
    } catch (error) {
      assert.include(error.message, "user registered as white player for recent game", "Expected registration error not received");
    }
  });

  it("should allow a registered user to propose a move", async () => {
    await fkcController.register(false, { from: whitePlayer });
    // ... Any other necessary setup ...
    await fkcController.requestMove(web3.utils.toHex("B2B4"), 1, { from: whitePlayer });  // Assuming move format as a number and step as 0 for simplicity
    const moveCount = await fkcController.movesRequest.call(web3.utils.toHex("B2B4"));
    assert.equal(moveCount.toString(), "1", "Move request count should be 1");
  });

  it("should play and checkmate", async () => {
    // Fool's mate (Black wins)
    // (["0x355", "0xd2c", "0x39e", "0xedf"], black_win_outcome),
    // Fool's mate (White wins)
    // (["0x314", "0xda6", "0x2db", "0xd6d", "0x0e7"], white_win_outcome),
  });

  it("should progress to next play after a move", async () => {
    await fkcController.register(false, { from: whitePlayer });
    await fkcController.register(true, { from: blackPlayer });
    await fkcController.requestMove(web3.utils.toHex("B2B4"), 1, { from: whitePlayer });  // Simulate proposing a move

    // console.log(await fkcController.checkState.call("0x500cec000000000000a000000000000c000060000000000c0000000000000000", "0x00071bff", "0x383f3bff"))

    const gameBefore = await fkcController.games.call(0);
    assert.equal(gameBefore.currentStep.toString(), "1", "Initial game step should be 1");

    console.log(await fkcController.canMoveNext.call(), gameBefore);

    // Here we're assuming the move was valid and would proceed to the next play
    await fkcController.makeNextMove("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 0);

    const gameAfter = await fkcController.games.call(0);
    assert.equal(gameAfter.currentStep.toString(), "2", "Game step should be incremented after move");
  });

  it("should complete the game if a winning move is made", async () => {
    await fkcController.register(false, { from: whitePlayer });
    await fkcController.register(true, { from: blackPlayer });
    await fkcController.requestMove(web3.utils.toHex("B2B4"), 1, { from: whitePlayer });  // Simulate proposing a move that would result in a win

    // This assumes that the move proposed above results in a win and the game completes
    const receipt = await fkcController.makeNextMove("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 1);
    console.log(receipt.logs)
    assert.equal((receipt.logs.find(l => l.event === "GameCompleted"))?.event, "GameCompleted", "Game should emit GameCompleted event");

    const currentToken = await fkcController.currentToken.call();
    assert.equal(currentToken.toString(), "2", "A new game should be created after completion, incrementing the currentToken");
  });

  describe("Basic Tests", () => {
    it("should correctly set up a new game on configure", async () => {
      const currentToken = await fkcController.currentToken();
      assert.equal(currentToken.toString(), "1", "Current token should be 1");
    });

    it("should not allow renouncing ownership", async () => {
      await expectRevert(
        fkcController.renounceOwnership(),
        "revert"
      );
    });

    it("should not allow configuration more than once", async () => {
      await expectRevert(
        fkcController.configure(fkcGame.address),
        "cannot initialise more than once"
      );
    });
  });

  describe("Move Proposing", () => {
    beforeEach(async () => {
      await fkcController.register(false, { from: accounts[0] });
    });

    it("should allow a registered user to propose a move", async () => {
      await fkcController.requestMove(web3.utils.asciiToHex('e2e4'), 1, { from: accounts[0] });
      const move = await fkcController.movesRequest(web3.utils.asciiToHex('e2e4'));
      assert.equal(move.toString(), "1", "Move count should be 1");
    });

    it("should not allow proposing a move for an incorrect step", async () => {
      await expectRevert(
        fkcController.requestMove(web3.utils.asciiToHex('e2e4'), 2, { from: accounts[0] }),
        "move made for step invalid"
      );
    });

    it("should not allow a non-registered user to propose a move", async () => {
      await expectRevert(
        fkcController.requestMove(web3.utils.asciiToHex('e2e4'), 0, { from: accounts[1] }),
        "user registered as white player for recent game"
      );
    });

    it("fuzz: random move proposals", async () => {
      const moves = ['e2e4', 'd2d4', 'c2c4', 'f2f4', 'g1f3', 'e2e3'];
      for (let i = 1; i < 7; i++) { // Starting from 1 since accounts[0] is already registered
        await fkcController.register(false, { from: accounts[i] });
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        await fkcController.requestMove(web3.utils.asciiToHex(randomMove), 1, { from: accounts[i] });
      }
      const popularMove = await fkcController.findPopularMove();
      assert.isTrue(BigNumber(popularMove.total).isGreaterThan(0));
    });
  });

  describe("User Registration", () => {
    it("should allow a user to register as a white player", async () => {
      await fkcController.register(false, { from: accounts[1] });
      const registered = await fkcController.registeredWhitePlayer(accounts[1]);
      assert.equal(registered.toString(), "1", "User should be registered for game 1 as white player");
    });

    it("should allow a user to register as a black player", async () => {
      await fkcController.register(true, { from: accounts[2] });
      const registered = await fkcController.registeredBlackPlayer(accounts[2]);
      assert.equal(registered.toString(), "1", "User should be registered for game 1 as black player");
    });

    it("should not allow a user to register as both white and black player for the same game", async () => {
      await fkcController.register(false, { from: accounts[1] });
      await expectRevert(
        fkcController.register(true, { from: accounts[1] }),
        "user registered as white player for recent game"
      );
    });

    it("fuzz: random user registrations", async () => {
      for (let i = 1; i < 10; i++) {
        const randomBool = Math.random() < 0.5;
        await fkcController.register(randomBool, { from: accounts[i] });
      }
    });

    it("simulates a game with Fool's Mate", async () => {
      // Register players for both colors
      await fkcController.register(false, { from: accounts[0] });  // Register as white
      await fkcController.register(true, { from: accounts[1] });  // Register as black

      const move1 = web3.utils.toHex("F2F3"); // Or any move in your specific format
      // Users choose split moves where 3 users choose the same move
      const move2 = web3.utils.toHex("E7E5");
      const move3 = web3.utils.toHex("G2G4");
      const move4 = web3.utils.toHex("D8H4");

      // White's first move: f3
      await fkcController.requestMove(move1, 1, { from: accounts[0] });
      await fkcController.makeNextMove("rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1", 0, { from: accounts[0] });

      // Black's first move: e5
      await fkcController.requestMove(move2, 2, { from: accounts[1] });
      await fkcController.makeNextMove("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq e6 0 2", 0, { from: accounts[0] });

      // White's second move: g4
      await fkcController.requestMove(move3, 3, { from: accounts[0] });
      await fkcController.makeNextMove("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2", 0, { from: accounts[0] });

      // Black's second move: Qh4 (this is checkmate)
      await fkcController.requestMove(move4, 4, { from: accounts[1] });
      await fkcController.makeNextMove("rnb1kbnr/pppp1ppp/8/4p3/6q1/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3", 2, { from: accounts[0] });

      // Validate game end condition after Qh4#
      const endState = await fkcGame.getGameState.call(1);
      assert.equal(endState.result, 2, "Expected a checkmate!");
      assert.equal(endState.currentGameState, "rnb1kbnr/pppp1ppp/8/4p3/6q1/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3", "Expected the final FEN to match!");
    });
  });

  it("should allow users to register and make moves", async () => {
    // Register 5 users for white and 5 users for black
    for (let i = 0; i < 5; i++) {
      await fkcController.register(false, { from: accounts[i] });
    }

    for (let i = 5; i < 10; i++) {
      await fkcController.register(true, { from: accounts[i] });
    }

    // Users choose the same move
    const move1 = web3.utils.toHex("E2E4"); // Or any move in your specific format

    for (let i = 0; i < 5; i++) {
      await fkcController.requestMove(move1, 1, { from: accounts[i] });
    }

    await fkcController.makeNextMove("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 0)

    // Users choose split moves where 3 users choose the same move
    const move2 = web3.utils.toHex("E7E5");
    const move3 = web3.utils.toHex("D7D5");

    for (let i = 5; i < 8; i++) {
      await fkcController.requestMove(move2, 2, { from: accounts[i] });
    }

    for (let i = 8; i < 10; i++) {
      await fkcController.requestMove(move3, 2, { from: accounts[i] });
    }

    // Here you'd continue with other move scenarios and checks
  });

  it("should fail makeNextMove because timer is not met", async () => {
    // Register and make move as before
    await fkcController.register(false, { from: user1 });
    await fkcController.register(false, { from: user2 });
    await fkcController.register(false, { from: user3 });
    await fkcController.register(false, { from: user4 });
    await fkcController.register(false, { from: user5 });

    const move = web3.utils.toHex("E2E4");
    await fkcController.requestMove(move, 1, { from: user1 });
    await fkcController.requestMove(move, 1, { from: user2 });

    try {
      await fkcController.makeNextMove("someState", 0, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      console.log(error)
      assert.isTrue(error.message.includes("revert invalid no moves found"));
    }
  });

  it("should succeed in making next move when 3 users propose the same move and timer criteria is met", async () => {
    // Register and make moves as before

    await fkcController.register(false, { from: user1 });
    await fkcController.register(false, { from: user2 });
    await fkcController.register(false, { from: user3 });
    // Simulate the passing of the time criteria (if required)

    const move = web3.utils.toHex("E2E4");
    await fkcController.requestMove(move, 1, { from: user1 });
    await fkcController.requestMove(move, 1, { from: user2 });
    await fkcController.requestMove(move, 1, { from: user3 });

    await fkcController.makeNextMove("someState", 0, { from: owner });

    // Here, you can add more assertions to check the changes in your smart contract state
  });

  it("should result in a white player resignation", async () => {
    const whitePlayer1 = user1;
    const whitePlayer2 = user2;
    const resignPlayer1 = user3;
    const resignPlayer2 = user4;
    const resignPlayer3 = user5;
    // Register two white players
    await fkcController.register(false, { from: whitePlayer1 });
    await fkcController.register(false, { from: whitePlayer2 });
    await fkcController.register(false, { from: resignPlayer1 });
    await fkcController.register(false, { from: resignPlayer2 });
    await fkcController.register(false, { from: resignPlayer3 });

    // Two white players proposing a move
    const move1 = web3.utils.fromAscii("e2e4"); // this is just a sample move (Pawn to e4)
    const move2 = web3.utils.fromAscii("d2d4"); // another sample move (Pawn to d4)
    await fkcController.requestMove(move1, 1, { from: whitePlayer1 });
    await fkcController.requestMove(move2, 1, { from: whitePlayer2 });

    // Three players proposing resignation
    await fkcController.proposeResign(1, { from: resignPlayer1 });
    await fkcController.proposeResign(1, { from: resignPlayer2 });
    await fkcController.proposeResign(1, { from: resignPlayer3 });

    // Compute the move 
    const move = web3.utils.fromAscii("next"); // you might need to adjust this based on your logic
    await fkcController.makeNextMove(move, 0, { from: owner });

    const gameState = await fkcGame.getGameState(1); // assuming '1' is the current game id
    
    // Assert that game ended in WHITE_RESIGN
    assert.equal(gameState.result, 5, "Expected game result to be WHITE_RESIGN");
});

  afterEach(async () => {
    // Clean up, if necessary
  });
});
