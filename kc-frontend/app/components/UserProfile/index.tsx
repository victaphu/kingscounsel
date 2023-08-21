import React, { useState } from "react";
import { getPlayerIcon } from "@/app/common/lib";
import { Colors, Figures } from "@/app/common/types";
import Figure from "../Figure/Figure";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { disconnect } from "process";
import { FaGoogle } from "react-icons/fa6";

interface UserProfileProps {
}

const SampleUser = {
  wallet: '0x3aF05A1e7396c000d7a77c32983c85CF8ECa0933',
  lineaBalance: '1201',
  polygonBalance: '1023',
  gamesPlayed: [
    {
      nftId: 1,
      color: Colors.WHITE,
      won: false,
      tokens: 1022
    },
    {
      nftId: 2,
      color: Colors.WHITE,
      won: false,
      tokens: 10242
    },
    {
      nftId: 3,
      color: Colors.BLACK,
      won: false,
      tokens: 1034
    },
    {
      nftId: 4,
      color: Colors.WHITE,
      won: true,
      tokens: 1077
    }
  ],
}

const WHITE_PIECE = <Figure figure={{ id: "-1", name: Figures.KING, x: 1, y: 1, color: Colors.WHITE }} figureClicked={() => { }} isStandalone={true} additionalStyles={' w-8 top-2 '} />
const BLACK_PIECE = <Figure figure={{ id: "-1", name: Figures.KING, x: 1, y: 1, color: Colors.BLACK }} figureClicked={() => { }} isStandalone={true} additionalStyles={' w-8 top-2 '} />


const UserProfile: React.FC<UserProfileProps> = (props: UserProfileProps) => {
  const [connected, setConnected] = useState(false);
  const { connector, isConnected, address } = useAccount();
  const { disconnect } = useDisconnect()
  const { connectAsync, connectors, error, isLoading, pendingConnector } = useConnect();

  // return <div className="">
  //   <button>Connect Wallet</button>
  //   Battle Tokens (?)
  //   Linea Balance
  //   Polygon Balance
  //   Total Games Played
  //   Win / Loss Ratio
  //   Play History
  // </div>

  if (isConnected && address) {
    return (<div className="drop-shadow-md hero min-h-full rounded-xl overflow-hidden" style={{ backgroundImage: 'url(/images/black-king.jpeg)' }}>
      <div className="hero-overlay bg-opacity-90"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-xl flex flex-col gap-2">
          <h1 className="mb-5 text-3xl font-bold">User Profile</h1>
          <div className="form-control w-full max-w-xs gap-2">
            <div className="flex flex-row">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  {getPlayerIcon({ wallet: address })}
                </div>
              </div>
              <div className="text-sm">{address}</div>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Battle Token Balance</span>
              </label>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title flex flex-col">Linea</div>
                  <div className="stat-value">{SampleUser.lineaBalance}</div>
                </div>
                <div className="stat">
                  <div className="stat-title flex flex-col">Polygon</div>
                  <div className="stat-value">{SampleUser.polygonBalance}</div>
                </div>
              </div>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Win Percentage (25%)</span>
              </label>
              <progress className="progress progress-error w-full" value={25} max={100}></progress>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>NFT</th>
                  <th>Color Played</th>
                  <th>Total Tokens</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {
                  SampleUser.gamesPlayed.map(game => {
                    return <tr className="cursor-pointer hover" onClick={() => window.open(`/history/${game.nftId}`)}>
                      <td className="relative hover">{game.nftId}</td>
                      <td className="relative hover">{game.color === Colors.WHITE ? WHITE_PIECE : BLACK_PIECE}</td>
                      <td className="relative hover">{game.tokens}</td>
                      <td className="relative hover">{game.won ? <div className="badge badge-success gap-2">Won!</div> : <div className="badge badge-error gap-2">Lost</div>}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>

          <div className="join">
            <button className="btn btn-secondary join-item">Transactions</button>
            <button className="btn btn-primary join-item" onClick={e => disconnect()}>Disconnect</button>
          </div>
        </div>
      </div>
    </div>)
  }

  const joinTeam = async (type: number) => {
    const result = await connectAsync({ connector: connectors[type] });
    console.log(result);

  }

  return (<div className="drop-shadow-md hero min-h-full rounded-xl overflow-hidden" style={{ backgroundImage: 'url(/images/white-king.jpeg)' }}>
    <div className="hero-overlay bg-opacity-90"></div>
    <div className="hero-content text-center text-neutral-content">
      <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">Battle Chess</h1>
        <p className="mb-5">Crowd-sourced strategy meets chess.
          Cast your move, team up, and conquer the board.
          The ultimate mind game awaits! 🛡️♟️</p>
        {!isConnected && <div className="join gap-1">
          <button className="btn join-item w-16" onClick={e => joinTeam(1)}><img src="/images/metamask.png" /></button>
          <button className="btn join-item w-16" onClick={e => joinTeam(2)}><img src="/images/walletconnect.png" /></button>
          <button className="btn join-item" onClick={e => joinTeam(0)}><FaGoogle /></button>
        </div>}
      </div>
    </div>
  </div>)
}

export default UserProfile;