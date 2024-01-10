type Game = {
  name?: string;
  desc?: string;
  gameId?: number;
  nextPlayTimer?: number;
  isBlackToPlay?: boolean;
  totalTokens?: number; // number of tokens collected for this game round
  proposedMoves?: string[]; // number of moves
  proposedMovesCount?: number[]; // number of choices per moves
  proposeResign?: number; // number of users proposing resign for current play
  proposeDraw?: number;
  currentStep?: number; // current move in the game
  whitePlayers?: string[];       ///< List of addresses representing white players.
  blackPlayers?: string[];       ///< List of addresses representing black players.
  currentGameState?: string;     ///< String representation of the current game state.
  movesHistory?: string[];       ///< List of moves that have been made in the game.
  gameCompleted?: boolean;          ///< Indicates whether the game has been completed.
  result?: number;                ///< Result of the game (e.g., 0 for draw, 1 for white wins, 2 for black wins).
}

export default Game;