// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/// @title IFKCGame
/// @dev This interface defines the methods and structures for the FortKnightChess game.
interface IFKCGame {

    /// @dev Struct representing the state of a game.
    struct GameState {
        address[] whitePlayers;       ///< List of addresses representing white players.
        address[] blackPlayers;       ///< List of addresses representing black players.
        string currentGameState;     ///< String representation of the current game state.
        bytes4[] movesHistory;       ///< List of moves that have been made in the game.
        bool gameCompleted;          ///< Indicates whether the game has been completed.
        uint8 result;                ///< Result of the game (e.g., 0 for draw, 1 for white wins, 2 for black wins).
    }

    /// @notice Fetches the current state of a game by its token ID.
    /// @param tokenId ID of the game whose state is to be fetched.
    /// @return GameState The current state of the game.
    function getGameState(uint256 tokenId) external view returns(GameState memory);

    /// @notice Updates the state of a game.
    /// @param tokenId ID of the game to be updated.
    /// @param state New state for the game.
    /// @param move The most recent move in the game.
    function updateGameState(uint256 tokenId, string memory state, bytes4 move) external;

    /// @notice Mints a token for the next game.
    /// @param tokenId ID for the new game to be minted.
    function mintNextGame(uint256 tokenId) external;

    /// @notice Adds a user to a game, either on the black or white side.
    /// @param user Address of the user being added.
    /// @param tokenId ID of the game the user is being added to.
    /// @param addBlack Flag indicating whether to add the user to the black side.
    function addUserToGame(address user, uint256 tokenId, bool addBlack) external;

    /// @notice Ends a game and updates its result.
    /// @param tokenId ID of the game to be ended.
    /// @param result Result of the game (e.g., win/lose/draw).
    function endGame(uint256 tokenId, uint8 result) external;
}
