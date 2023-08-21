"use client"
import React from "react";
import { Player } from "@/app/common/types";
import { getPlayerIcon } from "@/app/common/lib";

interface PlayerProps {
  players?: Array<Player>,
  show?: boolean,
  setShow: (show: boolean) => void 
}

const PlayerList: React.FC<PlayerProps> = (props: PlayerProps) => {
  if (!props.players || props.players.length === 0) {
    return <></>;
  }

  return (<div className={"modal w-full " + (props.show ? 'modal-open' : '')}>
    <form method="dialog" className="modal-box flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="">
            <tr>
              <th>Image</th>
              <th>Wallet</th>
            </tr>
          </thead>
          <tbody>
            {props.players.map((player, i) => {
              return <tr key={i}>
                <td>{getPlayerIcon(player)}</td>
                <td>{player.wallet}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn" onClick={e=>props.setShow(false)}>Close</button>
      </div>
    </form>
  </div>)
}

export default PlayerList;