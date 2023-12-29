import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { socket } from './../socket'
import { updateChat, setChat } from 'state';

function ChatWrapper({ children, isChat }) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const token = useSelector((state) => state.authReducer.token);
    const user = useSelector((state) => state.authReducer.user);
    const userRef = useRef(user);
    const chatList = useSelector((state) => state.chatReducer.chats);
    const chatIdList = chatList.map((chat) => chat.chatId);
    const dispatch = useDispatch();

    useEffect(() => {
        userRef.current = user;

        if (!user) {
            socket.disconnect();
            console.log("User log out: Disconnected to socket")
        }
    }, [user])

    // LOAD CHAT DATA
    useEffect(() => {
        if (userRef.current) {
            fetch(`${backendUrl}/chat/${user._id}`, {
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
    }, [user])        

    // HANDLE CONNECTIONS, SEND HEARTBEAT
    useEffect(() => {

        // Connect socket and send heart beat
        let heartBeatInterval;
        
        if (userRef.current) {
        socket.on('connect', () => {
            console.log('socket connected');

            console.log(userRef.current)
            heartBeatInterval = setInterval(() => {
            if (userRef.current) {
                socket.emit('heartBeat', chatIdList);
                console.log('heartBeatStart')
            }
            }, 5000);
        })
        } else {      
            clearInterval(heartBeatInterval);
            socket.off('connect');
        }

        // set up socket connection to rooms (chatId)
        socket.emit('chatSetup', chatIdList);
        socket.on('chatSetup', (message) => {
            console.log(message);
        })

        return () => {
            socket.off('connect');
            socket.off('chatSetup');
            clearInterval(heartBeatInterval);
        }
    },[userRef.current])

    // HANDLE INCOMING HEARTBEAT
    useEffect(() => {
        let statusTimeout;

        const handleStatus = (chatId) => {

        dispatch(updateChat({chatId: chatId, status: 'online'}));

        clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => {
            dispatch(updateChat({chatId: chatId, status: 'offline'}));
        }, 6000);
        }

        if (userRef.current) {
            socket.on('heartBeat', handleStatus);
        } else {
            socket.off('heartBeat', handleStatus);
            clearTimeout(statusTimeout);
        }

        return () => {
            socket.off('heartBeat', handleStatus);
            clearTimeout(statusTimeout);
        }
    },[user])

    // HANDLE INCOMING NEW MESSAGE (if Chat component is unmounted)
    useEffect(() => {

        const handleNewMessage = (messageObject) => {
            const chatId = messageObject.chatId;
            const message = messageObject.message;

            // Update the lastest message
            dispatch(updateChat({
                chatId,
                lastMessage: {
                    ...message,
                    sender: message.sender._id,
                },
                newMessage: user._id == message.sender._id ? null : 'increase',
            }))

            updateNewMessage(chatId, message.sender._id, 'increase');
            
            
        }

        if (!isChat) {
            socket.on('newMessage', handleNewMessage)  
        } else {
            socket.off('newMessage', handleNewMessage)
        }

        return () => {
            socket.off('newMessage', handleNewMessage)
        }
    }, [isChat]);

    // CONTROLLERS
    const updateNewMessage = (chatId, userId, action) => {
        fetch(`${backendUrl}/chat/newMessage/${chatId}/${userId}/${action}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then((data) => {
                // console.log(data);
            })
            .catch((err) => console.log(err))
    }

    return children;
}


export default ChatWrapper;
