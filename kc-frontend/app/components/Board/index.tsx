"use client"
import { useEffect, useRef, useState } from "react";
import Board from "./Board";
import Player from "./Players/Player";
import { ethers } from "ethers";
import { Colors, Player as PlayerObj } from "@/app/common/types";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { changeFigurePosition, proposeMove, removeFigure, resetGame, selectBlackPlayers, selectCurrentPlayer, selectFENState, selectFigures, selectFilteredFigures, selectGameWon, selectIsGameStarted, selectJoined, selectMoves, selectPosition, selectProposeResign, selectProposed, selectReplayMode, selectRotate, selectShowJoin, selectToJoin, selectWhitePlayers, setBlackPlayers, setCurrentPlayer, setGameStarted, setGameWon, setReplayMode, setWhitePlayers } from "@/app/redux/gameSlice";
import { convertFromFEN, getStatus, makeAIMove } from "@/app/common/engine";
import { convertMoveToPosition, findPiece, getOtherColor } from "@/app/common/lib";
import { initialFEN } from "@/app/common/initialPos";
import JoinTeamDialog from "./Players/JoinTeamDialog";

const provider = ethers.getDefaultProvider('mainnet');
const createRandomUser = async (): Promise<PlayerObj> => {
  const wallet = ethers.Wallet.createRandom()
  return {
    wallet: wallet.address,
  }
}

async function generate(total: number): Promise<Array<PlayerObj>> {
  const results = [];
  for (let i = 0; i < total; ++i) {
    results.push(await createRandomUser());
  }
  return results;
}

interface AIBotProps {
  botPlayer: Colors;
  botLevel: number;
}

const AIBot: React.FC<AIBotProps> = ({ botPlayer, botLevel }: AIBotProps) => {
  const gameStarted = useAppSelector(selectIsGameStarted);
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const boardState = useAppSelector(selectFENState);
  const figures = useAppSelector(selectFigures);
  const movesProposed = useAppSelector(selectProposed);
  const resign = useAppSelector(selectProposeResign);
  const boardRef = useRef({ boardState, figures, movesProposed, resign });
  const dispatch = useAppDispatch();
  const [tId, setTID] = useState(0);
  const [proposed, setProposed] = useState(false);
  const gameWon = useAppSelector(selectGameWon);
  const replayMode = useAppSelector(selectReplayMode);

  const proposeMoves = () => {
    const boardState = boardRef.current.boardState;
    const config = convertFromFEN(boardState);
    const status = getStatus(config);
    try {
      if (status.checkMate) {
        return;
      }
      const move: { [key: string]: string } = makeAIMove(config, botLevel);
      const start = Object.entries(move)
      const from = convertMoveToPosition(start[0][0]);
      const to = convertMoveToPosition(start[0][1]);

      dispatch(proposeMove(start[0][0] + start[0][1]));
      setProposed(true);
    }
    finally {
      setTID(0);
    }
  }

  const chooseMoves = () => {
    const resign = boardRef.current.resign;
    // console.log('>> propose resigned', resign);
    if (resign) {
      // user proposed resign! force resign
      dispatch(setGameWon(getOtherColor(currentPlayer)));
      dispatch(setGameStarted(false));
      return;
    }
    const moves = Object.entries(boardRef.current.movesProposed).sort((a, b) => b[1] - a[1]);
    let move = moves[0];

    if (moves.length > 1) {
      // randomly choose moves between options
      move = moves[Math.floor(Math.random() * moves.length)];
    }
    const start = move[0];
    const from = convertMoveToPosition(start[0] + start[1]);
    const to = convertMoveToPosition(start[2] + start[3]);
    const figure = findPiece(figures, from.x, from.y)!;
    const figureOnCell = findPiece(figures, to.x, to.y);

    if (!figure) {
      console.log('figure not found?', figures, move, from, to);
    }

    dispatch(changeFigurePosition({
      figure,
      figureOnCell,
      x: to.x,
      y: to.y,
      captured: figureOnCell ? true : false
    }));

    if (figureOnCell) {
      dispatch(removeFigure(figureOnCell));
    }
    dispatch(setCurrentPlayer(getOtherColor(botPlayer)));
    setProposed(true);
  }

  useEffect(() => {
    boardRef.current = { boardState, figures, movesProposed, resign };
    if (replayMode) {
      if (tId > 0) {
        window.clearTimeout(tId);
        setTID(0);
      }
      setProposed(false);
      return;
    }
    if (!gameStarted) {
      if (tId > 0) {
        window.clearTimeout(tId);
        setTID(0);
      }
      setProposed(false);
      return;
    }

    const config = convertFromFEN(boardState);
    const status = getStatus(config);

    if (status.checkMate) {
      console.log('checkmated');
      if (tId > 0) {
        window.clearTimeout(tId);
        setTID(0);
      }
      return;
    }

    if (currentPlayer === botPlayer) {
      if (proposed) {
        if (boardState === initialFEN) {
          return;
        }
        else {
          // maybe board reset?
          return;
        }
      }
      if (tId > 0) {
        window.clearTimeout(tId);
      }
      if (botLevel < 0) {
        setTID(window.setTimeout(chooseMoves, 10000));
      }
      else {
        setTID(window.setTimeout(proposeMoves, 1000));
      }
      setProposed(true);
    }
    else {
      if (tId > 0) {
        window.clearTimeout(tId);
      }
      setProposed(false);
    }
  }, [boardState, currentPlayer, figures, movesProposed, gameStarted, resign, replayMode]);

  useEffect(() => {
    if (gameWon) {
      setProposed(false); // clear processed!
    }
  }, [gameWon]);
  return <></>
}

