import { useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { setChat } from 'state';
import UserWidget from 'scenes/widget/UserWidget.js';
import MyPostWidget from 'scenes/widget/MyPostWidget.js';
import PostsWidget from 'scenes/widget/PostsWidget.js';
import FriendListWidget from 'scenes/widget/FriendListWidget.js';

function HomePage() {

  const avatarSize = 60;
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.authReducer.user._id);
        
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      padding='1% 10%'
      gap='10px'
      >
      {
        isNonMobileScreen && (
        <Box sx={{ flexBasis: '28%' }}>
          <UserWidget userId={userId} avatarSize={avatarSize}/>
        </Box>
        )
      }
    
      <Box display='flex' gap='10px' sx={{ flexDirection: 'column', flexBasis: '43%', flexGrow: 1 }}>          
        <MyPostWidget avatarSize={avatarSize} />
        <PostsWidget userId={userId} isProfile={false}/>
      </Box>

      {
        isNonMobileScreen && (
        <Box sx={{ flexBasis: '25%' }}>
            <FriendListWidget userId={userId} isProfile={false}/>
        </Box>
        )
      }
    </Box>
  );
}

export default HomePage;