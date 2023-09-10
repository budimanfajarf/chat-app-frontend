const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050',
  SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5051',
};

export default env;
