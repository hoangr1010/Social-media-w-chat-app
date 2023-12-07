import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { socket } from './socket'
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ChatPage from "scenes/chatPage/chatPage";
import Navbar from "scenes/navbar";
import LoginNavBar from "scenes/navbar/LoginNavBar.js";
import ProfilePage from "scenes/profilePage";
import themeSettings from "theme.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const mode = useSelector((state) => state.authReducer.mode);
  const isUser = useSelector((state) => state.authReducer.user)
  const theme = useMemo(() => createTheme(themeSettings(mode)),[mode]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected');
    })

    return () => {
      socket.off('connect')
    };
  },[])

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
