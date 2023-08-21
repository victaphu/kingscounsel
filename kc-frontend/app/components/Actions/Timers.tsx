import { Colors } from "@/app/common/types";
import { selectCurrentPlayer, selectMoves } from "@/app/redux/gameSlice";
import { useAppSelector } from "@/app/redux/hooks";
import React from "react";
import { FaChessKing, FaBitcoin, FaRegChessKing } from "react-icons/fa6";

interface TimersProps {
}

const Timers: React.FC<TimersProps> = (props: TimersProps) => {
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const moves = useAppSelector(selectMoves);

  return <div className="text-black rounded-ss-lg font-mono rounded-se-lg bg-white flex flex-row gap-4 mx-16 p-2 motion-reduce:!opacity-100" style={{ "opacity": "1" }}>
    <div>{currentPlayer === Colors.WHITE ? <FaRegChessKing /> : <FaChessKing />}</div>
    <div className="flex gap-2 leading-5 text-sm">
      {currentPlayer === Colors.WHITE ? 'WHITE' : 'BLACK'}
    </div>
    <div className="flex gap-2 text-lg leading-5">
      <span>{1000 + moves.length}</span>
      <FaBitcoin />
    </div>
  </div>
}

export default Timers;