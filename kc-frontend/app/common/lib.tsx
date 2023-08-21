import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Colors, FigureData, Player, letters } from "./types";
import { jsNumberForAddress } from "react-jazzicon";

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
    x: letters.indexOf(from[0]) + 1,
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
