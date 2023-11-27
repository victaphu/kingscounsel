"use client"
import React, { useEffect, useState } from "react";
import { useChainId, useContractEvent, useContractReads } from 'wagmi'
import fkcController from '@/app/abi/FKCController.json';
import { useAppDispatch } from "@/app/redux/hooks";
import { convertMoveToPosition, findPiece, hexToAscii, initialiseBoardFromFEN, isPieceAtPosition, makeMoves } from "@/app/common/lib";
import { proposeMove, setColor, setCurrentPlayer, setFigures, setNftDetails, setPiecesCaptured, setPlayHistory, setTimer } from "@/app/redux/gameSlice";
import { Colors, FigureData, Figures, FiguresMap, Move } from "@/app/common/types";
import { BigNumberish, toNumber } from "ethers";
import { initialFEN } from "@/app/common/initialPos";
import { createGame } from "@/app/common/engine";

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

const Integrator: React.FC = () => {
  const dispatch = useAppDispatch();
  const chainId = useChainId();

  const [reload, setReload] = useState(false);
  useContractEvent({
    chainId: chainId,
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER}`,
    abi: fkcController.abi,
    eventName: "MoveProposed",
    listener(log) {
      console.log(log);
      setReload((e => !e));

      // const start = move[0];
      // const from = convertMoveToPosition(start[0] + start[1]);
      // const to = convertMoveToPosition(start[2] + start[3]);
      // const figure = findPiece(figures, from.x, from.y)!;
      // const figureOnCell = findPiece(figures, to.x, to.y);
    }
  });

  console.log(reload, chainId, 'reloading', process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER);

  const { data, isError, isLoading }: {
    data: [
      { result: { movesHistory: Array<string>, currentGameState: string, gameCompleted: boolean, result: BigNumberish } | undefined },
      { result: { isBlackToPlay: boolean, nextPlayTimer: BigNumberish, proposedMoves: Array<string> } | undefined },
      { result: BigNumberish | undefined }
    ] | undefined, isError: boolean, isLoading: boolean
  } = useContractReads({
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
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "currentToken",
              "type": "uint256"
            }
          ],
          "name": "NewGameCreated",
          "type": "event"
        }],
        functionName: 'currentToken'
      }
    ],
    watch: true
  });

  useEffect(() => {
    if (!data || isError || isLoading) {
      return;
    }

    console.log('Data', data);
    const game = data[1].result;
    const gameState = data[0].result;
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

  }, [data])

  return (<></>)
}

export default Integrator;