import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { socket } from './socket'
import { updateChat } from 'state';
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ChatPage from "scenes/chatPage";
import Navbar from "scenes/navbar";
import LoginNavBar from "scenes/navbar/LoginNavBar.js";
import ProfilePage from "scenes/profilePage";
import themeSettings from "theme.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  const mode = useSelector((state) => state.authReducer.mode);
  const isUser = useSelector((state) => state.authReducer.user);
  const isUserRef = useRef(isUser);
  const chatList = useSelector((state) => state.chatReducer.chats);
  const chatIdList = chatList.map((chat) => chat.chatId);
  const dispatch = useDispatch();
  const theme = useMemo(() => createTheme(themeSettings(mode)),[mode]);

  useEffect(() => {
    isUserRef.current = isUser;
  }, [isUser])

  // Handle connection and sending heartBeat
  useEffect(() => {

    // Connect socket and send heart beat
    let heartBeatInterval;
    
    if (isUserRef.current) {
      socket.on('connect', () => {
        console.log('socket connected');

        heartBeatInterval = setInterval(() => {
          if (isUserRef.current) {
            socket.emit('heartBeat', chatIdList);
          }
        }, 5000);
      })
    } else {      
      clearInterval(heartBeatInterval);
      socket.off('connect');
    }

    // set up socket connection to rooms (chatId)
    socket.emit('chatSetup', chatIdList);
    socket.on('chatSetup', (message) => {
        console.log(message);
    })

    return () => {
      socket.off('connect');
      socket.off('chatSetup');
      clearInterval(heartBeatInterval);
    }
  },[isUser])

  // Handle receiving heartbeat
  useEffect(() => {
    let statusTimeout;

    const handleStatus = (chatId) => {
      console.log(chatId);

      dispatch(updateChat({chatId: chatId, status: 'online'}));

      clearTimeout(statusTimeout);
      statusTimeout = setTimeout(() => {
        dispatch(updateChat({chatId: chatId, status: 'offline'}));
      }, 6000);
    }

    if (isUserRef.current) {
      socket.on('heartBeat', handleStatus);
    } else {
      socket.off('heartBeat');
      clearTimeout(statusTimeout);
    }

    return () => {
      socket.off('heartBeat', handleStatus);
      clearTimeout(statusTimeout);
    }
  },[isUser])

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isUser ? <Navbar /> : <LoginNavBar/>}
        <Routes >
          <Route path='/' element={ isUser ? <HomePage /> : <LoginPage /> }/>
          <Route path='/home' element={ isUser ? <HomePage /> : <LoginPage /> }/>
          <Route path='/chat/:chatId' element = { isUser ? <ChatPage /> : <ChatPage />} />
          <Route path='/profile/:userId' element={ isUser ? <ProfilePage /> : <LoginPage /> }/>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
