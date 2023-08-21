"use client"
import { selectReplayMode } from "@/app/redux/gameSlice";
import { useAppSelector } from "@/app/redux/hooks";
import React, { useEffect, useState } from "react";
import { FaUsers, FaGlobe, FaList } from "react-icons/fa6";
interface ToolbarProps {
  changeTab: (e:number) => void
}

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
  const [tab, setTab] = useState(0);
  const replayMode = useAppSelector(selectReplayMode);

  const getActive = (t:number) => tab === t ? 'active' : '';
  const changeTab = (e:number) => {
    setTab(e);
    props.changeTab(e);
  }

  useEffect(() => {
    if (replayMode) {
      changeTab(2);
    }
  }, [replayMode])

  return <div className="btm-nav sticky rounded-ee-lg">
    {!replayMode && <><button className={getActive(0)} onClick={() => changeTab(0)}>
      <FaGlobe/>
      <span className="btm-nav-label text-sm">Global</span>
    </button>
    <button className={getActive(1)} onClick={() => changeTab(1)}>
      <FaUsers/>
      <span className="btm-nav-label text-sm">Team</span>
    </button></>
    }
    <button className={getActive(2)} onClick={() => changeTab(2)}>
      <FaList/>
      <span className="btm-nav-label text-sm">Moves</span>
    </button>
  </div>
}

export default Toolbar;