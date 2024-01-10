import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectProposed, setHoverCells } from "../gameSlice";
import { convertMoveToPosition } from "@/app/common/lib";

export default function useCellHover() {
  // when user hovers, hover the other cell
  const dispatch = useAppDispatch();
  const proposed = useAppSelector(selectProposed);
  const [proposedMoves, setProposedMoves] = useState<Record<string, Array<string>>>();

  function hover(cell: string) {
    if (!proposedMoves?.[cell] || cell === "") {
      dispatch(setHoverCells([]));
      return;
    }
    dispatch(setHoverCells(proposedMoves[cell]));
  }

  useEffect(() => {
    if (!proposed || proposed.length === 0) {
      return;
    }
    const moves = {} as Record<string, Array<string>>;

    Object.entries(proposed).forEach(p => {
      const move = p[0];
      const from = convertMoveToPosition(move.substring(0, 2));
      const to = convertMoveToPosition(move.substring(2, 4));
      const fromStr = `${from.x}-${from.y}`;
      const toStr = `${to.x}-${to.y}`
      if (!moves[toStr]) {
        moves[toStr] = [] as Array<string>;
      }
      moves[toStr].push(fromStr);
    });

    setProposedMoves(moves);
  }, [proposed]);

  return {hover}
}