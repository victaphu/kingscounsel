"use client"
import React from "react";
import { FigureData, Figures, calculateScore } from "@/app/common/types";
import Figure from "@/app/components/Figure/Figure";

interface CapturedPiecesProps {
  piecesWon?: Array<FigureData>,
  other?: Array<FigureData>
}

// create stacks
// order pieces
const FiguresOrder = Object.values(Figures);

const stackGroups = (stack: Array<FigureData>, i: number) => {
  return (<div className="flex flex-row -space-x-2" key={i}>
    {stack.map((piece, i) => (<div key={i} className="relative w-4 h-4">
      <Figure key={i} figure={{ id: "-1", name: piece.name, x: 1, y: 1, color: piece.color }} figureClicked={() => { }} isStandalone={true} additionalStyles={"w-5 h-5 p-0 top-0 left-0"} />
    </div>))}
  </div>);
}

const CapturedPieces: React.FC<CapturedPiecesProps> = (props: CapturedPiecesProps) => {
  if (!props.piecesWon || props.piecesWon.length === 0) {
    return <div className="lg:text-md text-xs">- No Pieces Captured -</div>;
  }
  const stacks: { [key: string]: Array<FigureData> } = {};
  props.piecesWon.sort((a, b) => FiguresOrder.indexOf(a.name) - FiguresOrder.indexOf(b.name)).forEach(piece => {
    if (!stacks[piece.name]) {
      stacks[piece.name] = [];
    }
    stacks[piece.name].push(piece);
  })

  const diff = calculateScore(props.piecesWon) - calculateScore(props.other);

  return (<div className="w-full flex flex-row gap-2">
    {Object.values(stacks).map((v, i)=>stackGroups(v, i))}
    <div className="text-md">{diff > 0 ? `+${diff}` : ''}</div>
  </div>)
}

export default CapturedPieces;