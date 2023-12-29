import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import FlexBetween from 'components/Flexbetween';
import { Box, Typography, Badge, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AvatarStatus from 'components/AvatarStatus';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function ChatList({ isSmallScreen, isDrawer, setIsDrawer }) {

    const chatList = useSelector((state) => state.chatReducer.chats);
    const loginUserId = useSelector((state) => state.authReducer.user._id)
    const navigate = useNavigate();

    // THEME SETTINGS
    const theme = useTheme();
    const lightPrimary = theme.palette.primary.light;
    const background = theme.palette.background.default;
    const alt = theme.palette.background.alt;

    return (
        <Box 
            height='100%' 
            width={isDrawer ? (isSmallScreen ? '100%' : '350px') : 'auto'} 
            backgroundColor={background} 
            sx={{boxShadow: 10}}
        >
            
            {/* Chat title with search bar */}
            <Box padding='10px 20px'>

                <FlexBetween>
                    
                    <Typography variant='h3' fontWeight='bold'>
                        {isDrawer ? 'Chat' : null}
                    </Typography>

                    <Button onClick={() => {setIsDrawer(prev => !prev)}}>
                        {isDrawer ? <KeyboardDoubleArrowLeftIcon/> : <KeyboardDoubleArrowRightIcon/>}
                    </Button>

                </FlexBetween>

                {chatList.map(chat => (
                    <FlexBetween
                        key={chat.chatId}
                        onClick={() => {navigate(`/chat/${chat.chatId}`); setIsDrawer(prev => isSmallScreen ? false : prev);}}
                        padding='10px 10px'
                        gap='15px'
                        backgroundColor={chat.newMessage ? lightPrimary : null}
                        sx={{
                            "&:hover": {
                                backgroundColor: alt,
                                cursor: "pointer",
                            },
                            borderRadius: '10px',
                            my: '5px'
                        }}
                    >

                        <Badge 
                            badgeContent={isDrawer ? null : chat.newMessage} 
                            color="secondary" 
                            max={9}
                            overlap="circular"
                            
                        >
                            <AvatarStatus 
                                        name={chat.other.firstName + chat.other.lastName}
                                        picturePath={chat.other.picturePath}
                                        size={50}
                                        status={chat.status}
                            />
                        </Badge>

                        {isDrawer && (
                                <Box flexGrow='1'>
                                    <Typography variant='h5' fontWeight='bold'>
                                        {chat.other.firstName + ' ' + chat.other.lastName}
                                    </Typography>
                                    <Typography>
                                        {
                                            chat.lastMessage ? (
                                                (chat.lastMessage.sender==loginUserId ? 'You' : chat.other.firstName) + `: ${chat.lastMessage.message.slice(0,Math.min(25,chat.lastMessage.message.length))}` + (chat.lastMessage.message.length>25 ? '...' : '')
                                            ) : null
                                        }
                                    </Typography>
                                </Box>
                        )}

                        {isDrawer && (
                            <Badge 
                                badgeContent={chat.newMessage} 
                                color="secondary" 
                                max={9} 
                                sx={{
                                    margin: '10px',
                                }}
                            />                            
                        )}
                    </FlexBetween>
                ))}

            </Box>

        </Box>
    )
}

export default ChatList;