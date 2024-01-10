import { selectCurrentPlayer, selectNftDetails, setGameStarted, setGameWon } from "@/app/redux/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import React from "react";
import { FaBars, FaChess, FaChessBoard, FaRegCircleQuestion, FaRegUser, FaTrophy } from "react-icons/fa6";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useSignMessage } from "wagmi";

interface MenuProps {
}

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const dispatch = useAppDispatch();
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const pathname = usePathname()
  const nftDetails = useAppSelector(selectNftDetails);

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'gm wagmi frens :)'
  })

  const resetBoard = () => {
    dispatch(setGameWon(currentPlayer));
    dispatch(setGameStarted(false));
    // dispatch(resetGame());;
  }

  console.log(data);

  return <div className="rounded-s-lg bg-base-300 h-full motion-reduce:!opacity-100" style={{ "opacity": "1" }}>
    <ul className="menu">
      <li className="menu-title lg:text-xl text-md" onClick={() => signMessage()}>
        <FaBars />
      </li>
      <li>
        <button tabIndex={-1} className={"lg:text-xl text-md " + (pathname === '/' ? 'active' : '')} aria-label="tailwindcss button" title="Current">
          <Link href="/"><FaChessBoard /></Link>
        </button>
      </li>
      <li>
        <button tabIndex={-1} className={" lg:text-xl text-md " + (pathname.startsWith('/history') ? 'active' : '')} aria-label="tailwindcss button" title="History">
          <Link href={`/history/${nftDetails ? nftDetails.total - 1 : 0}`}><FaChess /></Link>
        </button>
      </li>
      <li>
        <button tabIndex={-1} className={" lg:text-xl text-md " + (pathname === '/userProfile' ? 'active' : '')} aria-label="tailwindcss button" title="User Settings">
        <Link href={`/userProfile`}><FaRegUser /></Link>
        </button>
      </li>
    </ul>
    <div className="text-center btm-nav sticky">
      <button tabIndex={-1} className=" lg:text-xl text-md" aria-label="tailwindcss button">
        <FaRegCircleQuestion />
      </button>
    </div>
  </div>
}

export default Menu;