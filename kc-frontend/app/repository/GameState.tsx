import APIClient from "../adapters/APIClient";
import { ContractGameState, ContractMovesHistory } from "../common/types";
import Game from "../model/Game";

class GameState {
  static async loadGameState(nftId: number): Promise<Game> {
    const name = await APIClient.readGame('name');
    const desc = await APIClient.readGame('symbol');
    const gameState = await APIClient.readGame('getGameState', nftId) as ContractGameState;
    const currentState = await APIClient.readController('getCurrentGame') as ContractMovesHistory;
    console.log(nftId, gameState, currentState);
    const game = {
      name,
      desc,
      gameId: nftId,
      ...gameState,
      ...currentState,
      proposedMovesCount: []
    } as Game;
    // const moves = hexToAscii(game.proposedMoves!).map(m=>ethers.hexlify(ethers.toUtf8Bytes(m)));
    for(let i = 0; i < (game.proposedMoves ? game.proposedMoves.length : 0); ++i) {
      // console.log(moves[i], await APIClient.readController('movesRequest', game.proposedMoves![i]), game.proposedMoves![i]);
      game.proposedMovesCount!.push(Number(await APIClient.readController('movesRequest', game.proposedMoves![i]) as bigint));
    }

    console.log(game.proposedMovesCount);

    return game;
  }
  static async loadLatestGameState(): Promise<Game> {
    const currentToken = await APIClient.readController('currentToken') as bigint;
    console.log(currentToken);
    return await GameState.loadGameState(Number(currentToken));
  }
}

export default GameState;