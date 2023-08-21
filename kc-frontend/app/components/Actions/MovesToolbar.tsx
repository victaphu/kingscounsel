"use client"
import { selectMoves, selectPosition, selectRotate, setColor, setPosition, setRotate } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowsRotate, FaPlay, FaBackwardStep, FaForwardStep, FaChevronLeft, FaChevronRight, FaPause } from "react-icons/fa6";
interface MovesToolbarProps {
}

const MovesToolbar: React.FC<MovesToolbarProps> = (props: MovesToolbarProps) => {
  const dispatch = useAppDispatch();
  const position = useAppSelector(selectPosition);
  const moves = useAppSelector(selectMoves);
  const [interval, setInterval] = useState(-1);
  const currentPosition = useRef<number>(position);
  const rotated = useAppSelector(selectRotate);

  const play = () => {
    if (interval) {
      window.clearInterval(interval);
      setInterval(0);
      return;
    }
    currentPosition.current = position;

    setInterval(window.setInterval(() => { 
      dispatch(setPosition(currentPosition.current));
      currentPosition.current = currentPosition.current + 1;
    }, 1000));
  }

  const setPlayMode = () => {
    if (position >= 0) {
      if (interval > 0) {
        play();
      }
      dispatch(setPosition(-1));
    }
  }

  const rotate = () => {
    dispatch(setRotate(!rotated));
  }

  useEffect(() => {
    if (position >= 0 && position >= moves.length && interval > 0) {
      window.clearInterval(interval);
      setInterval(0);
    } 
  }, [position, moves, interval])

  return <div className="flex flex-col p-4 gap-2 justify-end">
    <button className="btn btn-secondary" disabled={position < 0} onClick={setPlayMode}>{position >= 0 ? 'Play Mode' : 'Review Mode'}</button>
    <ul className="menu menu-horizontal bg-base-200 rounded-box">
      <li>
        <a onClick={rotate}>
          <FaArrowsRotate />
        </a>
      </li>
      <li>
        <a onClick={play}>
          {interval > 0 ? <FaPause/> : <FaPlay />}
        </a>
      </li>
      <li>
        <a onClick={() => dispatch(setPosition(0))}>
          <FaBackwardStep />
        </a>
      </li>
      <li>
        <a onClick={() => position >= 0 && dispatch(setPosition(position - 1))}>
          <FaChevronLeft />
        </a>
      </li>
      <li>
        <a onClick={() => position < moves.length - 1 && dispatch(setPosition(position + 1))}>
          <FaChevronRight />
        </a>
      </li>
      <li>
        <a onClick={() => dispatch(setPosition(-1))}>
          <FaForwardStep />
        </a>
      </li>
    </ul></div>
}

export default MovesToolbar;