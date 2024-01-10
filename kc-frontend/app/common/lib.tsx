import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Colors, FigureData, Figures, Move, Player, letters, nameMapping } from "./types";
import { jsNumberForAddress } from "react-jazzicon";
import { ethers } from "ethers";
import gameObj from "@/app/abi/FKCGame.json";

export const getPlayerDetails = (player: Player) => {
  return player.name || player.wallet;
}

export const getPlayerIcon = (player: Player) => {
  if (player.pic) {
    return <img src={player.pic} title={getPlayerDetails(player)}></img>
  }
  return <Jazzicon diameter={24} seed={jsNumberForAddress(player.wallet)}/>;
}

export const renderPlayers = (players?: Array<Player>) => {
  if (!players || players.length === 0) {
    return <>No Players</>;
  }

  const length = players.length - 10;
  // <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  return (<div className="avatar-group -space-x-3">
    {players.slice(0, 10).map((player, i) => <div className="avatar border-2" key={i}>
      <div className="w-5" title={getPlayerDetails(player)}>
        {getPlayerIcon(player)}
      </div>
    </div>)}
    {length > 0 && <div className="avatar placeholder text-xs border-2">
      <div className="w-5 bg-neutral-focus text-neutral-content">
        <span>+{length}</span>
      </div>
    </div>}
  </div>)
}

export const convertPositionToMove = (x: number, y: number): string => {
	return letters[x - 1] + y;
}

export const convertMoveToPosition = (from: string): {x: number, y:number} => {
  return {
    x: letters.indexOf(from[0].toUpperCase()) + 1,
    y: +from[1]
  }
}

const PIECES_WHITE = ['KQRBPN'];
const PIECES_BLACK = PIECES_WHITE.map(e=>e.toLowerCase());

export const findPieceColor = (piece: string) => {
  if (PIECES_BLACK.indexOf(piece) >= 0) {
    return Colors.BLACK;
  }
  return Colors.WHITE;
}

export const findPiece = (figures: { [key: string]: FigureData }, x: number, y: number) : FigureData | undefined => {
  return Object.values(figures).find(f=>f.x === x && f.y === y)
}

export const getOtherColor = (color: Colors) => {
  return color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
}

export function hexToAscii(hexMoves: Array<string>) {
  let asciiMoves = [];

  for (let hexMove of hexMoves) {
      let asciiString = "";

      // Remove the "0x" prefix
      const cleanHexMove = hexMove.substring(2);

      // Convert each 2-character long hexadecimal chunk to its ASCII representation
      for (let i = 0; i < cleanHexMove.length; i += 2) {
          const hexChunk = cleanHexMove.substring(i, i + 2);
          asciiString += String.fromCharCode(parseInt(hexChunk, 16));
      }

      asciiMoves.push(asciiString.toLowerCase());
  }

  return asciiMoves;
}

/**
 * Checks if there is a piece at the given position based on a given FEN string.
 * 
 * @param {string} fen - The FEN string representing the board state.
 * @param {string} position - The coordinate of the position to check, e.g., "A1", "B2".
 * 
 * @return {string|null} Returns the piece at the position if any, otherwise null.
 */
export function isPieceAtPosition(fen: string, position: string) {
  // Convert the alphanumeric coordinate into numeric (1-based) coordinates
  const x = position.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  const y = Number(position[1]);

  const rows = fen.split(' ')[0].split('/');
  const targetRow = rows[8 - y];  // FEN starts from the 8th rank down to the 1st.

  let currentX = 1;
  for (const ch of targetRow) {
      if (isNaN(+ch)) {  // If the character is not a number, it's a piece.
          if (currentX === x) {
              return ch;
          }
          currentX++;
      } else {  // If it's a number, it indicates empty squares.
          currentX += Number(ch);
      }

      if (currentX > x) {
          break;
      }
  }

  return null;  // No piece at the given position.
}

export // Function to initialize board from FEN string
function initialiseBoardFromFEN(fen: string): {[key: string]: FigureData} {
  const rows = fen.split(' ')[0].split('/');
  let board: {[key: string]: FigureData} = {};
  let y = 8;

  for (const row of rows) {
    let x = 1;
    for (const char of row) {
      if (isNaN(Number(char))) {
        const color = char === char.toUpperCase() ? Colors.WHITE : Colors.BLACK;
        const name = char.toUpperCase() === 'K' ? Figures.KING :
                     char.toUpperCase() === 'Q' ? Figures.QUEEN :
                     char.toUpperCase() === 'B' ? Figures.BISHOP :
                     char.toUpperCase() === 'N' ? Figures.KNIGHT :
                     char.toUpperCase() === 'R' ? Figures.ROOK : Figures.PAWN;
        const id = `${color.toLowerCase()}-${name.toLowerCase()}-${x}-${y}`;
        board[id] = {
          id,
          name,
          x,
          y,
          color
        };
        x++;
      } else {
        x += Number(char);
      }
    }
    y--;
  }
  
  return board;
}


export function makeMoves(board: {[key: string]: FigureData}, moves: string[]): {moves: Move[], captures: FigureData[]} {
  const movesArray: Move[] = [];
  const capturesArray: FigureData[] = [];

  for (const move of moves) {
    const [from, to] = [move.slice(0, 2), move.slice(2, 4)];
    const fromX = from.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const fromY = Number(from[1]);
    const toX = to.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const toY = Number(to[1]);

    const piece = Object.values(board).find(figure => figure.x === fromX && figure.y === fromY);
    const target = Object.values(board).find(figure => figure.x === toX && figure.y === toY);

    if (piece) {
      const moveObj: Move = {
        piece,
        move: [toX, toY],
        capture: !!target,
        captured: target
      };

      movesArray.push(moveObj);

      if (target) {
        capturesArray.push(target);
        delete board[target.id];
      }

      piece.x = toX;
      piece.y = toY;
    }
    else {
      console.log('piece not found for move');
    }
  }

  return { moves: movesArray, captures: capturesArray };
}