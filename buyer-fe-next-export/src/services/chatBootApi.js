import utils from '@/utils';
import api from './api';

const getChatbotIntentSee = (data) => {
  // const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/chat-bot/intent/sse?${query}`;
  const query = new URLSearchParams(data).toString();
  const url = `/api/chatbot/intent?${query}`;
  return new EventSource(url);
};

const chatBootApi = {
  getChatbotIntentSee,
};

export default chatBootApi;
