"use client"
import React, { useEffect, useState } from "react";
import { readContracts, useAccount, useChainId, useContractEvent } from 'wagmi'
import fkcController from '@/app/abi/FKCController.json';
import { useAppDispatch } from "@/app/redux/hooks";
import { hexToAscii, initialiseBoardFromFEN, makeMoves } from "@/app/common/lib";
import { proposeMove, setCurrentPlayer, setFigures, setNftDetails, setPiecesCaptured, setPlayHistory, setTimer } from "@/app/redux/gameSlice";
import { Colors, ContractGameState, ContractMovesHistory } from "@/app/common/types";
import { toNumber } from "ethers";
import { initialFEN } from "@/app/common/initialPos";

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
  const chainId = useChainId();
  const { connector, isConnected, address } = useAccount();

  const [reload, setReload] = useState(false);
  useContractEvent({
    chainId: chainId,
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER}`,
    abi: fkcController.abi,
    eventName: "MoveMade",
    listener(log) {
      console.log(log);
      setReload((e => !e));
    }
  });

  console.log(reload, chainId, 'reloading', process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER);

  async function readData() {
    const data = await readContracts({
      contracts: [
        {
          chainId,
          address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER!}`,
          abi: [{
            "inputs": [],
            "name": "getCurrentGameState",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "address[]",
                    "name": "whitePlayers",
                    "type": "address[]"
                  },
                  {
                    "internalType": "address[]",
                    "name": "blackPlayers",
                    "type": "address[]"
                  },
                  {
                    "internalType": "string",
                    "name": "currentGameState",
                    "type": "string"
                  },
                  {
                    "internalType": "bytes4[]",
                    "name": "movesHistory",
                    "type": "bytes4[]"
                  },
                  {
                    "internalType": "bool",
                    "name": "gameCompleted",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint8",
                    "name": "result",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IFKCGame.GameState",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }],
          functionName: 'getCurrentGameState'
        },
        {
          chainId,
          address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER!}`,
          abi: [{
            "inputs": [],
            "name": "getCurrentGame",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "nextPlayTimer",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bool",
                    "name": "isBlackToPlay",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalTokens",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes4[]",
                    "name": "proposedMoves",
                    "type": "bytes4[]"
                  },
                  {
                    "internalType": "uint256",
                    "name": "proposeResign",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "proposeDraw",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "currentStep",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct FKCController.Game",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }],
          functionName: 'getCurrentGame'
        },
        {
          chainId,
          address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER!}`,
          abi: [{
            "inputs": [],
            "name": "currentToken",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },],
          functionName: 'currentToken'
        }
      ]
    });
    const game = data[1].result as ContractGameState;
    const gameState = data[0].result as ContractMovesHistory;
    console.log(game, gameState);
    dispatch(setCurrentPlayer(game?.isBlackToPlay ? Colors.BLACK : Colors.WHITE))
    dispatch(setTimer(toNumber(game?.nextPlayTimer!) * 1000));
    dispatch(setFigures(initialiseBoardFromFEN(gameState?.currentGameState!)));

    console.log(initialiseBoardFromFEN(initialFEN));
    console.log(hexToAscii(gameState?.movesHistory!));

    const { moves, captures } = makeMoves(initialiseBoardFromFEN(initialFEN), hexToAscii(gameState?.movesHistory!));

    dispatch(setPlayHistory(moves));
    dispatch(setPiecesCaptured(captures));
    dispatch(setNftDetails({
      name: "FKC",
      desc: "FortKnight Chess",
      total: +(data[2].result || 0).toString()
    }));

    console.log(game!.proposedMoves);
    if (game!.proposedMoves.length > 0) {
      hexToAscii(game!.proposedMoves).forEach(m => {
        dispatch(proposeMove(m));
      })
    }
  }

  useEffect(() => {
    readData();
  }, [reload]);

  return (<></>)
}

export default Integrator;