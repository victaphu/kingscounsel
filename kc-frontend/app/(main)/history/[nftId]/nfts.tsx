"use client"
import ChessGame from "@/app/components/Board"
import { selectNftDetails, setFigures, setNftDetails, setPiecesCaptured, setPlayHistory, setSelectedNft } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useEffect } from "react";
import { useContractReads } from "wagmi";
import gameObj from "@/app/abi/FKCGame.json";
import controller from "@/app/abi/FKCController.json";
import { BigNumberish } from "ethers";
import { hexToAscii, initialiseBoardFromFEN, makeMoves } from "@/app/common/lib";
import { initialFEN } from "@/app/common/initialPos";

export default function NftLoader({ params }: { params: { nftId: string } }) {
  const nft = params.nftId;
  const dispatch = useAppDispatch();

  const { data, isError, isLoading, isSuccess } = useContractReads({
    contracts: [

      {
        address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCGAME!}`,
        abi: gameObj.abi,
        functionName: 'name',
      },
      {
        address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCGAME!}`,
        abi: gameObj.abi,
        functionName: 'symbol',
      },
      {
        address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCGAME!}`,
        abi: gameObj.abi,
        functionName: 'getGameState',
        args: [nft]
      },
      {
        address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER!}`,
        abi: controller.abi,
        functionName: 'currentToken'
      }
    ],
    watch: true
  });

  useEffect(() => {

    if (!data || !isSuccess) {
      return
    }
    console.log(data);
    dispatch(setNftDetails({
      name: data[1].result! as string,
      desc: data[0].result! as string,
      total: +(data[3].result as BigNumberish).toString()
    }));

    const gameState = data[2].result as { movesHistory: Array<string>, currentGameState: string, gameCompleted: boolean, result: BigNumberish };    
    console.log(initialiseBoardFromFEN(initialFEN));
    console.log(hexToAscii(gameState?.movesHistory!));

    const { moves, captures } = makeMoves(initialiseBoardFromFEN(initialFEN), hexToAscii(gameState?.movesHistory!));

    // dispatch(setPlayHistory(moves));
    dispatch(setPiecesCaptured(captures));
    dispatch(setSelectedNft({
      boardState: initialiseBoardFromFEN(gameState?.currentGameState!),
      mintDate: new Date().toString(),
      moves: moves,
      nftId: +nft
    }));

  }, [data]);

  if (isNaN(+nft)) {
    // invalid
  }

  return (<ChessGame replayMode={true} />

  )
}
