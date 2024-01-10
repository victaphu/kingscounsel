import { useAppSelector } from "../hooks";
import { selectCurrentStep } from "../gameSlice";
import { ethers } from "ethers";
import APIClient from "@/app/adapters/APIClient";

export default function useMoveSubmit() {
  const step = useAppSelector(selectCurrentStep);
  
  return {
    submitMove: async ({ move }: { move: string }) => {
      const result = await APIClient.writeController('requestMove', ethers.hexlify(ethers.toUtf8Bytes(move)), step);
      console.log('result is', result);
    }
  }
}