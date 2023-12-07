import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { updatePost } from 'state';
import { Box, Typography, InputBase, IconButton } from '@mui/material';
import FlexBetween from 'components/Flexbetween';
import WidgetWrapper from 'components/WidgetWrapper';
import FriendWidget from 'scenes/widget/FriendWidget.js';
import CommentWidget from 'scenes/widget/CommentWidget.js';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';

function PostWidget({ postId, userId, description, picturePath, likes, comments  }) {

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
  const token = useSelector((state) => state.authReducer.token);
  const loginUser = useSelector((state) => state.authReducer.user._id);
  const dispatch = useDispatch();
  const isLiked = likes.hasOwnProperty(loginUser);
  const likeAmt = Object.keys(likes).length;
  const commentAmt = comments.length;
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState('');

  // THEME SETTINGS
  const theme = useTheme();
  const neutralMediumMain = theme.palette.neutral.mediumMain;
  const neutralLight = theme.palette.neutral.light;

  // CONTROLLERS
  const toggleLike = async() => {
    const response = await fetch(`${backendUrl}/post/${postId}/like`, {
      method: 'PATCH',
      body:  JSON.stringify({
        userId: loginUser,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    })
    const data = await response.json();
    const newPost = data['newPost'];

    dispatch(updatePost(newPost));
  };

  const handleComment = async(event) => {
    event.preventDefault();

    await fetch(`${backendUrl}/post/${postId}/comment`, {
      method: 'PATCH',
      body: JSON.stringify({ comment }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        const newPost = data.newPost;

        dispatch(updatePost(newPost));
        setComment('');

      })
      .catch(err => console.error(err)); 
  }

  return (
    <WidgetWrapper>
      <FriendWidget userId={userId} />

      {description && (
        <Typography paddingBottom='15px' color={neutralMediumMain}>
          {description}
        </Typography>
      )}

      {picturePath && (
        <Box
          component='img'
          src={`${assetUrl}/${picturePath}`}
          sx={{
            maxHeight: 'auto',
            width: '100%',
            pb: '10px',
            borderRadius: '2%'
          }}
        />
      )}

      <FlexBetween sx={{
        px: '10px',
      }}>

        <FlexBetween gap='2rem'> 

          <FlexBetween gap='7px'>
            {
              isLiked ? (
                <ThumbUpIcon color='primary' onClick={toggleLike} sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}/>
              ) : (
                <ThumbUpOutlinedIcon onClick={toggleLike} sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}/>
              )
            }

            <Typography>{likeAmt}</Typography>
          </FlexBetween>
          
          <FlexBetween gap='7px'> 
            {isComment ? (
              <QuestionAnswerIcon 
                color='primary' 
                onClick={() => setIsComment(!isComment)}
                sx={{'&:hover': {cursor: 'pointer'}}}
              />
            ) : (
              <ForumOutlinedIcon 
                onClick={() => setIsComment(!isComment)}
                sx={{'&:hover': {cursor: 'pointer'}}}
              />
            )}          

            <Typography>{commentAmt}</Typography>
          </FlexBetween>


        </FlexBetween>

        <ShareOutlinedIcon/>
      </FlexBetween>

      {isComment && (<CommentWidget comments={comments} />)}

      <Box
        component='form'
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '0px 10px',
          marginTop: '10px',
          bgcolor: neutralLight,
          borderRadius: '10px'
        }}
        onSubmit={handleComment}
      >
        <InputBase
          fullWidth
          placeholder="Add a comment..."
          value={comment}
          sx={{bgcolor: neutralLight}}
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton
          type='submit'
          color='primary'
          disabled={!Boolean(comment)}
          sx={{ padding: '10px' }}
        >
          <SendIcon />
        </IconButton>
      </Box>

    </WidgetWrapper>
  );
}

export default PostWidget;