"use client"
import React from "react";
import { Colors, Move, Player } from "@/app/common/types";
import { getOtherColor, getPlayerIcon } from "@/app/common/lib";
import { useAppDispatch } from "@/app/redux/hooks";
import { setColor, setJoined, setShowJoin } from "@/app/redux/gameSlice";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { FaGoogle, FaQrcode } from "react-icons/fa6";
import { AbstractProvider } from "ethers";
import { lineaTestnet, localhost } from "viem/chains";

interface JoinTeamProps {
  show?: boolean,
  colour: Colors,
  moves: Array<Move>
}

const JoinTeamDialog: React.FC<JoinTeamProps> = (props: JoinTeamProps) => {
  const dispatch = useAppDispatch();
  const { connector, isConnected, address } = useAccount();
  const { connectAsync, connectors, error, isLoading, pendingConnector } = useConnect();
  const { chains, pendingChainId, switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();

  console.log("Is connected", isConnected, connector, address);

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
    console.log('join-team', type);
    // connect the team
    dispatch(setJoined(true));
    if (!isConnected) {
      const provider: AbstractProvider = await connectors[type].getProvider();
      // connect first then join the team
      const result = await connectAsync({ connector: connectors[type] });
      console.log(result);
    }
    
    // if (chain !== lineaTestnet && switchNetworkAsync) {
    //   await switchNetworkAsync(lineaTestnet.id);
    // }
    if (chain !== localhost && switchNetworkAsync) {
      await switchNetworkAsync(localhost.id);
    }

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