"use client"
import UserProfile from "@/app/components/UserProfile";
import wagmiConfig from "@/app/config/Web3Config";
import { WagmiConfig } from "wagmi";

export default function NftViewer({ params }: { params: { nftId: string } }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className='w-full h-full flex flex-col rounded-xl bg-base-200'>
        <UserProfile />
      </div>
    </WagmiConfig>
  )
}
