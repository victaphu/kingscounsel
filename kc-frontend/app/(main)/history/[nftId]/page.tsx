"use client"
import nfts from "@/app/common/mock";
import ChessGame from "@/app/components/Board"
import wagmiConfig from "@/app/config/Web3Config";
import { resetGame, selectNftDetails, setSelectedNft } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useEffect } from "react";
import { WagmiConfig } from "wagmi";

export default function NftViewer({ params }: { params: { nftId: string } }) {
  const nft = params.nftId;
  const nftDetails = useAppSelector(selectNftDetails);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNaN(+nft)) {
      // invalid
      return;
    }
    dispatch(resetGame());
    dispatch(setSelectedNft(nfts[+nft]));
  }, [nft]);

  if (!nftDetails) {
    // invalid
  }

  if (isNaN(+nft)) {
    // invalid
  }

  return (<WagmiConfig config={wagmiConfig}>
    <ChessGame replayMode={true} />
  </WagmiConfig>
  )
}
