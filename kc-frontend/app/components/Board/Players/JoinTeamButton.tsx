"use client"
import React, { useState } from "react";
import { Colors, Figures, Player } from "@/app/common/types";
import Figure from "../../Figure/Figure";
import { motion } from "framer-motion";
import { selectColor, selectGameWon, selectIsGameStarted, selectJoined, setShowJoin, setToJoin } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";


interface PlayerProps {
  isWhite: boolean,
  players?: Array<Player>
}

const JoinButton = (props: PlayerProps) => {
  const joined = useAppSelector(selectJoined);
  const color = useAppSelector(selectColor);
  const [hover, setHover] = useState(false);
  const dispatch = useAppDispatch();
  const gameStarted = useAppSelector(selectIsGameStarted);
  const gameWon = useAppSelector(selectGameWon);

  console.log('gameWon', gameWon, 'gameStarted', gameStarted);

  const active = color === (props.isWhite ? Colors.WHITE : Colors.BLACK);
  const size = joined && active ? 'lg:w-6 w-5 top-0' : 'lg:w12 w-8';

  const piece = props.isWhite
    ? <Figure figure={{ id: "-1", name: Figures.KING, x: 1, y: 1, color: Colors.WHITE }} figureClicked={() => { }} isStandalone={true} additionalStyles={size} />
    : <Figure figure={{ id: "-1", name: Figures.KING, x: 1, y: 1, color: Colors.BLACK }} figureClicked={() => { }} isStandalone={true} additionalStyles={size} />

  const joinTeam = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!gameStarted || gameWon) {
      return;
    }
    e.stopPropagation();
    dispatch(setShowJoin(true));
    dispatch(setToJoin(props.isWhite ? Colors.WHITE : Colors.BLACK));
  }

  return (<div className={"text-xl text-center lg:w-12 w-10 lg:h-12 h-10 relative " + (props.isWhite ? 'text-white' : 'text-white')} onClick={joinTeam}>
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{
        scale: 0.9
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <button className="text-xs btn btn-circle relative">
        {joined && hover && piece}
        {!hover && piece}
        {hover && !gameStarted && piece}
        {!joined && hover && gameStarted && `JOIN ${props.isWhite ? "WHITE" : "BLACK"}`}
        {joined && active && <div className="badge badge-outline badge-secondary text-xs absolute bottom-0 p-1 text-[10px]">Joined</div>}
      </button>
    </motion.div>
  </div>)
}

export default JoinButton;