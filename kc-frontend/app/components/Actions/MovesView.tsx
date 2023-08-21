import React from "react";
import NavBar from "./Navbar";
import { selectMoves, selectPosition, selectSelectedNft, setPosition } from "@/app/redux/gameSlice";
import { FigureData, Figures, Move } from "@/app/common/types";
import { FaChessBishop, FaChessKnight, FaChessQueen, FaChessRook } from "react-icons/fa6";
import MovesToolbar from "./MovesToolbar";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { AppDispatch } from "@/app/redux/store";

interface MovesViewProps {
}

const CHESS_ICON = {
  [Figures.BISHOP]: <FaChessBishop />,
  [Figures.KNIGHT]: <FaChessKnight />,
  [Figures.QUEEN]: <FaChessQueen />,
  [Figures.ROOK]: <FaChessRook />,
}

const getChar = (n: number) => {
  return 'abcdefgh'.charAt(n - 1);
}

const getIcon = (piece: FigureData) => {
  if (piece.name === Figures.PAWN || piece.name === Figures.KING) {
    return <></>;
  }
  return CHESS_ICON[piece.name];
}

const renderStart = (move: Move) => {
  if (move.piece.name !== Figures.PAWN || !move.capture) {
    return <></>
  }

  return getChar(move.piece.x);
}

const renderMove = (move: Move, index: number, dispatch: AppDispatch, selected = false) => {
  if (!move) {
    return <></>;
  }
  const selectPosition = () => {
    dispatch(setPosition(index));
  }

  return <div className={"flex flex-row gap-0 cursor-pointer" + (selected ? ' bg-orange-700 text-white' : '')} onClick={selectPosition}>{getIcon(move.piece)}<b>{renderStart(move)}{move.capture ? 'x' : ''}{getChar(move.move[0])}{move.move[1]}</b></div>
}

const MovesView: React.FC<MovesViewProps> = (props: MovesViewProps) => {
  const moves = useAppSelector(selectMoves);
  const selectedPosition = useAppSelector(selectPosition);
  const dispatch = useAppDispatch();
  const grouped: Array<Array<Move>> = [];
  let last: Array<Move> = [];
  grouped.push(last);
  moves.forEach((m, i) => {
    if (i % 2 === 0 && i > 0) {
      last = []
      grouped.push(last);
    }
    last.push(moves[i]);
  })

  return <div className="h-full rounded-se-lg bg-base-200 flex flex-col">
    <NavBar title="Moves List" />
    <div className="p-8 overflow-y-scroll w-full flex-1 flex flex-row gap-2 text-sm flex-wrap content-start">
      {/* {moves.map((move, i) => {
        return (<div className="flex flex-row gap-1">
          <div>{(i + 1) % 2 === 0 ? '' : (i / 2 + 1) + '.'}</div> <div className="flex flex-row gap-0">{getIcon(move.piece)}<b>{getChar(move.move[0])}{move.move[1]}</b></div>
        </div>)
      })} */}
      {
        grouped.map((group, i) => {
          return (<div className="flex flex-row gap-1" key={i}>
            {i + 1}.
            {renderMove(group[0], i * 2, dispatch, selectedPosition === i * 2)}
            {renderMove(group[1], i * 2 + 1, dispatch, selectedPosition === i * 2 + 1)}
          </div>)
        })
      }
    </div>
    <MovesToolbar/>
  </div>
}

export default MovesView;