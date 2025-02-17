import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage('How can I assist you today?')],
  runInitialMessagesWithHistory : true,
};

export default config;
