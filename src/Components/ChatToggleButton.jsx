import React from 'react';
import { SiChatbot } from "react-icons/si";
const ChatToggleButton = ({ isOpen, toggleChatBox }) => {
  return (
    <button
      onClick={toggleChatBox}
      className="bg-[#2998EC] text-white shadow-md hover:bg-[#2997ecdb] focus:outline-none transition-all duration-300 rounded-full p-5"
    >
      <SiChatbot size={25}/>
    </button>
  );
};

export default ChatToggleButton;
