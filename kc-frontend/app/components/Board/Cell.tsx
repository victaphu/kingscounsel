"use client"
import React from "react";
import styles from "./Board.module.scss";
import { BoardNumberByLetter, Colors } from "@/app/common/types";
import classNames from "classnames/bind";

interface CellProps {
  color: Colors;
  x: string;
  y: number;
  cellClicked: (x: number, y: number) => void;
  isAvailableForMove?: boolean;
  isHavingFigure?: boolean;
  isSelected?: boolean;
  proposed?: number; // from 0 to 1000 
}

function mapToRange(input: number) {
  if (input < 10) {
    return 50;
  } else if (input < 90) {
    // Scale input from [10, 90] to [1, 8]
    const segment = Math.round((input - 10) * 8 / 80);
    return 100 + segment * 100;
  } else {
    return 950;
  }
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
  let colours = '';

  if (props.proposed && props.proposed > 0) {
    const evaluated = mapToRange(props.proposed);
    colours = ` border-4 border-sky-500  `;
  }

  const additional = {
    [styles.cellWhite]: props.color === Colors.WHITE,
    [styles.cellBlack]: props.color === Colors.BLACK,
    [styles.availableCell]: props.isAvailableForMove && !props.isHavingFigure,
    [styles.cellSelected]: props.isSelected,
  }

  return (
    <li onClick={() => props.cellClicked(BoardNumberByLetter[props.x], props.y)} id={`cell-${props.x}-${props.y}`} className={
      classNames(styles.cell, additional) + ' ' + colours
}>
  <div className={classNames(styles.cellCircle, {
    [styles.cellCircleShow]: props.isAvailableForMove && !props.isHavingFigure
  })}></div>
    </li >
  )
}

export default Cell;