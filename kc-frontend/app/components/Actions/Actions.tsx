"use client"
import React, { useState } from "react";
import MessageView from "./MessageView";
import Toolbar from "./Toolbar";
import Timers from "./Timers";
import GlobalMessageView from "./GlobalMessageView";
import MovesView from "./MovesView";

interface ActionProps {
}

const Actions: React.FC<ActionProps> = (props: ActionProps) => {
  const [tab, setTab] = useState(0);

  return <div className="rounded-e-lg h-full xl:w-96 lg:w-80 motion-reduce:!opacity-100 lg:flex flex-col relative hidden" style={{ "opacity": "1" }}>
    <Timers />
    <div className="h-full">
      {tab === 0 && <GlobalMessageView/>}
      {tab === 1 && <MessageView />}
      {tab === 2 && <MovesView/>}

      <Toolbar changeTab={setTab}/>
    </div>
  </div>
}

export default Actions;