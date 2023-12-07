import { io } from 'socket.io-client';

const backendUrl = process.env.REACT_APP_BACKEND_URL
export const socket = io(backendUrl, {
  autoConnect: true,
})
