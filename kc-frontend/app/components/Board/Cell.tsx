"use client"
import React from "react";
import styles from "./Board.module.scss";
import { BoardNumberByLetter, Colors } from "@/app/common/types";
import classNames from "classnames";
import { useAppSelector } from "@/app/redux/hooks";
import { selectHoverCells } from "@/app/redux/gameSlice";
import useCellHover from "@/app/redux/blockchain/useCellHover";

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

const formatter = Intl.NumberFormat('en', {notation: 'compact'});

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
  const hoverCells = useAppSelector(selectHoverCells);
  const {hover} = useCellHover();

  if (props.proposed && props.proposed > 0) {
    const evaluated = mapToRange(props.proposed);
    colours = ` border-4 border-sky-500 bg-sky-300 hover:border-orange-500 hover:bg-orange-300 `;
  }

  const additional = {
    [styles.cellWhite]: props.color === Colors.WHITE && !props.proposed,
    [styles.cellBlack]: props.color === Colors.BLACK && !props.proposed,
    [styles.availableCell]: props.isAvailableForMove && !props.isHavingFigure,
    [styles.cellSelected]: props.isSelected,
  }

  if (hoverCells?.indexOf(`${BoardNumberByLetter[props.x]}-${props.y}`) >= 0) {
    colours = ` border-4 border-sky-500 bg-sky-300 hover:border-orange-500 hover:bg-orange-300 `;
  }

  return (
    <li onClick={() => props.cellClicked(BoardNumberByLetter[props.x], props.y)} id={`cell-${props.x}-${props.y}`} className={
      classNames(styles.cell, additional) + ' ' + colours + ' ' + 'relative'
    } onMouseEnter={() => props.proposed && props.proposed > 0 && hover(BoardNumberByLetter[props.x] + '-' + props.y)} onMouseLeave={() => props.proposed && props.proposed > 0 && hover('')}>
      <div className={classNames(styles.cellCircle, {
        [styles.cellCircleShow]: props.isAvailableForMove && !props.isHavingFigure
      })}></div>
      {props.proposed && props.proposed > 0 && <div className="absolute bottom-0 right-[4px] text-xs font-bold text-yellow-600">{formatter.format(props.proposed)}</div>}
    </li >
  )
}

export default Cell;