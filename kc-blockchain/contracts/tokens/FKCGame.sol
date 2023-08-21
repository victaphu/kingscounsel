// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../interfaces/IFKCGame.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FKCGame
/// @dev This contract represents the FortKnightChess game and is an ERC721 token.
/// Each token represents a unique game session, and the contract tracks the state of each game.
contract FKCGame is IFKCGame, ERC721, Ownable {
    
    /// @notice Maximum number of players per side in a game.
    uint256 public constant MAX_USERS = 20;

    /// @dev Mapping from token ID to its game state.
    mapping(uint256 => GameState) public gameState;

    /// @notice Emitted when a user is added to a game.
    /// @param user Address of the user being added.
    /// @param tokenId ID of the game.
    /// @param addBlack Flag indicating whether the user was added to the black side.
    event UserAdded(address user, uint256 tokenId, bool addBlack);

    /// @notice Emitted when a game's state is updated.
    /// @param tokenId ID of the game being updated.
    /// @param state New state of the game.
    /// @param move Most recent move in the game.
    event GameStateUpdated(uint256 tokenId, string state, bytes4 move);

    /// @dev Initializes the FKCGame contract, setting its name and symbol.
    /// Transfers ownership to a specified address.
    /// @param _owner Address that will become the initial owner of the contract.
    constructor(address _owner) ERC721("FKC", "FortKnightChess") {
        transferOwnership(_owner);
    }

    /// @dev Modifier to ensure a game with a given token ID has started and hasn't completed yet.
    modifier gameStarted(uint256 tokenId) {
        require(bytes(gameState[tokenId].currentGameState).length > 0, 'game not created');
        require(!gameState[tokenId].gameCompleted, 'game already complete');
        _;
    }

    /// @notice Fetches the current state of a game by its token ID.
    /// @param tokenId ID of the game whose state is to be fetched.
    /// @return GameState The current state of the game.
    function getGameState(uint256 tokenId) external virtual view returns (GameState memory) {
        return gameState[tokenId];
    }

    /// @notice Updates the state of a game.
    /// Can only be called by the contract owner for an ongoing game.
    /// @param tokenId ID of the game to be updated.
    /// @param state New state for the game.
    /// @param move The most recent move in the game.
    function updateGameState(
        uint256 tokenId,
        string memory state,
        bytes4 move
    ) external virtual onlyOwner gameStarted(tokenId) {
        gameState[tokenId].currentGameState = state;
        gameState[tokenId].movesHistory.push(move);
        emit GameStateUpdated(tokenId, state, move);
    }

    /// @notice Adds a user to a game, either on the black or white side.
    /// @param user Address of the user being added.
    /// @param tokenId ID of the game the user is being added to.
    /// @param addBlack Flag indicating whether to add the user to the black side.
    function addUserToGame(
        address user,
        uint256 tokenId,
        bool addBlack
    ) external virtual onlyOwner gameStarted(tokenId) {
        if (addBlack) {
            require(gameState[tokenId].blackPlayers.length < MAX_USERS, 'max 20 players per side');
            gameState[tokenId].blackPlayers.push(user);
        } else {
            require(gameState[tokenId].whitePlayers.length < MAX_USERS, 'max 20 players per side');
            gameState[tokenId].whitePlayers.push(user);
        }
        emit UserAdded(user, tokenId, addBlack);
    }

    /// @notice Ends a game and mints the associated ERC721 token to the owner.
    /// @param tokenId ID of the game to be ended.
    /// @param result Result of the game (e.g., win/lose/draw).
    function endGame(uint256 tokenId, uint8 result) external virtual onlyOwner {
        require(tokenId >= 1, "game token invalid");
        require(!gameState[tokenId].gameCompleted, "game already completed");

        _safeMint(owner(), tokenId);
        gameState[tokenId].gameCompleted = true;
        gameState[tokenId].result = result;
    }

    /// @notice Mints a token for the next game.
    /// Ensures the previous game is completed before starting a new one.
    /// @param tokenId ID for the new game to be minted.
    function mintNextGame(uint256 tokenId) external virtual onlyOwner {
        if (tokenId > 1) {
            require(gameState[tokenId - 1].gameCompleted, 'previous game not complete, cannot start next game');
        }
        require(bytes(gameState[tokenId].currentGameState).length == 0, "game state exists");
        
        gameState[tokenId].currentGameState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    /// @dev Overridden to disable renouncing of ownership.
    function renounceOwnership() public override virtual onlyOwner {
        // do nothing
    }
}
