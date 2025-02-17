import React, { useState } from 'react';
import MyComponent from './chatbot/mainchat';

const ChatBox = ({ isOpen }) => {
  const [inputValue, setInputValue] = useState(''); 
  return (
    <div
      className={`${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } transition-all duration-300 ease-in-out transform mt-4 w-80 border bg-white flex border-gray-300 rounded-lg shadow-lg p-4 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <MyComponent/>
    </div>
  );
};

export default ChatBox;
