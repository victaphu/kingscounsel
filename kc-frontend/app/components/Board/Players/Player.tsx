"use client"
import React, { useEffect, useState } from "react";
import { Colors, Player } from "@/app/common/types";
import CapturedPieces from "./CapturedPieces";
import { selectColor, selectCurrentPlayer, selectEatenPieces, selectGameWon, selectIsGameStarted, selectJoined, selectTimer } from "@/app/redux/gameSlice";
import { useAppSelector } from "@/app/redux/hooks";
import Countdown, { CountdownApi, calcTimeDelta } from 'react-countdown';
import PlayerList from "./PlayersList";
import { renderPlayers } from "@/app/common/lib";
import JoinButton from "./JoinTeamButton";
import JoinedTeamToolbar from "./JoinedTeamToolbar";
import NftSelector from "./NftSelector";

import fkcController from "@/app/abi/FKCController.json";
import { useChainId, useContractRead } from "wagmi";
import ClientOnly from "../../ClientOnly/ClientOnly";

interface PlayerProps {
  isWhite: boolean,
  players?: Array<Player>,
  replayMode?: boolean,
}

interface CountdownProps {
  minutes: number
  seconds: number
  completed: boolean
  total: number
  api: CountdownApi
}

interface GameState {
  whitePlayers: Array<string>
  blackPlayers: Array<string>
}

const PlayerViewer: React.FC<PlayerProps> = (props: PlayerProps) => {
  const [open, setOpen] = useState(false);
  const chainId = useChainId();

  const { data, isLoading, isSuccess }: { data: GameState | undefined, isLoading: boolean, isSuccess: boolean } = useContractRead({
    abi: fkcController.abi,
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER!}`,
    functionName: "getCurrentGameState",
    chainId: chainId,
  })

  const players: Array<Player> | undefined = (props.isWhite ? data?.whitePlayers : data?.blackPlayers)?.map(e => ({ wallet: e }));
  console.log(players);

  const handleClicked = () => {
    if (!players || players.length === 0) {
      return;
    }
    setOpen((state) => !state)
  };

  return <>
    <PlayerList show={open} players={players} setShow={setOpen} />
    <div onClick={handleClicked}>
      {renderPlayers(players)}
    </div>
  </>
}

const TimerRender: React.FC<PlayerProps> = (props: PlayerProps) => {
  const [api, setApi] = useState<CountdownApi>();
  const gameStarted = useAppSelector(selectIsGameStarted);
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const timer = useAppSelector(selectTimer);
  const gameWon = useAppSelector(selectGameWon);
  const replayMode = props.replayMode;

  useEffect(() => {
    if (timer <= Date.now()) {
      api?.stop();
    }
  }, [timer]);

  useEffect(() => {
    if (gameWon) {
      api?.stop();
      return;
    }
    if (currentPlayer === (props.isWhite ? Colors.WHITE : Colors.BLACK) && gameStarted) {
      api?.start();
    }
    else {
      api?.stop();
    }
  }, [currentPlayer, gameStarted, replayMode, gameWon]);


  const renderCountdown = ({ total, minutes, seconds, completed, api }: CountdownProps) => {
    if (Date.now() - timer >= 0) {
      minutes = 10;
      seconds = 0;
      if (currentPlayer === (props.isWhite ? Colors.WHITE : Colors.BLACK)) {
        seconds = 0;
        minutes = 0;
      }
      // api.stop();
    }
    else if (currentPlayer === (props.isWhite ? Colors.WHITE : Colors.BLACK)) {
      const delta = calcTimeDelta(timer);
      minutes = delta.minutes;
      seconds = delta.seconds;
    }

    return (<div className="grid grid-flow-col gap-2 text-center auto-cols-max">
      <ClientOnly>
        <div className="lg:flex lg:flex-col p-2 bg-neutral rounded-box text-neutral-content lg:visible hidden">
          <span className="countdown font-mono text-lg">
            <span style={{ "--value": minutes } as React.CSSProperties}></span>
          </span>
          <span className="text-xs">min</span>
        </div>
        <div className="lg:flex lg:flex-col p-2 bg-neutral rounded-box text-neutral-content lg:visible hidden">
          <span className="countdown font-mono text-lg">
            <span style={{ "--value": seconds } as React.CSSProperties}></span>
          </span>
          <span className="text-xs">sec</span>
        </div>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content lg:hidden items-end">
          <span className="countdown font-mono text-sm">
            <span style={{ "--value": minutes } as React.CSSProperties} className="pr-1"></span>m
          </span>
          <span className="countdown font-mono text-sm">
            <span style={{ "--value": seconds } as React.CSSProperties} className="pr-1"></span>s
          </span>
        </div>
      </ClientOnly>
    </div>);
  }

  return <Countdown date={timer} renderer={renderCountdown} ref={e => setApi(e?.api)} autoStart={false} now={() => Date.now()} />
}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const image = props.isWhite ? 'linea.png' : 'matic.png';
  const piecesEaten = useAppSelector(selectEatenPieces);
  const joined = useAppSelector(selectJoined);
  const color = useAppSelector(selectColor);
  const replayMode = props.replayMode;

  return (<div className="w-full p-2 cursor-pointer">
    <div className="flex flex-row lg:gap-4 p-2">
      <div className="avatar">
        <div className="lg:w-12 w-10 lg:h-12 h-10 rounded-full">
          <img src={`/images/${image}`} />
        </div>
      </div>
      <div className="flex-1">

        <ClientOnly>
          <PlayerViewer {...props} />
        </ClientOnly>

        <CapturedPieces piecesWon={piecesEaten.filter(e => props.isWhite ? e.color === Colors.BLACK : e.color === Colors.WHITE)} />
      </div>
      {!replayMode && <TimerRender {...props} />}
      {!replayMode && <JoinButton {...props} />}
      {!replayMode && joined && color === (props.isWhite ? Colors.WHITE : Colors.BLACK) && <JoinedTeamToolbar />}
      {replayMode && !props.isWhite && <NftSelector />}
    </div>
  </div>)
}

export default Player;