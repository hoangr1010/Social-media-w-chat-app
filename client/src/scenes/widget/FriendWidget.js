import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { setFriends, setChat } from 'state';
import FlexBetween from 'components/Flexbetween.js';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import AddCommentIcon from '@mui/icons-material/AddComment';

function FriendWidget({ userId }) {
    
    const [user,setUser] = useState(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.authReducer.token);
    const friends = useSelector((state) => state.authReducer.user.friends);
    const loginUserId = useSelector((state) => state.authReducer.user._id);
    const isFriend = user && friends.includes(user._id);
    const chatList = useSelector((state) => state.chatReducer.chats)
    const otherIdChatlist = chatList.map(chat => chat.other._id);

    useEffect(() => {
        fetch(`${backendUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
            .then(response => response.json())
            .then((data) => setUser(data.user))
            .catch((err) => console.log(err));

    }, [])

    // THEME SETTINGS
    const theme = useTheme();
    const primaryLight = theme.palette.primary.light;
    const primaryDark = theme.palette.primary.dark;
    const neutralMedium = theme.palette.neutral.medium;
    
    // CONTROLLERS
    const toggleFriend = async () => {
        const response = await fetch(`${backendUrl}/user/${loginUserId}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }})
        const data = await response.json();
        const newFriendArray = data.friends;

        dispatch(setFriends(newFriendArray));
        
    }

    const handleNavigateChat = async () => {
        let chatId;

        // Check userId in ChatList
        if (!otherIdChatlist.includes(userId)) {
            chatId = await createChat();
            await updateChatList();
            console.log(chatId);
        } else {
            const chat = chatList.find(chat => chat.other._id == userId);
            chatId = chat.chatId;
        }
        console.log(chatId);
        //Navigate to the Chat
        console.log('navigate here')
        navigate(`/chat/${chatId}`);
        // navigate(0);
    }

    const createChat = async () => {
        const participants = [userId, loginUserId]

        const res = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            body: JSON.stringify({participants: participants}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        
        const data = await res.json();
        console.log(data);
        return data.newChat._id;
    }

    const updateChatList = async () => {
        await fetch(`${backendUrl}/chat/${loginUserId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }})
            .then(response => response.json())
            .then((data) => {
              dispatch(setChat(data.chats))
            })
            .catch((err) => console.log(err))
      
    }

    if (!user) {
        return <CircularProgress />
    }

    return (
    <FlexBetween paddingBottom='10px'>

        <FlexBetween gap='10px'>
            <Avatar src={`${assetUrl}/${user.picturePath}`} />

            <Box>
                <Typography 
                    variant='h5' 
                    fontWeight='bold'
                    sx={{
                        '&:hover': {
                            cursor: 'pointer',
                            color: primaryDark
                        }
                    }}
                    onClick={() => {navigate(`/profile/${userId}`); navigate(0)}}
                >
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography variant='subtitle2' fontWeight='light' color={neutralMedium}>
                    {user.location}
                </Typography>
            </Box>
        </FlexBetween>

        <FlexBetween gap='10px'>
            <IconButton onClick={handleNavigateChat}>
                <AddCommentIcon sx={{color: primaryDark}}/>
            </IconButton>

            {(loginUserId != userId) && isFriend && (
                <IconButton onClick={toggleFriend}>
                    <PersonRemoveOutlinedIcon sx={{color: primaryLight}}/>
                </IconButton>
            )}

            {(loginUserId != userId) && !isFriend && (
                <IconButton onClick={toggleFriend}>
                    <PersonAddOutlinedIcon sx={{color: primaryDark}}/>
                </IconButton>
            )}
            
        </FlexBetween>

    </FlexBetween>
    );
  }
  
  export default FriendWidget;