"use client"
import wagmiConfig from "@/app/config/Web3Config";
import { WagmiConfig } from "wagmi";
import NftLoader from "./nfts";

export default function Page({ params }: { params: { nftId: string } }) {
  
  return (<WagmiConfig config={wagmiConfig}>
    <NftLoader params={params}/>
  </WagmiConfig>
  )
}
