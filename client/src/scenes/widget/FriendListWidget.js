import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setFriends, setProfileFriends } from 'state';
import { Box, Typography, CircularProgress } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import FriendWidget from 'scenes/widget/FriendWidget';

function FriendListWidget({ userId, isProfile }) {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const dispatch = useDispatch();
    const token = useSelector((state) => state.authReducer.token);

    const friendIdList = useSelector(state => {
        if (isProfile) {
            return state.profileReducer.friends
        } else {
            return state.authReducer.user.friends
        }
    });

    useEffect(() => {
        fetch(`${backendUrl}/user/${userId}/friends`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (isProfile) {
                    dispatch(setProfileFriends(data.friends));
                } else {
                    dispatch(setFriends(data.friends));
                }
            })
            .catch((err) => {console.error(err)})
    }, [])

    if (!friendIdList) {
        return <CircularProgress/>
    }

    return (
      <WidgetWrapper display='flex' gap='10px' sx={{ flexDirection: 'column' }}>
        <Typography variant='h4' fontWeight='bold' paddingBottom='10px'>
            Friend List
        </Typography>
        {
            friendIdList.map(friendId => (
                <FriendWidget key={friendId} userId={friendId}/>
            ))
        }
      </WidgetWrapper>
    );
  }
  
  export default FriendListWidget;