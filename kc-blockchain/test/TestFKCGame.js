const FKCGame = artifacts.require("FKCGame");
const web3 = require("web3");

contract("FKCGame", (accounts) => {
    let fkcGame;

    beforeEach(async () => {
        fkcGame = await FKCGame.new(accounts[0]);
    });

    it("should initialize with correct values", async () => {
        const name = await fkcGame.name.call();
        const symbol = await fkcGame.symbol.call();
        assert.equal(name, "FKC");
        assert.equal(symbol, "FortKnightChess");
    });

    it("should allow the owner to mint a new game", async () => {
        await fkcGame.mintNextGame(1, { from: accounts[0] });
        const gameState = await fkcGame.getGameState.call(1);
        assert.equal(gameState.currentGameState, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    });

    it("should not allow non-owners to mint a new game", async () => {
        try {
            await fkcGame.mintNextGame(1, { from: accounts[1] });
            assert.fail();
        } catch (error) {
            assert(error.message.indexOf("revert") >= 0, "Expected a revert error");
        }
    });

    it("should allow owner to update the game state", async () => {
        await fkcGame.mintNextGame(1, { from: accounts[0] });
        const receipt = await fkcGame.updateGameState(1, "12345", web3.utils.asciiToHex('e2e4'), { from: accounts[0] });
        const gameState = await fkcGame.getGameState.call(1);
        assert.equal(gameState.currentGameState, "12345");

        assert.equal(receipt.logs.length, 1, "should have received one event");
        assert.equal(receipt.logs[0].event, "GameStateUpdated", "event name should be GameStateUpdated");
        assert.equal(receipt.logs[0].args.tokenId, 1);
        assert.equal(receipt.logs[0].args.state, 12345);
        assert.equal(web3.utils.hexToAscii(receipt.logs[0].args.move), "e2e4");
    });

    it("should allow owner to add user to game", async () => {
        await fkcGame.mintNextGame(1, { from: accounts[0] });
        await fkcGame.addUserToGame(accounts[1], 1, true, { from: accounts[0] });
        const gameState = await fkcGame.getGameState.call(1);
        assert.equal(gameState.blackPlayers[0], accounts[1]);
    });

    it("should not allow updating game state of a completed game", async () => {
      await fkcGame.mintNextGame(1, { from: accounts[0] });
      await fkcGame.endGame(1, 1);
      await fkcGame.mintNextGame(2, { from: accounts[0] }); // This will mark game 1 as completed
      
      try {
          await fkcGame.updateGameState(1, "12345", web3.utils.asciiToHex('e2e4'), { from: accounts[0] });
          assert.fail("Expected revert not received");
      } catch (error) {
          assert(error.message.search('revert') >= 0, "Expected 'revert' but got '" + error.message + "' instead");
      }
  });

  it("should not allow adding a user to a completed game", async () => {
      await fkcGame.mintNextGame(1, { from: accounts[0] });
      await fkcGame.endGame(1, 2);
      await fkcGame.mintNextGame(2, { from: accounts[0] }); // This will mark game 1 as completed

      try {
          await fkcGame.addUserToGame(accounts[1], 1, true, { from: accounts[0] });
          assert.fail("Expected revert not received");
      } catch (error) {
          assert(error.message.search('revert') >= 0, "Expected 'revert' but got '" + error.message + "' instead");
      }
  });
});
