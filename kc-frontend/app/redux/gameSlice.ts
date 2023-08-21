import { Colors, FigureData, FiguresMap, Move, Nft, NftDetails, Player } from "@/app/common/types";
import { initialFEN, initialFigures } from "@/app/common/initialPos";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { convertFromFEN, convertToFEN, makeMove } from "../common/engine";
import { convertMoveToPosition, convertPositionToMove } from "../common/lib";

interface GameState {
	color: Colors;
	figures: { [key: string]: FigureData };
	fenState: string;
	filteredFigures: { [key: string]: FigureData };
	gameWon: Colors | null;
	isGameStarted: boolean;
	piecesEaten: Array<FigureData>;
	blackPlayers: Array<Player>;
	whitePlayers: Array<Player>;
	playHistory: Array<Move>;
	currentTurn: Colors;
	currentPosition: number;
	rotate: boolean;
	timer: number;
	proposedMoves: { [key: string]: number };
	proposeResign: boolean;
	joined: boolean;
	toJoin: Colors;
	showJoin: boolean;
	moveMade: boolean;
	selectedNft?: Nft;
	nftDetails?: NftDetails;
	replayMode: boolean;
}

const initialState: GameState = {
	color: Colors.WHITE,
	figures: initialFigures,
	fenState: initialFEN,
	filteredFigures: initialFigures,
	gameWon: null,
	isGameStarted: false,
	piecesEaten: [],
	blackPlayers: [],
	whitePlayers: [],
	playHistory: [],
	currentTurn: Colors.WHITE,
	currentPosition: -1,
	rotate: false,
	timer: Date.now() + 600000,
	proposedMoves: {},
	proposeResign: false,
	joined: false,
	toJoin: Colors.WHITE,
	showJoin: false,
	moveMade: false,
	replayMode: false,
	nftDetails: {
		name: 'Battle Chess',
		desc: '',
		total: 3
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setNftDetails: (state, action: PayloadAction<NftDetails>) => {
			state.nftDetails = action.payload;
		},
		setSelectedNft: (state, action: PayloadAction<Nft>) => {
			state.selectedNft = action.payload;
			state.figures = action.payload.boardState;
			state.playHistory = action.payload.moves;
		},
		setJoined: (state, action: PayloadAction<boolean>) => {
			state.joined = action.payload;
		},
		setToJoin: (state, action: PayloadAction<Colors>) => {
			state.toJoin = action.payload;
		},
		setReplayMode: (state, action: PayloadAction<boolean>) => {
			state.replayMode = action.payload;
		},
		setMoveMade: (state, action: PayloadAction<boolean>) => {
			state.moveMade = action.payload;
		},
		setShowJoin: (state, action: PayloadAction<boolean>) => {
			state.showJoin = action.payload;
		},
		setRotate: (state, action: PayloadAction<boolean>) => {
			state.rotate = action.payload;
		},
		setWhitePlayers: (state, action: PayloadAction<Array<Player>>) => {
			state.whitePlayers = action.payload;
		},
		proposeResign: (state, action: PayloadAction<boolean>) => {
			state.proposeResign = action.payload;
		},
		proposeMove: (state, action: PayloadAction<string>) => {
			const proposedMove = state.proposedMoves;

			if (!proposedMove[action.payload]) {
				proposedMove[action.payload] = 0;
			}
			proposedMove[action.payload] += 1;
		},
		setBlackPlayers: (state, action: PayloadAction<Array<Player>>) => {
			state.blackPlayers = action.payload;
		},
		setColor: (state, action: PayloadAction<Colors>) => {
			state.color = action.payload;
		},
		changeFigurePosition: (state, action: PayloadAction<{ figure: FigureData, x: number, y: number, captured?: boolean, figureOnCell: FigureData | undefined }>) => {
			let config = convertFromFEN(state.fenState);
			console.log(action.payload.figure)
			config = makeMove(config, convertPositionToMove(
				state.figures[action.payload.figure.id].x, state.figures[action.payload.figure.id].y),
				convertPositionToMove(action.payload.x, action.payload.y)
			);
			state.fenState = convertToFEN(config);
			state.figures[action.payload.figure.id].x = action.payload.x;
			state.figures[action.payload.figure.id].y = action.payload.y;

			const positions: { [key: string]: string } = {};
			Object.assign(positions, config.pieces);
			const unknowns: Array<FigureData> = [];

			Object.entries(state.figures).map(figure => {
				const f = figure[1];
				const currPos = convertPositionToMove(f.x, f.y);
				if (!config.pieces[currPos]) {
					unknowns.push(f);
				}
				else if (f.name !== FiguresMap[config.pieces[currPos]]) {
					// pieces not match!
					if (f.name === action.payload.figureOnCell?.name) {
					} else {
						state.figures[figure[0]].name = FiguresMap[config.pieces[currPos]]; // console.log (change the piece type!)
					}
				}
				delete positions[currPos];
			})

			Object.entries(positions).forEach(p => {
				const currPos = convertMoveToPosition(p[0]);
				const piece = FiguresMap[p[1]];
				const found = unknowns.find(f => f.name === piece);
				if (!found) {
				}
				else {
					found.x = currPos.x;
					found.y = currPos.y;
				}
			});

			state.playHistory.push({
				piece: action.payload.figure,
				move: [action.payload.x, action.payload.y],
				capture: action.payload.captured || false,
				captured: action.payload.figureOnCell
			})
			state.timer = Date.now() + 600000;
			state.proposedMoves = {}; // once move made, clear the proposals!
			state.proposeResign = false;
			state.moveMade = false;
		},
		removeFigure: (state, action: PayloadAction<FigureData>) => {
			state.piecesEaten.push(state.figures[action.payload.id]);
			delete state.figures[action.payload.id];
		},
		setGameWon: (state, action: PayloadAction<Colors>) => {
			state.gameWon = action.payload;
		},
		resetGame: (state) => {
			state.gameWon = initialState.gameWon;
			state.figures = initialState.figures;
			state.isGameStarted = true;
			state.fenState = initialFEN;
			state.timer = Date.now() + 600000;
			state.filteredFigures = initialFigures;

			state.piecesEaten = initialState.piecesEaten;
			state.playHistory = initialState.playHistory;
			state.currentTurn = initialState.currentTurn;
			state.currentPosition = initialState.currentPosition;
			state.proposedMoves = initialState.proposedMoves;
			state.proposeResign = initialState.proposeResign;
			state.moveMade = initialState.moveMade;

			state.joined = false;
		},
		setGameStarted: (state, action: PayloadAction<boolean>) => {
			state.isGameStarted = action.payload;
		},
		setCurrentPlayer: (state, action: PayloadAction<Colors>) => {
			state.currentTurn = action.payload;
		},
		setPosition: (state, action: PayloadAction<number>) => {
			state.currentPosition = action.payload;
			if (action.payload >= 0) {
				const positions = state.playHistory.slice(0, action.payload + 1);
				const moves: { [key: string]: FigureData } = JSON.parse(JSON.stringify(initialFigures));
				positions.map((move) => {
					// console.log('>>', move.move[0], move.move[1], move.piece.name, move.piece.x, move.piece.y, move.captured);
					moves[move.piece.id].x = move.move[0];
					moves[move.piece.id].y = move.move[1];
					if (move.capture && move.captured) {
						delete moves[move.captured.id];
					}
				})
				state.filteredFigures = moves;
				// console.log('filtered figures >>> ', moves);
			}
		}
	}
})

