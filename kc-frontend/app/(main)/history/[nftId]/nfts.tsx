"use client"
import ChessGame from "@/app/components/Board"
import { setNftDetails, setPiecesCaptured, setSelectedNft } from "@/app/redux/gameSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { useEffect } from "react";
import { hexToAscii, initialiseBoardFromFEN, makeMoves } from "@/app/common/lib";
import { initialFEN } from "@/app/common/initialPos";
import useGameState from "@/app/redux/blockchain/useGameState";

export default function NftLoader({ params }: { params: { nftId: string } }) {
  const nft = params.nftId;
  const dispatch = useAppDispatch();
  const {loading, reload} = useGameState({ nftId: nft ? +nft : undefined });

  async function reloadNft() {
    const state = await reload();

    if (!state) {
      // issue!
      return;
    }

    dispatch(setNftDetails({
      name: state.name!,
      desc: state.desc!,
      total: Number(state.totalTokens!)
    }));

    const gameState = state;
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

  }

  useEffect(() => {
    reloadNft();
  }, [nft]);

  if (isNaN(+nft)) {
    // invalid
  }

  return (<ChessGame replayMode={true} />

  )
}