interface ChessGameProps {
  replayMode?: boolean
}

const ChessGame: React.FC<ChessGameProps> = (props: ChessGameProps) => {
  const dispatch = useAppDispatch();
  const whitePlayers = useAppSelector(selectWhitePlayers);
  const blackPlayers = useAppSelector(selectBlackPlayers);
  const rotated = useAppSelector(selectRotate);
  const toJoin = useAppSelector(selectToJoin);
  const moves = useAppSelector(selectMoves);
  const joined = useAppSelector(selectJoined);
  const showJoin = useAppSelector(selectShowJoin);
  const currentBoard = useAppSelector(selectFigures);
  const filteredBoard = useAppSelector(selectFilteredFigures);
  const position = useAppSelector(selectPosition);

  console.log(currentBoard);
  console.log(moves);

  useEffect(() => {
    generate(3).then(r => {
      dispatch(setBlackPlayers(r));
    });
    generate(3).then(r => {
      dispatch(setWhitePlayers(r));
    })
  }, []);

  useEffect(() => {
    dispatch(setReplayMode(props.replayMode ? true : false));
    if (!props.replayMode) {
      dispatch(resetGame());
    }
  }, [props.replayMode])

  const black = <Player isWhite={false} players={blackPlayers} replayMode={props.replayMode}/>
  const white = <Player isWhite={true} players={whitePlayers} replayMode={props.replayMode}/>
  return (<div className='w-full h-full flex flex-col rounded-xl bg-base-200'>
    {rotated ? white : black}
    {!joined && <JoinTeamDialog colour={toJoin} moves={moves} show={showJoin} />}
    <Board currentBoard={position >= 0 ? filteredBoard : currentBoard} replayMode={props.replayMode} />
    {rotated ? black : white}
    {/* {!props.replayMode && <> */}
      <AIBot key={1} botPlayer={Colors.BLACK} botLevel={0} />
      <AIBot key={2} botPlayer={Colors.BLACK} botLevel={0} />
      <AIBot key={3} botPlayer={Colors.BLACK} botLevel={0} />
      <AIBot key={4} botPlayer={Colors.BLACK} botLevel={0} />
      <AIBot key={5} botPlayer={Colors.BLACK} botLevel={-1} />

      <AIBot key={6} botPlayer={Colors.WHITE} botLevel={3} />
      <AIBot key={7} botPlayer={Colors.WHITE} botLevel={1} />
      {/* <AIBot botPlayer={Colors.WHITE} botLevel={1} />
    //  */}
      {/* <AIBot botPlayer={Colors.WHITE} botLevel={2} /> */}
      <AIBot key={8} botPlayer={Colors.WHITE} botLevel={-1} />
    {/* </>} */}

  </div>);
}

export default ChessGame;