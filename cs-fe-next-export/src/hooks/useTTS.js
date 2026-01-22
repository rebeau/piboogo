import ttsApi from 'src/services/ttsApi';

const useTTS = () => {
  const postTTS = async (
    text,
    { speed = 0.68, pitch = -3, gender, name } = {},
  ) => {
    return await ttsApi.fetchTTS(text, { speed, pitch, gender, name });
  };

  return {
    postTTS,
  };
};

export default useTTS;
