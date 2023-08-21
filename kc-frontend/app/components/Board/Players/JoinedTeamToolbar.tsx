"use client"
import { proposeResign, selectColor, selectCurrentPlayer, selectMoveMade, setMoveMade } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRegFlag, FaUserCheck } from "react-icons/fa6";

const JoinedTeamToolbar = () => {
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const dispatch = useAppDispatch();
  const color = useAppSelector(selectColor);
  const [hover, setHover] = useState(false);
  const moveMade = useAppSelector(selectMoveMade);

  const resign = (event : React.MouseEvent) => {
    if (moveMade) {
      return;
    }
    if (confirm('Are you sure you want to propose to resign?')) {
      console.log('proposed resign')
      dispatch(proposeResign(true));
      dispatch(setMoveMade(true));
    }
    event.stopPropagation();
  }

  return (<div className={"lg:text-xl text-md text-center lg:w-12 w-8 lg:h-12 h-8 flex relative "}>
    {moveMade && <button className="lg:text-2xl text-md btn btn-circle btn-success relative">
      <FaUserCheck/>
    </button>}
    {!moveMade && <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{
        scale: 0.9
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <button className="lg:text-2xl text-md btn btn-circle btn-error relative" disabled={color !== currentPlayer || moveMade}>
        {!hover && <FaRegFlag />}
        {hover && <div className="text-xs" onClick={resign}>RESIGN</div>}
      </button>
    </motion.div>}
  </div>)
}
export default JoinedTeamToolbar;