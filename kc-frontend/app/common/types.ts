export enum Colors {
	WHITE = "white",
	BLACK = "black",
}

export enum Figures {
	PAWN = 'pawn',
	KNIGHT = 'knight',
	BISHOP = 'bishop',
	ROOK = 'rook',
	QUEEN = 'queen',
	KING = 'king',
}

// for fen to config 
export const nameMapping : { [key: string] : Figures} = {
	'P': Figures.PAWN,
	'N': Figures.KNIGHT,
	'B': Figures.BISHOP,
	'R': Figures.ROOK,
	'Q': Figures.QUEEN,
	'K': Figures.KING,
} 

export interface Nft {
	boardState: { [key: string]: FigureData },
	nftId: number,
	moves: Array<Move>,
	mintDate: string,
	// add players list here
}

export interface NftDetails {
	name: string,
	desc: string,
	total: number,
}

export const FiguresMap: { [key: string]: Figures } = {
	'P': Figures.PAWN,
	'p': Figures.PAWN,
	'N': Figures.KNIGHT,
	'n': Figures.KNIGHT,
	'R': Figures.ROOK,
	'r': Figures.ROOK,
	'B': Figures.BISHOP,
	'b': Figures.BISHOP,
	'Q': Figures.QUEEN,
	'q': Figures.QUEEN,
	'K': Figures.KING,
	'k': Figures.KING
}

export const BoardLettersByNumber: { [key: number]: string } = {
	1: 'A',
	2: 'B',
	3: 'C',
	4: 'D',
	5: 'E',
	6: 'F',
	7: 'G',
	8: 'H',
}

export const BoardNumberByLetter: { [key: string]: number } = {
	'A': 1,
	'B': 2,
	'C': 3,
	'D': 4,
	'E': 5,
	'F': 6,
	'G': 7,
	'H': 8,
}

export interface Player {
	wallet: string,
	pic?: string,
	name?: string
}

export interface FigureData {
	id: string,
	name: Figures,
	x: number,
	y: number,
	color: Colors
}

export interface Move {
	piece: FigureData,
	move: Array<number>,
	capture: boolean,
	captured?: FigureData | undefined
}

const PIECE_VALUE = {
	[Figures.BISHOP]: 3,
	[Figures.KNIGHT]: 3,
	[Figures.PAWN]: 1,
	[Figures.ROOK]: 5,
	[Figures.QUEEN]: 9,
	[Figures.KING]: 100
}

export const calculateScore = (arr?: Array<FigureData>): number => {
	if (!arr || arr.length === 0) {
		return 0;
	}

	let total = 0;
	arr.forEach((a) => total += PIECE_VALUE[a.name]);
	return total;
}

export const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];