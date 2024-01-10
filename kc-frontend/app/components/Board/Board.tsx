"use client"
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./Board.module.scss";
import { BoardLettersByNumber, Colors, FigureData, Figures } from "@/app/common/types";
import Cell from "./Cell";
import Figure from "@/app/components/Figure/Figure";

import {
	proposeMove,
	resetGame,
	selectColor,
	selectCurrentPlayer,
	selectFENState,
	selectGameWon, selectJoined, selectMoveMade, selectPosition, selectProposed, selectRotate, setGameStarted,
	setGameWon,
	setMoveMade,
	setShowJoin,
	setToJoin
} from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { convertFromFEN, getStatus, validMoves } from "@/app/common/engine";
import { convertMoveToPosition, convertPositionToMove, getOtherColor } from "@/app/common/lib";
import useMoveSubmit from "@/app/redux/blockchain/useMoveSubmit";
import ConfirmDlg from "../Dialog/ConfirmDlg";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface BoardProps {
	replayMode?: boolean,
	currentBoard: { [key: string]: FigureData },
}

const Board: React.FC<BoardProps> = (props: BoardProps) => {
	const dispatch = useAppDispatch();
	const currentPlayer = useAppSelector(selectCurrentPlayer);
	const gameColor = useAppSelector(selectColor);
	const gameWon = useAppSelector(selectGameWon);
	const currentPosition = useAppSelector(selectPosition);
	const rotated = useAppSelector(selectRotate);
	const fenConfig = useAppSelector(selectFENState);
	const proposedMoves = useAppSelector(selectProposed);
	const joined = useAppSelector(selectJoined);
	const moveMade = useAppSelector(selectMoveMade);
	const { submitMove } = useMoveSubmit();
	const { show } = ConfirmDlg({title: 'Submit Move', message: 'Are you sure you want to submit the move?'});

	let [isKingInCheck, setIsKingInCheck] = useState<boolean>(false);
	let dangerousCells: MutableRefObject<{
		white: { [key: string]: boolean };
		black: { [key: string]: boolean }
	}> = useRef({ white: {}, black: {} });

	const sides = {
		ally: gameColor,
		enemy: gameColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE,
	}

	let figures = props.currentBoard;
	// console.log('>> figures', figures, 'filteredFigures', filteredFigures);

	const boardRef = useRef<HTMLDivElement>(null);
	const [choseFigurePos, setChoseFigurePos] = useState<{
		figure: FigureData
		availableCells: { [key: string]: boolean }
	} | null>(null);

	const cellsFigure: { [key: string]: FigureData | null } = {}

	const isAvailableCellForMove = (x: number, y: number): boolean => {
		if (choseFigurePos && choseFigurePos.availableCells[`${x}-${y}`]) {
			return true;
		}
		return false;
	}

	const isCellHavingFigure = (x: number, y: number): boolean => {
		return cellsFigure[`${x}-${y}`] ? true : false;
	}

	const moveOn = (figure: FigureData, x: number, y: number, captured: boolean, figureOnCell?: FigureData) => {
		cellsFigure[`${figure.x}-${figure.y}`] = null;
		cellsFigure[`${x}-${y}`] = figure;
		// dispatch(changeFigurePosition({ figure, x, y, captured, figureOnCell }));
		dispatch(setMoveMade(true));
		// dispatch(proposeMove(convertPositionToMove(figure.x, figure.y) + convertPositionToMove(x, y)));
		setChoseFigurePos(null);
	}

	const cellClicked = (x: number, y: number): void => {
		if (props?.replayMode) {
			return; // cannot click
		}
		if (!choseFigurePos) return;
		if (currentPlayer !== gameColor) {
			return;
		}
		if (!choseFigurePos.availableCells[`${x}-${y}`]) return;
		console.log('propose move');
		show(()=>{
			// moveOn(choseFigurePos.figure, x, y, false);
			const f = choseFigurePos.figure;
			submitMove({move: convertPositionToMove(f.x, f.y) + convertPositionToMove(x, y)}).then(() => {
				moveOn(choseFigurePos.figure, x, y, false);
			});

		});
		// dispatch(setCurrentPlayer(sides.enemy));
	}

	const initCells = (): JSX.Element[] => {
		const cells: JSX.Element[] = [];

		const proposedCells: { [key: string]: number } = {};

		if (!props.replayMode) {
			const totalMoves = Object.values(proposedMoves).reduce((a, b) => a + b, 0);

			// console.log('>>', proposedMoves);
			Object.entries(proposedMoves).forEach(p => {
				const move = p[0];
				const total = p[1];
				const from = convertMoveToPosition(move.substring(0, 2));
				const to = convertMoveToPosition(move.substring(2, 4));
				// proposedCells[`${from.x}-${from.y}`] = 50;
				proposedCells[`${to.x}-${to.y}`] = total; //total / totalMoves * 100;
			})

			console.log('>>', proposedCells, totalMoves);
		}

		for (let y = 8; y >= 1; y--) {
			for (let x = 1; x <= 8; x++) {
				cellsFigure[`${x}-${y}`] = null;
				const boardLetter = BoardLettersByNumber[x];
				console.log(proposedCells[`${x}-${y}`]);
				if ((y + x) % 2 !== 0) {
					cells.push(<Cell
						color={Colors.BLACK} x={boardLetter} y={y}
						key={`${boardLetter}-${y}`}
						isAvailableForMove={isAvailableCellForMove(x, y)}
						isHavingFigure={isCellHavingFigure(x, y)}
						cellClicked={cellClicked}
						isSelected={isSelectedCell(x, y)}
						proposed={proposedCells[`${x}-${y}`] || undefined}
					/>)
				} else {
					cells.push(<Cell
						color={Colors.WHITE} x={boardLetter} y={y}
						key={`${boardLetter}-${y}`}
						isAvailableForMove={isAvailableCellForMove(x, y)}
						isHavingFigure={isCellHavingFigure(x, y)}
						cellClicked={cellClicked}
						isSelected={isSelectedCell(x, y)}
						proposed={proposedCells[`${x}-${y}`] || undefined}
					/>)
				}
			}
		}
		return cells;
	}

	const isEatableFigure = (figure: FigureData): boolean => {
		if (!choseFigurePos) return false;
		return choseFigurePos.availableCells[`${figure.x}-${figure.y}`];
	}

	const isSelectedFigure = (figure: FigureData): boolean => {
		if (!choseFigurePos) return false;
		return choseFigurePos.figure.id === figure.id;
	}

	const isSelectedCell = (x: number, y: number): boolean => {
		if (!choseFigurePos) return false;
		return choseFigurePos.figure.x === x && choseFigurePos.figure.y === y;
	}

	const initFigures = (): JSX.Element[] => {
		const figuresJSX: JSX.Element[] = [];

		for (let item in figures) {
			if (!figures[item].id || !figures[item].color) continue;
			cellsFigure[`${figures[item].x}-${figures[item].y}`] = figures[item];
			figuresJSX.push(<Figure
				rotate={rotated}
				figureClicked={figureClicked}
				key={figures[item].id}
				figure={figures[item]}
				isEatable={isEatableFigure(figures[item])}
				isSelected={isSelectedFigure(figures[item])}
			/>);
		}

		return figuresJSX;
	}

	const figureClicked = (figure: FigureData) => {
		if (props?.replayMode) {
			return;
		}
		if (!joined) {
			dispatch(setToJoin(figure.color));
			dispatch(setShowJoin(true));
			return; // not joined
		}
		if (moveMade) {
			return; // move already made
		}
		if (currentPlayer !== gameColor) {
			return;
		}
		if (currentPosition >= 0) {
			return;
		}
		if (choseFigurePos && choseFigurePos.availableCells[`${figure.x}-${figure.y}`] && choseFigurePos.figure.color !== figure.color) {
			show(()=>{
				// 
				const f = choseFigurePos.figure;
				submitMove({move: convertPositionToMove(f.x, f.y) + convertPositionToMove(figure.x, figure.y)}).then(() => {
					moveOrEat(choseFigurePos.figure, figure.x, figure.y);
				});
			});
			
			// dispatch(setCurrentPlayer(sides.enemy));
			return;
		}

		if (choseFigurePos && choseFigurePos.figure.name === figure.name && figure.x === choseFigurePos.figure.x && choseFigurePos.figure.y === figure.y && choseFigurePos.figure.color === figure.color) {
			setChoseFigurePos(null);
			return;
		}

		if (sides.ally !== figure.color) return;

		if (isKingInCheck && figure.name !== Figures.KING) return;
		setChoseFigurePos({
			figure,
			availableCells: getAvailableCells(figure)
		});
	}

	const endGame = (winner: Colors) => {
		dispatch(setGameWon(winner));
		dispatch(setGameStarted(false))
	}

	// const eatFigure = (figure: FigureData): void => {
	// 	cellsFigure[`${figure.x}-${figure.y}`] = null;
	// 	if (figure.name === Figures.KING) {
	// 		endGame(getOtherColor(figure.color));
	// 	}
	// 	dispatch(removeFigure(figure));
	// }

	const moveOrEat = (figure: FigureData, x: number, y: number): void => {
		const figureOnCell = cellsFigure[`${x}-${y}`];
		let captured = false;
		if (figureOnCell && figureOnCell.color !== figure.color) {
			// eatFigure(figureOnCell);
			captured = true;
		}
		moveOn(figure, x, y, captured, figureOnCell || undefined);
	}

	const getAvailableCells = (figure: FigureData, isForDangerousCells: boolean = false): { [key: string]: boolean } => {
		const obj: { [key: string]: boolean } = {};
		// console.log(fenConfig);
		validMoves(convertFromFEN(fenConfig), letters[figure.x - 1] + figure.y).forEach((m: string) => {
			obj[`${letters.indexOf(m[0]) + 1}-${m[1]}`] = true
		})

		// console.log('available moves', obj);

		return obj;
	}

	const getFiguresBySide = (color: Colors) => {
		return Object.keys(figures).filter(figureId => figures[figureId].color === color).map(figureId => figures[figureId]);
	}

	const updateAllAvailableCells = () => {
		dangerousCells.current.white = {};
		dangerousCells.current.black = {};
		const whiteFigures = getFiguresBySide(Colors.WHITE);
		const blackFigures = getFiguresBySide(Colors.BLACK);
		whiteFigures.forEach(figure => {
			dangerousCells.current.white = {
				...dangerousCells.current.white,
				...getAvailableCells(figure, true),
			};
		});
		blackFigures.forEach(figure => {
			dangerousCells.current.black = {
				...dangerousCells.current.black,
				...getAvailableCells(figure, true),
			};
		});
	}

	const checkIsKingInCheck = (color: Colors) => {
		updateAllAvailableCells();
		const kings = {
			[Colors.WHITE]: figures['white-king-4-1'],
			[Colors.BLACK]: figures['black-king-4-8']
		}
		const king = kings[color];
		if (!king) return;
		if (dangerousCells.current[getOtherColor(color)][`${king.x}-${king.y}`]) setIsKingInCheck(true);
		else setIsKingInCheck(false);
	};

	const getGameWonJSX = (): JSX.Element | null => {
		if (!gameWon) return null;
		const color = gameWon[0].toUpperCase() + gameWon.slice(1);

		return <div className={styles.gameWon + (rotated ? ' rotate-180' : '')}>
			<h2 className={styles.gameWonTitle}>{color} won</h2>
			<button className="btn btn-secondary" onClick={e => dispatch(resetGame())}>Watch Latest Game</button>
		</div>;
	}

	useEffect(() => {
		checkIsKingInCheck(sides.ally);
	}, [figures])

	useEffect(() => {
		dispatch(setGameStarted(true));
	}, [])

	useEffect(() => {
		const config = getStatus(convertFromFEN(fenConfig));
		if (config.checkMate) {
			endGame(getOtherColor(currentPlayer)); // current player is checkmate 
		}
	}, [fenConfig])

	return <div className={styles.boardWrapper + " flex-1 " + (rotated ? ' rotate-180' : '')} ref={boardRef}>
		<ul className={styles.boardLeft + (rotated ? ' rotate-180' : '')}>
			{(rotated ? numbers.reverse() : numbers).map(n => <li key={n} className={styles.boardLeftItem}>{n}</li>)}
		</ul>

		<ul className={styles.boardRight + (rotated ? ' rotate-180' : '')}>
			{numbers.map(n => <li key={n} className={styles.boardRightItem}>{n}</li>)}
		</ul>

		<ul className={styles.boardBottom + (rotated ? ' rotate-180' : '')}>
			{(rotated ? letters.reverse() : letters).map(n => <li key={n} className={styles.boardBottomItem}>{n}</li>)}
		</ul>

		<ul className={styles.boardTop + (rotated ? ' rotate-180' : '')}>
			{letters.map(n => <li key={n} className={styles.boardTopItem}>{n}</li>)}
		</ul>


		<ul className={styles.board}>
			{initCells()}
			{initFigures()}
		</ul>

		{getGameWonJSX()}
	</div>
}

export default Board;