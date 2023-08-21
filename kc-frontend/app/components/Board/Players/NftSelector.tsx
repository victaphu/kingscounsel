"use client"
import { selectNftDetails, selectSelectedNft } from "@/app/redux/gameSlice";
import { useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import React from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

const NftSelector = () => {
  const nfts = useAppSelector(selectSelectedNft);
  const nftDetails = useAppSelector(selectNftDetails);

  if (!nfts || !nftDetails) {
    return <>Loading</>;
  }

  const nftId = nfts.nftId
  const hasNext = nftDetails.total > nftId + 1;
  const name = nftDetails.name;

  return (<div className={"items-center text-center flex flex-row gap-1 relative "}>
    <span className="font-mono lg:text-lg text-sm">{name + ' ' + nftId}</span>
    <div>
      <Link href={`/history/${nftId === 0 ? 0 : nftId - 1}`} className={"btn btn-circle lg:btn-md btn-xs lg:text-2xl text-lg " + (nftId === 0 ? ' text-gray-500' : '')}><FaCircleChevronLeft /></Link>
      {hasNext && <Link href={`/history/${nftId + 1}`} className={"btn btn-circle lg:btn-md btn-xs lg:text-2xl text-lg"}><FaCircleChevronRight /></Link>}
      {!hasNext && <button disabled className={"btn btn-circle lg:btn-md btn-xs lg:text-2xl text-lg"}><FaCircleChevronRight /></button>}
    </div>
  </div>)
}
export default NftSelector;