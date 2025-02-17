import React, { useState } from 'react';
import ChatToggleButton from './ChatToggleButton';
import ChatBox from './ChatBox';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <ChatBox isOpen={isOpen} />
      </div>

      <div className='self-end'>
        <ChatToggleButton isOpen={isOpen} toggleChatBox={toggleChatBox} />
      </div>

    </div>
  );
};

export default Chat;
