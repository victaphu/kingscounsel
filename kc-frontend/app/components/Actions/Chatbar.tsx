import EmojiPicker from "emoji-picker-react";
import React from "react";
import { FaUsers, FaGlobe, FaList, FaPaperPlane, FaRegFaceSmile } from "react-icons/fa6";
interface ChatbarProps {
}

const Chatbar: React.FC<ChatbarProps> = (props: ChatbarProps) => {
  return <div className="flex p-4 gap-4 rounded-se-xl">
    <button><FaRegFaceSmile/></button>
    <textarea cols={1} className="textarea focus textarea-bordered flex-1"></textarea>
    <button><FaPaperPlane /></button>
  </div>
}

export default Chatbar;