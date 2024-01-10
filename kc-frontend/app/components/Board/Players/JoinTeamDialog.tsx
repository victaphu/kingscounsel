"use client"
import React from "react";
import { Colors, Move } from "@/app/common/types";
import { getOtherColor } from "@/app/common/lib";
import { useAppDispatch } from "@/app/redux/hooks";
import { setColor, setJoined, setShowJoin } from "@/app/redux/gameSlice";
import { useAccount } from "wagmi";
import { FaGoogle } from "react-icons/fa6";
import GameService from "@/app/services/GameService";

interface JoinTeamProps {
  show?: boolean,
  colour: Colors,
  moves: Array<Move>
}

/**
 * Todo:
 * - When user clicks join team, 
 * - Check if user connected wallet; connect wallet if not
 * - Check the chain is correct, set to correct chain
 * - trigger smart contract call that wil make user join the team
 * - consider collecting entrance fee at this point
 * - Update the team the user is on
 */

const JoinTeamDialog: React.FC<JoinTeamProps> = (props: JoinTeamProps) => {
  const dispatch = useAppDispatch();
  const { isConnected, address } = useAccount();

  let desc = `The ${props.colour} Team welcomes your contribution! Join us in our epic battle against the ${getOtherColor(props.colour)} Team! `
  // if (props.moves.length <= 20) {
  desc += `As the game has progressed quite a bit, you can buy in to the game by paying ${Math.ceil(props.moves.length / 2)} AC tokens.`
  // }
  // else {
  //   desc = `Join us in the next game! The current game has progressed past 10 moves each side.`
  // }

  const dismiss = () => {
    dispatch(setShowJoin(false));
  }

  const joinTeam = async (type: number) => {
    const result = await GameService.joinTeam(props.colour === Colors.BLACK);
    console.log(result);

    dispatch(setJoined(true));
    dispatch(setColor(props.colour));
    dismiss();
  }

  return (<div className={"modal w-full " + (props.show ? 'modal-open' : '')}>
    {/* <form method="dialog" className="modal-box flex flex-col w-full"> */}
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure><img src={`/images/${props.colour === Colors.WHITE ? 'white-king.jpeg' : 'black-king.jpeg'}`} alt="Shoes" /></figure>
      <div className="card-body">
        <h3 className="font-bold text-lg">Join the {props.colour.toUpperCase()} Team!</h3>
        {isConnected && <div className="text-xs">Connected: {address}</div>}
        <p>{desc}</p>
        <div className="modal-action">
          {!isConnected && <div className="join gap-1">
            <button className="btn join-item w-16" onClick={e => joinTeam(1)}><img src="/images/metamask.png" /></button>
            <button className="btn join-item w-16" onClick={e => joinTeam(2)}><img src="/images/walletconnect.png" /></button>
            <button className="btn join-item" onClick={e => joinTeam(0)}><FaGoogle /></button>
          </div>}
          {isConnected && <button className="btn bg-primary" onClick={e => joinTeam(0)}>Join Us!</button>}
          {<button className="btn" onClick={dismiss}>Maybe Later</button>}
          {/* {props.moves.length > 20 && <button className="btn" onClick={dismiss}>Ok!</button>} */}
        </div>
      </div>
    </div>

    {/* </form> */}
  </div>)
}

export default JoinTeamDialog;