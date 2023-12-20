import { useState } from "react";
import FlexBetween from "components/Flexbetween.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { setMode, setLogoutAuth, setLogoutProfile, setLogoutChat } from 'state';
import { Box, Typography, IconButton, InputBase, Menu, MenuItem, Avatar, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MessageIcon from '@mui/icons-material/Message';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

function Navbar() {
    const state = useSelector((state) => state.authReducer);
    const mode = state.mode;
    const user = state.user;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const firstName = state.user.firstName;
    const lastName = state.user.lastName;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = useTheme();
    // const neutralDark = theme.palette.neutral.dark;
    // const background = theme.palette.background.default;
    const neutralLight = theme.palette.neutral.light;
    const primaryLight = theme.palette.primary.light;
    const textColor = theme.palette.text.primary;
    const textContrastColor= theme.palette.text.contrast;
    const alt = theme.palette.background.alt;

    // screen size adaptivity settings
    const isNonMobileScreen = useMediaQuery('(min-width:960px)');
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    const [isMobileToggle,setIsMobileToggle] = useState(false);

    // Profile dropdown settings
    const [anchorEl,setAnchorEl] = useState(null);

    function handleClick(e) {
      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(e.currentTarget);
      }
    }

    function handleClose() {
      setAnchorEl(null);
    }

    // CONTROLLERS
    const logout = () => {
      dispatch(setLogoutAuth());
      dispatch(setLogoutProfile());
      dispatch(setLogoutChat());
      navigate('/');
      handleClose();
    }

    return (
      <FlexBetween height='10%' padding="10px 6%" backgroundColor={alt}>

        {/* logo and search bar */}
        <FlexBetween sx={{ gap: "20px" }}>
          
          {/* Logo */}
          <Typography 
            fontSize='clamp(1rem,2rem,2.25rem)' 
            fontWeight='bold'
            color= "primary"
            onClick={() => navigate("/home")}
            sx={{
              '&:hover': {
                color: primaryLight,
                cursor: "pointer"
              },
            }}
          >Hey!</Typography>

          {/* Search bar */}
          {
            !isSmallScreen && (
              <FlexBetween 
                  width='300px' 
                  color="primary" 
                  backgroundColor={neutralLight} 
                  borderRadius="10px" 
                  sx={{
                        pl: '10px',
                        pr: '3px',
                        my: '15px'
                  }}
                  >
                <InputBase size="medium" placeholder="Search..." fullWidth={true} />
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </FlexBetween>
            )
          }
          
        </FlexBetween>
        
        {/* Nav */}
        {
          isNonMobileScreen ? (
            <FlexBetween gap='40px' padding="0 20px">
              <IconButton onClick={() => dispatch(setMode())}>
                {
                mode === 'light' ? (
                  <LightModeIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
                ) : (
                  <DarkModeIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
                )
                }
              </IconButton>
              <IconButton onClick={() => {navigate('/chat/null');navigate(0)}}>
                <MessageIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
              </IconButton>
              
              <IconButton>
                <Avatar src={`${assetUrl}/${user.picturePath}`} sx={{ color: textColor, backgroundColor: neutralLight }} onClick={handleClick}/>
              </IconButton>
              <Menu
                open={anchorEl ? true : false}
                anchorEl={anchorEl}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Typography onClick={() => navigate('/profile/'+user._id)} color={mode==='dark' ? textContrastColor : textColor}>{firstName} {lastName}</Typography>
                </MenuItem>
                <MenuItem onClick={logout}>
                  <Typography color={mode==='dark' ? textContrastColor : textColor}>Logout</Typography>
                </MenuItem>
              </Menu>
            </FlexBetween>
          ) : (
            <IconButton onClick={() => setIsMobileToggle(!isMobileToggle)}>
              <MenuIcon sx={{ color: textColor, fontSize: "1.4rem" }}/>
            </IconButton>
          )
        }

        {
          (!isNonMobileScreen && isMobileToggle) && (
            <Box 
                position='fixed' 
                zIndex="10"
                backgroundColor={neutralLight}
                sx={{ top:0, right:0}}
                width='6rem'
              >
              <FlexBetween gap='10px' padding="20px 10px" flexDirection='column'>
                <IconButton onClick={() => setIsMobileToggle(!isMobileToggle)}>
                  <ClearIcon color='secondary'/>
                </IconButton>
                <IconButton onClick={() => dispatch(setMode())}>
                  {
                  mode === 'light' ? (
                    <LightModeIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
                  ) : (
                    <DarkModeIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
                  )
                  }
                </IconButton>
                <IconButton onClick={() => {navigate('/chat/null');navigate(0)}}>
                  <MessageIcon sx={{ color: textColor, fontSize: "1.4rem" }} />
                </IconButton>
                
                <IconButton>
                  <Avatar src={`${assetUrl}/${user.picturePath}`} sx={{ color: textColor, backgroundColor: neutralLight }} onClick={handleClick}/>
                </IconButton>
                <Menu
                  open={anchorEl ? true : false}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Typography onClick={() => navigate('/profile/'+user._id)} color={mode==='dark' ? textContrastColor : textColor}>{firstName} {lastName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <Typography color={mode==='dark' ? textContrastColor : textColor}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </FlexBetween>
            </Box>
          )
        }
        
      </FlexBetween>
    );
  }
  
  export default Navbar;