export const { setColor,
	changeFigurePosition,
	removeFigure,
	setGameWon,
	resetGame,
	setGameStarted,
	setCurrentPlayer,
	setPosition,
	setBlackPlayers,
	setWhitePlayers,
	setRotate,
	proposeMove,
	setJoined,
	setToJoin,
	setShowJoin,
	proposeResign,
	setMoveMade,
	setReplayMode,
	setNftDetails,
	setSelectedNft,
} = gameSlice.actions;

export const selectFigures = (state: RootState) => state.game.figures;
export const selectColor = (state: RootState) => state.game.color;
export const selectGameWon = (state: RootState) => state.game.gameWon;
export const selectIsGameStarted = (state: RootState) => state.game.isGameStarted;
export const selectEatenPieces = (state: RootState) => state.game.piecesEaten;
export const selectMoves = (state: RootState) => state.game.playHistory;
export const selectCurrentPlayer = (state: RootState) => state.game.currentTurn;
export const selectPosition = (state: RootState) => state.game.currentPosition;
export const selectFilteredFigures = (state: RootState) => state.game.filteredFigures;
export const selectBlackPlayers = (state: RootState) => state.game.blackPlayers;
export const selectWhitePlayers = (state: RootState) => state.game.whitePlayers;
export const selectRotate = (state: RootState) => state.game.rotate;
export const selectTimer = (state: RootState) => state.game.timer;
export const selectFENState = (state: RootState) => state.game.fenState;
export const selectProposed = (state: RootState) => state.game.proposedMoves;
export const selectProposeResign = (state: RootState) => state.game.proposeResign;
export const selectJoined = (state: RootState) => state.game.joined;
export const selectToJoin = (state: RootState) => state.game.toJoin;
export const selectShowJoin = (state: RootState) => state.game.showJoin;
export const selectMoveMade = (state: RootState) => state.game.moveMade;
export const selectSelectedNft = (state: RootState) => state.game.selectedNft;
export const selectNftDetails = (state: RootState) => state.game.nftDetails;
export const selectReplayMode = (state: RootState) => state.game.replayMode;

export default gameSlice.reducer