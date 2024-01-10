import Game from "@/app/model/Game";
import GameState from "@/app/repository/GameState";
import { useEffect, useState } from "react";

export default function useGameState({nftId} : {nftId?: number}) {
  const [gameState, setGameState] = useState<Game | undefined>();
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    let f = GameState.loadLatestGameState;
    if (nftId && !Number.isNaN(nftId)) {
      f = ()=>GameState.loadGameState(nftId!);
    }
    // f().then(setGameState).catch(console.error).finally(()=>setLoading(false));
    const result = await f();
    console.log('result', result);
    setGameState(result);
    setLoading(false);
    return result;
  }

  return { loading, gameState, reload }
}