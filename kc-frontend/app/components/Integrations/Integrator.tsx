"use client"
import React, { useEffect } from "react";
import { useAccount } from 'wagmi'
import { useAppDispatch } from "@/app/redux/hooks";
import { hexToAscii, initialiseBoardFromFEN, makeMoves } from "@/app/common/lib";
import { proposeMove, setCurrentStep, setBlackPlayers, setColor, setCurrentPlayer, setFENState, setFigures, setJoined, setNftDetails, setPiecesCaptured, setPlayHistory, setTimer, setWhitePlayers, setLatestGameId } from "@/app/redux/gameSlice";
import { Colors } from "@/app/common/types";
import { toNumber } from "ethers";
import { initialFEN } from "@/app/common/initialPos";
import useGameState from "@/app/redux/blockchain/useGameState";
import useControllerEvents from "@/app/redux/blockchain/useControllerEvents";
import GlobalChatState from "@/app/repository/GlobalChatState";

/**
 * Integration to the blockchain
 * Ideally we don't do this, but I built the code originally using 
 * redux, then realised wagmi doesn't have a solid hook. Drizzle 
 * has redux integration but it doesn't work with Ethers.js 
 * 
 * So after going down multiple rabbitholes I said stuff it lets
 * build it this way first and then figure it out later.
 * 
 * I'd put everything in a bunch of hooks if I could do this again!
 */

/**
 * Player Todo: 
 * 1. listen for event when user registers, update the player list 
 * 2. check if the user has connected, if the user has connected update connect state
 * 
 * Moves Todo:
 * 1. Show move proposal on the website
 * 2. Integrate with lichess to show best score
 * 3. Indicate which move was proposed / voted on by the user
 */

const Integrator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount({
    onConnect: ({ address }) => {
      if (address) {

      }
      console.log(" -- connected", address);
    }
  });

  const {loading, gameState, reload} = useGameState({});
  useControllerEvents({
    'MoveMade': readData,
    'MoveProposed': readData,
    'UserRegistered': loadPlayers,
    'NewGameCreated': readData
  });

  async function loadPlayers() {
    const gameState = await reload();

    if (gameState?.blackPlayers) {
      dispatch(setBlackPlayers(gameState.blackPlayers.map(e => ({ wallet: e }))));
    }
    if (gameState?.whitePlayers) {
      dispatch(setBlackPlayers(gameState.whitePlayers.map(e => ({ wallet: e }))));
    }
  }

  async function readData() {
    const gameState = await reload();

    if (!gameState) {
      return;
    }
    
    console.log(gameState);
    dispatch(setCurrentPlayer(gameState?.isBlackToPlay ? Colors.BLACK : Colors.WHITE))
    dispatch(setTimer(toNumber(gameState?.nextPlayTimer!) * 1000));
    dispatch(setFigures(initialiseBoardFromFEN(gameState?.currentGameState!)));
    dispatch(setFENState(gameState.currentGameState!));
    dispatch(setBlackPlayers(gameState.blackPlayers!.map(e => ({ wallet: e }))));
    dispatch(setWhitePlayers(gameState.whitePlayers!.map(e => ({ wallet: e }))));

    if (address && gameState.blackPlayers!.indexOf(address!) >= 0) {
      dispatch(setJoined(true));
      dispatch(setColor(Colors.BLACK));
    }

    if (address && gameState.whitePlayers!.indexOf(address!) >= 0) {
      dispatch(setJoined(true));
      dispatch(setColor(Colors.WHITE));
    }
    console.log(initialiseBoardFromFEN(initialFEN));
    console.log(hexToAscii(gameState?.movesHistory!));

    const { moves, captures } = makeMoves(initialiseBoardFromFEN(initialFEN), hexToAscii(gameState?.movesHistory!));

    dispatch(setPlayHistory(moves));
    dispatch(setPiecesCaptured(captures));
    dispatch(setCurrentStep(Number(gameState.currentStep)));
    console.log('latest', gameState.gameId);
    dispatch(setLatestGameId(Number(gameState.gameId!)));
    dispatch(setNftDetails({
      name: "FKC",
      desc: "FortKnight Chess",
      total: +(Number(gameState.gameId) || 0).toString()
    }));

    console.log(gameState!.proposedMoves);
    if (gameState!.proposedMoves!.length > 0) {
      hexToAscii(gameState!.proposedMoves!).forEach((m, i) => {
        dispatch(proposeMove([m, gameState!.proposedMovesCount![i]]));
      })
    }

  }

  useEffect(() => {
    readData();
  }, [])

  return (<></>)
}

export default Integrator;