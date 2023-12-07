import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { setMessage, setCurrChatId } from 'state';
import { useTheme } from '@mui/material/styles';
import ChatListWidget from 'scenes/widget/ChatListWidget';
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateMessage } from 'state';
import { socket } from 'socket';
import { Box, Typography, Avatar, IconButton, InputBase, TextField } from '@mui/material';
import FlexBetween from 'components/Flexbetween';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import SendIcon from '@mui/icons-material/Send';

function ChatPage() {
    const { chatId } = useParams();
    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    let currChat, otherPicture, name;

    const token = useSelector((state) => state.authReducer.token);
    const chatList = useSelector((state) => state.chatReducer.chats)
    const chatIdList = chatList.map((chat) => chat.chatId);
    const currChatId = useSelector((state) => state.chatReducer.currChatId);
    const messages = useSelector((state) => state.chatReducer.currMessage)
    const loginUserId = useSelector((state) => state.authReducer.user._id)
    const dispatch = useDispatch();
    const [messageText, setMessageText] = useState('');
    const messageBoxRef = useRef(null);
    
    if (chatId != 'null') {
        currChat = chatList.find(chat => chat.chatId==chatId);
        otherPicture = currChat.other.picturePath;
        name = currChat.other.firstName + ' ' + currChat.other.lastName;
    }
    
    // THEME SETTINGS
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const alt = theme.palette.background.alt;
    
    // fetch Message of the ChatId
    useEffect(() => {
        if (chatId != 'null') {
            dispatch(setCurrChatId(chatId));

            fetch(`${backendUrl}/chat/message/${chatId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })
            .then(response => response.json())
            .then((data) => {
                if (data.messages) {
                    dispatch(setMessage(data.messages));
                }
            })
            .catch((err) => console.log(err));
        }
    },[chatId])

    // SCROLL SETTINGS
    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTo({
                top: messageBoxRef.current.scrollHeight,
                //behavior: 'smooth'
            })
        }
    }, [messages])

    // SOCKET SETTINGS
    useEffect(() => {
        // set up socket connection to rooms (chatId)
        socket.emit('chatSetup', chatIdList);
        socket.on('chatSetup', (message) => {
            console.log(message);
        })

        return () => {
            socket.off('chatSetup');
        }
    },[])
    useEffect(() => {
        socket.on('newMessage', (messageObject) => {
            const chatId = messageObject.chatId;
            const message = messageObject.message;
            console.log(messageObject)
            dispatch(updateChat({
                chatId,
                lastMessage: {
                    ...message,
                    sender: message.sender._id,
                }
            }))

            if (chatId == currChatId) {
                dispatch(updateMessage(message))
            }
        
        return () => {
            socket.off('newMessage');
        }
        })
    },[])

    // CONTROLLERS
    const sendMessage = (e) => {
        if (e) {
            e.preventDefault();
        }

        fetch(`${backendUrl}/chat/${loginUserId}/${chatId}`, {
            method: 'POST',
            body: JSON.stringify({ message: messageText }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                setMessageText('');
                const newMessage = data.newMessage;

                socket.emit('newMessage', {
                    chatId: data.newMessage.chatId,
                    message: {
                        _id: newMessage._id,
                        createdAt: newMessage.createdAt,
                        message: newMessage.message,
                        sender: newMessage.sender
                    }
                });
                
                // const newChat = {
                //     ...currChat,
                //     lastMessage: data.updatedChat.lastMessage,
                // }
                
                // // update new lastMessage in Chat
                // dispatch(updateChat({ 
                //     chatId: newChat.chatId,
                //     newChat: newChat
                // }))

                // dispatch(updateMessage({
                //     ...newChat.lastMessage,
                //     sender: data.newMessage.sender
                // }))
                
            })
            .catch(err => console.log(err));

    }

    const handleKeyDown = (e) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.length > 0) {
                sendMessage();
            }
        }
    }

    // In case there is no particular current chat box, show empty chatbox
    if (chatId == 'null') {
        return (
            <FlexBetween className='page' sx={{ alignItems: 'flex-start' }}>
                <Box width='350px'>
                    <ChatListWidget />
                </Box>
            </FlexBetween>

        )
    }

    return (
        <FlexBetween className='page' sx={{ alignItems: 'flex-start' }}>

            {/* Search bar and Chat List */}
            <Box width='350px'>
                <ChatListWidget />
            </Box>

            {/* Message box */}
            <Box flexGrow='1' height='100%'>

                <Box height='100%' display='flex' sx={{flexDirection: 'column'}}>
                
                    {/* Name bar */}    
                    <FlexBetween padding='15px 5px'>

                        <FlexBetween gap='10px'>
                            <Avatar 
                                    alt={name}
                                    src={`${assetUrl}/${otherPicture}`}
                                    sx={{ width: 50, height: 50 }}
                            />

                            <Box flexGrow='1'>
                                <Typography variant='h4'>
                                    {name}
                                </Typography>
                            </Box>
                        </FlexBetween>

                        <FlexBetween padding='0px 20px' gap='20px'>

                            <IconButton>
                                <VideocamIcon color='primary' fontSize='large'/>
                            </IconButton>

                            <IconButton>
                                <CallIcon color='primary' fontSize='large'/>
                            </IconButton>

                        </FlexBetween>

                    </FlexBetween>

                    {/* Message Box */}
                    
                    {/* Message Frame */}
                    <Box 
                        ref={messageBoxRef}
                        display = 'flex' 
                        gap = '10px'
                        flexGrow='1'
                        sx={{
                            flexDirection: 'column',
                            overflow: 'auto'
                        }}>
                        {
                            messages.map(message => (
                                <Box 
                                    key={message._id}
                                    display='flex' 
                                    justifyContent={(message.sender._id == loginUserId) ?  'flex-end' : 'flex-start' }
                                    sx={{
                                        mx: '10px'
                                    }}
                                >
                                    <Box 
                                        backgroundColor = {alt}
                                        sx={{
                                            maxWidth: '500px', 
                                            padding: '8px 13px',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <Typography sx={{ wordBreak: "break-word" }}>
                                            {message.message}
                                        </Typography>
                                    </Box>
                                </Box>

                            ))
                        }
                    </Box>
                    
                    {/* Message input */}
                    <FlexBetween
                        component='form' 
                        gap='10px' 
                        padding='2% 5%'
                        onSubmit={sendMessage}
                    >
                        <Box 
                            padding='5px'
                            backgroundColor={neutralLight} 
                            borderRadius="10px"
                            maxHeight='150px'
                            flexGrow='1'
                            sx={{
                                pl: '10px',
                                pr: '3px',
                                overflow: 'auto'
                            }}>
                            <InputBase 
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                multiline 
                                placeholder="Text here..." 
                                fullWidth={true} 

                            />
                        </Box>

                        <IconButton 
                            type='submit'
                            disabled={!(Boolean(messageText))}
                        >
                            <SendIcon color='primary'/>
                        </IconButton>
                    </FlexBetween>

                </Box>
                    


            </Box>

        </FlexBetween>
    )
}

export default ChatPage;