import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ChatPage from "scenes/chatPage";
import VideoChatPage from "scenes/chatPage/VideoChatPage";
import Navbar from "scenes/navbar";
import LoginNavBar from "scenes/navbar/LoginNavBar.js";
import ProfilePage from "scenes/profilePage";
import themeSettings from "theme.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatWrapper from "wrappers/ChatWrapper"
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  const mode = useSelector((state) => state.authReducer.mode);
  const isUser = useSelector((state) => state.authReducer.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)),[mode]);
  const [isChat, setIsChat] = useState(false);

  return (
    <BrowserRouter>
      <ChatWrapper isChat={isChat}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isUser ? <Navbar /> : <LoginNavBar/>}
          <Routes >
            <Route path='/' element={ isUser ? <HomePage /> : <LoginPage /> }/>
            <Route path='/home' element={ isUser ? <HomePage /> : <LoginPage /> }/>
            <Route path='/profile/:userId' element={ isUser ? <ProfilePage /> : <LoginPage /> }/>
            <Route path='/chat/:chatId' element = { isUser ? <ChatPage setIsChat={setIsChat}/> : <LoginPage />} />
            <Route path='/chat/video/:chatId' element = { isUser ? <VideoChatPage /> : <LoginPage />} />
          </Routes>
        </ThemeProvider>
      </ChatWrapper>
    </BrowserRouter>
  );
}

export default App;
