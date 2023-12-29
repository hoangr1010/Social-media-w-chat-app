import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setMessage, setCurrChatId } from 'state';
import { useTheme } from '@mui/material/styles';
import ChatListWidget from 'scenes/widget/ChatListWidget';
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateMessage } from 'state';
import { socket } from 'socket';
import { Box, Typography, IconButton, InputBase, useMediaQuery } from '@mui/material';
import FlexBetween from 'components/Flexbetween';
import Typing from 'components/Typing';
import AvatarStatus from 'components/AvatarStatus';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';

function ChatPage({ setIsChat }) {

    const { chatId } = useParams();
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    let currChat, otherPicture, name, status;
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDrawer, setIsDrawer] = useState(true);
    const messageBoxRef = useRef(null);
    const currChatIdRef = useRef();
    const messageInputRef = useRef(null);
    
    const token = useSelector((state) => state.authReducer.token);
    const chatList = useSelector((state) => state.chatReducer.chats)
    const messages = useSelector((state) => state.chatReducer.currMessage)
    const loginUserId = useSelector((state) => state.authReducer.user._id);
    const dispatch = useDispatch();

    
    if (chatId != 'null') {
        currChat = chatList.find(chat => chat.chatId==chatId);
        otherPicture = currChat.other.picturePath;
        name = currChat.other.firstName + ' ' + currChat.other.lastName;
        status = currChat.status;
    }
    
    // THEME SETTINGS
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const alt = theme.palette.background.alt;
    
    // fetch Message of the ChatId    
    useEffect(() => {

        currChatIdRef.current = chatId;

        if (messageInputRef.current) {
            messageInputRef.current.focus();
        }

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

    useEffect(() => {
        setIsChat(true);

        return () => {
            setIsChat(false);
        }
    })

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

    // Handle new mewssage received
    useEffect(() => {
        socket.on('newMessage', ({ chatId, message, other }) => {
            console.log(other);
            // Update the lastest message
            dispatch(updateChat({
                chatId,
                lastMessage: {
                    ...message,
                    sender: message.sender._id,
                },
                newMessage: (loginUserId == message.sender._id) ? null : 'increase',
            }))

            // Update once in sender side
            if (loginUserId == message.sender._id) {
                updateNewMessage(chatId, other, 'increase')
            }
            
            // Update the list of message
            if (chatId == currChatIdRef.current) {
                dispatch(updateMessage(message));
            }
        
        })

        return () => {
            socket.off('newMessage');
        }
    },[])

    // Handle tying 
    useEffect(() => {
        let typingTimeout;

        const handleTyping = (chatId) => {
            if (currChatIdRef.current == chatId) {
                setIsTyping(true);

                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    setIsTyping(false);
                }, 1000);
            }
        }

        socket.on('typing', handleTyping);

        return () => {
            socket.off('typing');
            clearTimeout(typingTimeout);
        }
    }, [])

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
                setMessageText('');
                const newMessage = data.newMessage;

                socket.emit('newMessage', {
                    chatId: data.newMessage.chatId,
                    other: currChat.other._id,
                    message: {
                        _id: newMessage._id,
                        createdAt: newMessage.createdAt,
                        message: newMessage.message,
                        sender: newMessage.sender
                    }
                });
                
            })
            .catch(err => console.log(err));
    }

    const updateNewMessage = (chatId, userId, action) => {
        fetch(`${backendUrl}/chat/newMessage/${chatId}/${userId}/${action}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.log(err))
    }

    const handleKeyDown = (e) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.length > 0) {
                sendMessage();
            }
        }

        socket.emit('typing', currChatIdRef.current);
    }

    const handleFocus = () => {

        if (currChat.newMessage != 0) {
            updateNewMessage(chatId, loginUserId, 'reset');

            dispatch(updateChat({
                chatId,
                newMessage: 'reset'
            }))
        }


    }

    // In case there is no particular current chat box, show empty chatbox
    if (chatId == 'null') {
        return (
            <FlexBetween className='page' sx={{ alignItems: 'flex-start' }}>
                <Box 
                    height='100%'
                    sx={{ 
                        position: isSmallScreen ? (isDrawer ? 'absolute' : null) : null,
                        zIndex: 50,
                        width: isSmallScreen ? (isDrawer ? '100%' : 'auto') : 'auto',
                    }}
                >
                    <ChatListWidget isSmallScreen={isSmallScreen} isDrawer={isDrawer} setIsDrawer={setIsDrawer} />
                </Box>

                
                <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/6/67/Google_Messages_icon_%282022%29.svg'/>
                </Box>
            </FlexBetween>

        )
    }

    return (
        <FlexBetween className='page' sx={{ alignItems: 'flex-start' }}>

            {/* Search bar and Chat List */}
            <Box 
                height='100%'
                sx={{ 
                    position: isSmallScreen ? (isDrawer ? 'absolute' : null) : null,
                    zIndex: 50,
                    width: isSmallScreen ? (isDrawer ? '100%' : 'auto') : 'auto',
                }}
            >
                <ChatListWidget isSmallScreen={isSmallScreen} isDrawer={isDrawer} setIsDrawer={setIsDrawer} />
            </Box>

            {/* Message box */}
            <Box flexGrow='1' height='100%'>

                <Box height='100%' display='flex' sx={{flexDirection: 'column'}}>
                
                    {/* Name bar */}    
                    <FlexBetween padding='15px 5px'>

                        <FlexBetween gap='10px'>
                            <AvatarStatus 
                                    name={name}
                                    picturePath={otherPicture}
                                    size={50}
                                    status={status}
                            />

                            <Box flexGrow='1'>
                                <Typography variant='h4'>
                                    {name}
                                </Typography>
                            </Box>
                        </FlexBetween>

                        <FlexBetween padding='0px 20px' gap='20px'>

                            <IconButton onClick={() => {navigate(`/chat/video/${chatId}`); navigate(0)}}>
                                <VideocamIcon color='primary' fontSize='large'/>
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
                    
                    {/* Typing Indicator */}
                    {
                        isTyping && (
                            <Typing name={name}/>
                        )
                    }
                    
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
                                autoFocus
                                onFocus={handleFocus}
                                inputRef={messageInputRef}
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