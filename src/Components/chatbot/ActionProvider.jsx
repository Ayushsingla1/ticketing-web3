import React, { useState } from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const callGaianetAPI = async (message) => {
    try {
        const response = await fetch('https://backend-ticketing.onrender.com/chatbot', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }) 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text(); 
        const botMessage = createChatBotMessage(data);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    } catch (error) {
        console.error('Error:', error);
    } 

};

  return (
    
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            callGaianetAPI
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;