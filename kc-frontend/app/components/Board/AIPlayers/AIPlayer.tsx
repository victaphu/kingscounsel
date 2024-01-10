import { changeFigurePosition, proposeMove, removeFigure, selectCurrentPlayer, selectFENState, selectFigures, selectGameWon, selectIsGameStarted, selectProposeResign, selectProposed, selectReplayMode, setCurrentPlayer, setGameStarted, setGameWon } from "@/app/redux/gameSlice";
import { convertFromFEN, getStatus, makeAIMove } from "@/app/common/engine";
import { convertMoveToPosition, findPiece, getOtherColor } from "@/app/common/lib";
import { initialFEN } from "@/app/common/initialPos";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/app/common/types";

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

      // dispatch(proposeMove(start[0][0] + start[0][1]));
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
        // setTID(window.setTimeout(proposeMoves, 1000));
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
