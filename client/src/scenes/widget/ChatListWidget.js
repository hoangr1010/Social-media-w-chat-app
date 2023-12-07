import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import FlexBetween from 'components/Flexbetween';
import { Box, Typography, IconButton, InputBase, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

function ChatList() {

    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const chatList = useSelector((state) => state.chatReducer.chats);
    const loginUserId = useSelector((state) => state.authReducer.user._id)
    const navigate = useNavigate();

    // THEME SETTINGS
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const alt = theme.palette.background.alt;

    return (
        <Box>
            
            {/* Chat title with search bar */}
            <Box padding='10px 20px'>
                <Typography variant='h3' fontWeight='bold'>
                    Chat
                </Typography>

                <FlexBetween 
                    color="primary" 
                    backgroundColor={neutralLight} 
                    borderRadius="10px" 
                    sx={{
                        pl: '10px',
                        pr: '3px',
                        my: '15px'
                    }}>
                    <InputBase size="medium" placeholder="Create New Chat" fullWidth={true} />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </FlexBetween>

                {chatList.map(chat => (
                    <FlexBetween
                        key={chat.chatId}
                        onClick={() => navigate(`/chat/${chat.chatId}`)}
                        padding='10px 10px'
                        gap='15px'
                        sx={{
                            "&:hover": {
                                backgroundColor: alt,
                                cursor: "pointer",
                            },
                            borderRadius: '10px',
                            my: '5px'
                        }}
                    >
                        <Avatar 
                            alt={chat.other.firstName + chat.other.lastName}
                            src={`${assetUrl}/${chat.other.picturePath}`}
                            sx={{ width: 50, height: 50 }}
                        />

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


                    </FlexBetween>
                ))}
                
            </Box>

        </Box>
    )
}

export default ChatList;