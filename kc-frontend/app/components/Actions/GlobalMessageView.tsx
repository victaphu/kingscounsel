import React, { useEffect, useState } from "react";
import NavBar from "./Navbar";
import Chatbar from "./Chatbar";
import GlobalChatState from "@/app/repository/GlobalChatState";
import { useAppSelector } from "@/app/redux/hooks";
import useGameState from "@/app/redux/blockchain/useGameState";
import { selectLatestGameId } from "@/app/redux/gameSlice";

interface GlobalMessageViewProps {
}

const GlobalMessageView: React.FC<GlobalMessageViewProps> = (props: GlobalMessageViewProps) => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const currentId = useAppSelector(selectLatestGameId);
  useEffect(() => {
    if (currentId <= 0) {
      return;
    }
    GlobalChatState.loadGlobalChat(currentId).then(console.log);
    const listener = (chat: any) => {
      console.log('chat', chat);
    };
    GlobalChatState.listenForGlobalChat(listener);
    return () => {
      GlobalChatState.unlistenForGlobalChat(listener);
    }
  }, [currentId])

  return <div className="h-full rounded-se-lg bg-base-200 flex flex-col">
    <NavBar title="Global Messages" />
    <div className="p-8 overflow-y-scroll flex-1">

      {/* <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/men/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>

      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="https://randomuser.me/api/portraits/thumb/women/75.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
      </div> */}
    </div>
    <Chatbar />
  </div>
}

export default GlobalMessageView;