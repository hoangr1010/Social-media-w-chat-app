import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from 'scenes/widget/UserWidget.js';
import FriendListWidget from 'scenes/widget/FriendListWidget';
import PostsWidget from 'scenes/widget/PostsWidget';

function ProfilePage() {

  const { userId } = useParams();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');

  return (
    <Box 
      display='flex' 
      justifyContent={isNonMobileScreen && 'space-between'} 
      alignItems={isNonMobileScreen ? 'start' : 'stretch'} 
      gap='10px' 
      padding='10px 20%'
      sx={{
        flexDirection: isNonMobileScreen ? 'row' : 'column'
      }}
    >

      <Box display='flex' gap='10px' sx={{ flexBasis: '35%', flexDirection: (!isNonMobileScreen ? 'row' : 'column') }}>
        <UserWidget userId={userId} avatarSize={60} />

        {isNonMobileScreen && (
          <FriendListWidget userId={userId} isProfile={true} />
        )}
      </Box>

      <Box sx={{ flexBasis: '40%', flexGrow: 1 }}>
        <PostsWidget userId={userId} isProfile={true}/>
      </Box>

    </Box>
  );
}

export default ProfilePage;