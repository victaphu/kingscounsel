"use client"
import { useEffect } from "react";
import Board from "./Board";
import Player from "./Players/Player";
import { ethers } from "ethers";
import { Player as PlayerObj } from "@/app/common/types";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { resetGame, selectFigures, selectFilteredFigures, selectJoined, selectMoves, selectPosition, selectRotate, selectShowJoin, selectToJoin, setBlackPlayers, setReplayMode, setWhitePlayers } from "@/app/redux/gameSlice";
import JoinTeamDialog from "./Players/JoinTeamDialog";
import ClientOnly from "../ClientOnly/ClientOnly";
import Integrator from "../Integrations/Integrator";

const createRandomUser = async (): Promise<PlayerObj> => {
  const wallet = ethers.Wallet.createRandom()
  return {
    wallet: wallet.address,
  }
}

async function generate(total: number): Promise<Array<PlayerObj>> {
  const results = [];
  for (let i = 0; i < total; ++i) {
    results.push(await createRandomUser());
  }
  return results;
}

interface ChessGameProps {
  replayMode?: boolean
}

const ChessGame: React.FC<ChessGameProps> = (props: ChessGameProps) => {
  const dispatch = useAppDispatch();
  const rotated = useAppSelector(selectRotate);
  const toJoin = useAppSelector(selectToJoin);
  const moves = useAppSelector(selectMoves);
  const joined = useAppSelector(selectJoined);
  const showJoin = useAppSelector(selectShowJoin);
  const currentBoard = useAppSelector(selectFigures);
  const filteredBoard = useAppSelector(selectFilteredFigures);
  const position = useAppSelector(selectPosition);

  console.log(currentBoard);
  console.log(moves);

  // useEffect(() => {
  //   generate(3).then(r => {
  //     dispatch(setBlackPlayers(r));
  //   });
  //   generate(3).then(r => {
  //     dispatch(setWhitePlayers(r));
  //   })
  // }, []);

  useEffect(() => {
    dispatch(setReplayMode(props.replayMode ? true : false));
    if (!props.replayMode) {
      dispatch(resetGame());
    }
  }, [props.replayMode])

  const black = <Player isWhite={false} replayMode={props.replayMode} />
  const white = <Player isWhite={true} replayMode={props.replayMode} />
  return (<div className='w-full h-full flex flex-col rounded-xl bg-base-200'>
    {rotated ? white : black}
    <ClientOnly>
      {!props.replayMode && <Integrator/>}
      {!joined && <JoinTeamDialog colour={toJoin} moves={moves} show={showJoin} />}
    </ClientOnly>
    <Board currentBoard={position >= 0 ? filteredBoard : currentBoard} replayMode={props.replayMode} />
    {rotated ? black : white}
  </div>);
}

export default ChessGame;
