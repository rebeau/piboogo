// 환경 상수
const API_TIMEOUT = 60000;

module.exports = {
  API_PRINT_LOG: process.env.NEXT_PUBLIC_API_PRINT_LOG === 'true',
  API_TIMEOUT,
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
};
