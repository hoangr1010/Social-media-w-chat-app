import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { Typography, Badge } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import AvatarStatus from 'components/AvatarStatus'
import FlexBetween from 'components/Flexbetween';


function HomeChatListWidget() {

    const chatList = useSelector((state) => state.chatReducer.chats);
    const navigate = useNavigate();

    // THEME SETTINGS
    const theme = useTheme();
    const lightPrimary = theme.palette.primary.light;
    const neutralLight = theme.palette.neutral.light;
    

    return (
        <WidgetWrapper sx={{ mt: '10px'}}>
            <Typography variant='h5' fontWeight='bold'>
                Chat 
            </Typography>

            {
                chatList.map((chat) => (
                    <FlexBetween 
                        key={chat.chatId}
                        backgroundColor={chat.newMessage ? lightPrimary : null}
                        onClick={() => navigate(`/chat/${chat.chatId}`)}
                        sx={{ 
                            borderRadius: '10px',
                            p: '10px',
                            '&: hover': {
                                backgroundColor: neutralLight,
                                cursor: 'pointer'
                            }
                        }}>
                        
                        <FlexBetween gap='10px'>

                            <AvatarStatus 
                                    name={chat.other.firstName + chat.other.lastName}
                                    picturePath={chat.other.picturePath}
                                    size={35}
                                    status={chat.status}
                            />

                            <Typography variant='h6'>
                                {chat.other.firstName + ' ' + chat.other.lastName}
                            </Typography>


                        </FlexBetween>

                        <Badge 
                            badgeContent={chat.newMessage} 
                            color="secondary" 
                            max={9} 
                            sx={{
                                margin: '10px',
                            }}
                        ></Badge>

                    </FlexBetween>
                ))
            }
            
        </WidgetWrapper>
    );
}

export default HomeChatListWidget;