import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Box, Avatar, Typography, IconButton, Divider, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WidgetWrapper from 'components/WidgetWrapper.js';
import FlexBetween from 'components/Flexbetween.js';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

function UserWidget({ userId, avatarSize }) {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const navigate = useNavigate();
    const state = useSelector((state) => state.authReducer);
    const token = state.token;
    const [user,setUser] = useState(null);
    
    // THEME SETTINGS
    const theme = useTheme();
    const primary = theme.palette.primary
    const primaryDark = theme.palette.primary.dark;
    const neutralMedium = theme.palette.neutral.medium;
    const neutralDark = theme.palette.neutral.dark;

    // GET USER FROM SERVER CALLING    
    useEffect(function() {
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
        
    }, []);
    
    if (!user) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center'>
             <CircularProgress/>
            </Box>
        )
    }

    return (
      <WidgetWrapper width='100%'>

        {/* Line 1: Name, number of friends */}
        <FlexBetween>
            <FlexBetween gap='0.7rem'>
                <Avatar 
                    sx={{
                        width: avatarSize,
                        height: avatarSize
                    }}
                    src={`${assetUrl}/${user.picturePath}`}
                />
                <Box>
                    <Typography 
                        variant='h4' 
                        fontWeight='fontWeightMedium'
                        onClick={() => navigate('/profile/'+userId)}
                        sx={{
                            '&:hover': {
                                color: primaryDark,
                                cursor: 'pointer'
                            }
                        }}
                    >
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography color={neutralMedium}>
                        {user.friends.length} friends
                    </Typography>
                </Box>

                
            </FlexBetween>
            <IconButton>
                <ManageAccountsIcon sx={{color: neutralDark}}/>
            </IconButton>
        </FlexBetween>
        
        <Box padding='1.1rem 0px'>
            <Divider sx={{ bgcolor: 'neutral.light' }}/>
        </Box>

        {/* Line 2: location, occupation */}
        
        <Box display='flex' alignItems='center' gap='10px' pb='10px'>
            <LocationOnOutlinedIcon fontSize='large'/>
            <Typography color={neutralMedium}>
                {user.location}
            </Typography>
        </Box>

        <Box display='flex' alignItems='center' gap='10px'>
            <WorkOutlineIcon fontSize='large'/>
            <Typography color={neutralMedium}>
                {user.occupation}
            </Typography>
        </Box>

        <Box padding='1.1rem 0px'>
            <Divider sx={{ bgcolor: 'neutral.light' }}/>
        </Box>

        {/* Line 3: views, impression */}
        <FlexBetween>
            <Typography color={neutralMedium}>
                Who's viewed your profile
            </Typography>
            {user.viewedProfile}
        </FlexBetween>
        <FlexBetween>
            <Typography color={neutralMedium}>
                Impressions of your post
            </Typography>
            {user.impressions}
        </FlexBetween>
        
        <Box padding='1.1rem 0px'>
            <Divider sx={{ bgcolor: 'neutral.light' }}/>
        </Box>

        {/* line 4: social profile */}
        <Typography variant='h6' pb='10px'>
            Social Profiles
        </Typography>
        
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{pb: '0.5rem'}}>

            <FlexBetween gap='1rem'>
                <Avatar variant='square' src='/assets/linkedin.png' sx={{width: 25,height: 25}}/>
                <Box>
                    <Typography fontWeight='bold'>
                        Linkedin
                    </Typography>
                    <Typography color={neutralMedium}>
                        No information
                    </Typography>
                </Box>
            </FlexBetween>
            
            <IconButton>
                <ModeEditOutlineOutlinedIcon sx={{color: neutralDark}}/>
            </IconButton>

        </Box>

        <FlexBetween>

            <FlexBetween gap='1rem'>
                <Avatar variant='square' src='/assets/twitter.png' sx={{width: 25,height: 25}}/>
                <Box>
                    <Typography fontWeight='bold'>
                        Twitter
                    </Typography>
                    <Typography color={neutralMedium}>
                        No information
                    </Typography>
                </Box>
            </FlexBetween>
            
            <IconButton>
                <ModeEditOutlineOutlinedIcon sx={{color: neutralDark}}/>
            </IconButton>

        </FlexBetween>

      </WidgetWrapper>
    );
  }
  
export default UserWidget;