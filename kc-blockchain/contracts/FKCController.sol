// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./interfaces/IFKCGame.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title FKCController
 * @notice This contract handles the logic and control of a game using tokens.
 * @dev TODO: Integrate chess verification on-chain.
 */

contract FKCController is IERC721Receiver, Ownable2Step {
    struct Game {
        uint256 gameId;
        uint256 nextPlayTimer;
        bool isBlackToPlay;
        uint256 totalTokens; // number of tokens collected for this game round
        bytes4[] proposedMoves;
        uint256 proposeResign; // number of users proposing resign for current play
        uint256 proposeDraw;
        uint256 currentStep; // current move in the game
    }

    Game[] public games;
    IFKCGame public gameState;
    uint256 public currentToken;

    uint8 public constant WHITE_WIN = 1;
    uint8 public constant BLACK_WIN = 2;
    uint8 public constant DRAW = 3;
    uint8 public constant STALEMATE = 4;
    uint8 public constant WHITE_RESIGN = 5;
    uint8 public constant BLACK_RESIGN = 6;
    uint256 public constant MAX_TIME_PER_MOVE = 10 minutes;

    mapping(address => uint256) public playerMovesMade; // a record of a move made by the user and the steps made
    mapping(address => uint256) public registeredWhitePlayer;
    mapping(address => uint256) public registeredBlackPlayer;
    mapping(bytes4 => uint256) public movesRequest;

    event NewGameCreated(uint256 currentToken);
    event NextMoveCreated(bool isBlack, uint256 expirationTimer);
    event UserRegistered(address userAddress, bool isBlack);
    event MoveProposed(address player, bytes4 move, uint256 currentStep);
    event MoveMade(bytes4 move);
    event GameCompleted(uint256 tokenId, uint8 result);

    constructor() {}

    modifier validPlayer() {
        Game storage currentGame = games[currentToken - 1];

        if (currentGame.isBlackToPlay) {
            require(
                registeredBlackPlayer[msg.sender] == currentGame.gameId,
                "user registered as black player for recent game"
            );
        } else {
            require(
                registeredWhitePlayer[msg.sender] == currentGame.gameId,
                "user registered as white player for recent game"
            );
        }
        _;
    }

    // Overridden renounceOwnership function to do nothing (intentional design choice)
    function renounceOwnership() public virtual override onlyOwner {
        // do nothing
        revert("cannot renounce ownership");
    }

    function getCurrentGameState() external view returns (IFKCGame.GameState memory) {
        return gameState.getGameState(currentToken);
    }

    function getCurrentGame() external view returns (Game memory) {
        return games[currentToken - 1];
    }

    /**
     * @notice Configures the game state and initializes the first game.
     * @param _gameState The game state contract to be set.
     */
    function configure(IFKCGame _gameState) public onlyOwner {
        require(
            address(gameState) == address(0),
            "cannot initialise more than once"
        );
        gameState = _gameState;
        createNewGame();
    }

    /**
     * @dev Creates a new game round.
     */
    function createNewGame() internal {
        currentToken += 1;
        games.push(
            Game(
                currentToken,
                block.timestamp + MAX_TIME_PER_MOVE,
                false,
                1000,
                new bytes4[](0),
                0,
                0,
                1
            )
        );
        // mint next game!
        gameState.mintNextGame(currentToken);
        emit NewGameCreated(currentToken);
    }

    /**
     * @dev Resets the proposed moves and their requests.
     */
    function reset() private {
        Game storage currentGame = games[currentToken - 1];
        for (uint256 i = 0; i < currentGame.proposedMoves.length; i++) {
            movesRequest[currentGame.proposedMoves[i]] = 0;
        }
        delete currentGame.proposedMoves;
    }

    /**
     * @dev Sets the conditions for the next move.
     */
    function nextPlay() private {
        Game storage currentGame = games[currentToken - 1];

        currentGame.currentStep += 1;
        currentGame.nextPlayTimer = block.timestamp + MAX_TIME_PER_MOVE;
        currentGame.proposeResign = 0;
        currentGame.isBlackToPlay = !currentGame.isBlackToPlay;

        emit NextMoveCreated(
            currentGame.isBlackToPlay,
            currentGame.nextPlayTimer
        );
    }

    /**
     * @notice Registers a user as a white or black player.
     * @param isBlack True if registering as a black player, false for white.
     */
    function register(bool isBlack) external {
        Game storage currentGame = games[currentToken - 1];

        require(
            registeredBlackPlayer[msg.sender] != currentGame.gameId,
            "user registered as black player for recent game"
        );
        require(
            registeredWhitePlayer[msg.sender] != currentGame.gameId,
            "user registered as white player for recent game"
        );

        if (isBlack) {
            registeredBlackPlayer[msg.sender] = currentToken;
        } else {
            registeredWhitePlayer[msg.sender] = currentToken;
        }
        gameState.addUserToGame(msg.sender, currentToken, isBlack);

        emit UserRegistered(msg.sender, isBlack);
    }

    function checkAndUpdateMoveMade(uint256 step) private {
        require(playerMovesMade[msg.sender] < step + (500 * currentToken), "move already made"); // max 500 moves per game
        playerMovesMade[msg.sender] = step + (500 * currentToken);
    }

    /**
     * @notice Allows a player to propose resignation.
     * @param step The current game step.
     */
    function proposeResign(uint256 step) external validPlayer {
        Game storage current = games[currentToken - 1];
        require(step == current.currentStep, "move made for step invalid");
        checkAndUpdateMoveMade(step);
        current.proposeResign = current.proposeResign + 1;        
    }

    /**
     * @notice Allows a player to request a move.
     * @param move The move being proposed.
     * @param step The current game step.
     */
    function requestMove(bytes4 move, uint256 step) external validPlayer {
        Game storage current = games[currentToken - 1];
        require(step == current.currentStep, "move made for step invalid");
        checkAndUpdateMoveMade(step);
        
        if (movesRequest[move] == 0) {
            current.proposedMoves.push(move);
        }
        movesRequest[move] += 1;
        current.totalTokens += 1;

        // Move Requested
        emit MoveProposed(msg.sender, move, step);
    }

    /**
     * @notice Finds the most popular move proposed by players.
     * @return move The most popular move.
     * @return total The total count of votes for that move.
     */
    function findPopularMove()
        public
        view
        returns (bytes4 move, uint256 total)
    {
        Game storage current = games[currentToken - 1];

        for (uint256 i = 0; i < current.proposedMoves.length; ++i) {
            if (movesRequest[current.proposedMoves[i]] > total) {
                move = current.proposedMoves[i];
                total = movesRequest[current.proposedMoves[i]];
            }
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external view returns (bytes4) {
        require(msg.sender == address(gameState), "invalid operator");
        return IERC721Receiver.onERC721Received.selector;
    }

    function canMoveNext() public view returns (bytes4 move, uint256 total) {
        Game storage current = games[currentToken - 1];
        (move, total) = findPopularMove();

        if (current.nextPlayTimer <= block.timestamp) {
            return (move, total);
        }
        IFKCGame.GameState memory state = gameState.getGameState(currentToken);

        if (current.isBlackToPlay) {
            return
                total * 1 ether > (state.blackPlayers.length * 1 ether) / 2
                    ? (move, total)
                    : (bytes4(""), 0);
        }
        return
            total * 1 ether > (state.whitePlayers.length * 1 ether) / 2
                ? (move, total)
                : (bytes4(""), 0);
    }

    /**
     * @notice Compute whether current move is resignation
     */
    function isResigned() internal view returns (uint8) {
        Game storage current = games[currentToken - 1];
        if (current.proposeResign == 0) {
            return 0;
        }
        IFKCGame.GameState memory state = gameState.getGameState(currentToken);
        if (current.isBlackToPlay) {
            return (current.proposeResign * 1 ether > (state.blackPlayers.length * 1 ether) / 2) ? BLACK_RESIGN : 0;
        }
        else {
            return (current.proposeResign * 1 ether > (state.whitePlayers.length * 1 ether) / 2) ? WHITE_RESIGN : 0;
        }
    }

    /**
     * @notice Computes and finalizes the next game move.
     * @param nextState - state to persist to the smart contract
     * @param result - result of the game
     */
    function makeNextMove(
        string memory nextState,
        uint8 result
    ) external onlyOwner {
        // find the move to be made
        (bytes4 move, uint256 total) = canMoveNext();
        uint8 resigned = isResigned();

        require(total > 0 || resigned > 0, "invalid no moves found");

        emit MoveMade(move);
        reset();
        gameState.updateGameState(currentToken, nextState, move);

        if (result > 0 || resigned > 0) {
            gameState.endGame(currentToken, resigned > 0 ? resigned : result);
            createNewGame();
            emit GameCompleted(currentToken, resigned > 0 ? resigned : result);
        } else {
            nextPlay();
        }
    }
}
