import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from 'state';
import { Box, CircularProgress } from '@mui/material';
import PostWidget from "scenes/widget/PostWidget.js"
import { Token } from '@mui/icons-material';

function PostsWidget({ userId, isProfile }) {
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const posts = useSelector((state) => state.authReducer.posts);
  const token = useSelector((state) => state.authReducer.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isProfile) {
      getPosts();
    } else {
      getUserPosts();
    }
  }, [])
  
  if (!posts) {
    return <CircularProgress/>
  }
  
  // CONTROLLERS
  
  const getPosts = () => {
    fetch(`${backendUrl}/post`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(setPosts(data.posts));
      })
      .catch(error => console.error(error));
  }

  const getUserPosts = () => {
    fetch(`${backendUrl}/post/${userId}/posts`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(setPosts(data.posts));
      })
      .catch(err => console.error(err))
  }

  return (
    <Box display='flex' gap='10px' sx={{ flexDirection: 'column' }}>
      {
          posts.map(({ _id, userId, description, picturePath, likes, comments }) => {
              return <PostWidget 
                          key={_id}
                          postId={_id}
                          userId={userId}
                          description={description}
                          picturePath={picturePath}
                          likes={likes}
                          comments={comments}    
                      />;
          })
      }
    </Box>
  );
}

export default PostsWidget;