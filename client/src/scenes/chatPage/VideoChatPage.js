import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid } from '@mui/material';
import { socket } from 'socket';
import { Peer } from "peerjs";
import FlexBetween from 'components/Flexbetween';
import LogoutIcon from '@mui/icons-material/Logout';

function VideoChatPage () {

    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [selfPeerId, setSelfPeerId] = useState('');
    const [remotePeerId, setRemotePeerId] = useState('')
    const selfVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    
    // THEME SETTINGS
    const theme = useTheme();
    const primaryDark = theme.palette.primary.dark;
    
    // PEERJS AND SOCKET HANDLING
    
    // Connect to PeerJS server, Join Room
    useEffect(() => {

        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', (id) => {
            setSelfPeerId(id);
            socket.emit('joinVideoRoom', chatId, id);
        })
  
        startSelfVideo();
    }, []);
    
    // Handle upcoming calling
    useEffect(() => {
        peerRef.current.on('call', (call) => {
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({ video: true, audio: false }, 
                (stream) => {
                    call.answer(stream);
                    call.on('stream', (remoteStream) => {
                        renderStream(remoteVideoRef, remoteStream);
                    })
                }
                )
            setRemotePeerId('exist');
        })
                
    }, [remotePeerId])

    // Handle singalling from other peer and call other
    useEffect(() => {
        socket.on('signalling', (remoteId) => {
            setRemotePeerId(remoteId);
            call(remoteId);
        })

        return () => {
            socket.off('signalling');
        }
    },[remotePeerId])

    // Handle peer leave room
    useEffect(() => {
        socket.on('remoteLeaveVideoRoom', () => {
            setRemotePeerId(null);
            remoteVideoRef.current.srcObject = null;
        })

        return () => {
            socket.off('remoteLeaveVideoRoom');
        }
    }, [])

    // CONTROLLERS
    const startSelfVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        renderStream(selfVideoRef, stream);
    };

    const call = (remotePeerId) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: false }, 
            (stream) => {
                const call = peerRef.current.call(remotePeerId, stream);

                call.on('stream', (remoteStream) => {
                    renderStream(remoteVideoRef, remoteStream);
            })
        },
            (err) => {
                console.error('Failed to get local stream', err);
            }

        )
    }

    const renderStream = (ref, stream) => {
        try {
            ref.current.srcObject = stream;
    
            var playPromise = ref.current.play();
            if (playPromise) {
                playPromise
                    .then()  
                    .catch((err) => {
                        // console.error("Video playback failed:", err);
                    })
            }
        } catch (err) {
            console.error('Error accessing user media:', err);
        }
    }

    const leaveChatRoom = () => {
        socket.emit('leaveVideoRoom', chatId);
        navigate(`/chat/${chatId}`); 
        navigate(0);
    }

    return (
        <Box
            display='flex'
            className='page'
            sx={{
                flexDirection: 'column',
            }}
        >

            <FlexBetween 
                padding='5% 5% 0px 5%' 
                gap='30px'
                sx={{
                    flexGrow: 1
                }}    
            >

                <Grid container spacing={2} height='100%'>

                    <Grid item xs={12} md={6}>
                        <Box display='flex' sx={{
                            justifyContent: 'center',
                            padding: '10px',
                            height: '100%'
                        }}>
                            <video
                                ref={selfVideoRef}
                                style={{ 
                                    height: '100%', 
                                    maxWidth: '100%', 
                                    borderRadius: '5%', 
                                    border: `3px solid ${primaryDark}`,     
                                    backgroundImage: `url('${assetUrl}/user.png')`,
                                    backgroundSize: '50% ',  // Adjust these values to control the size of the poster
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',

                                }}
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Box display='flex' sx={{
                            justifyContent: 'center',
                            padding: '10px',
                            height: '100%'
                        }}>
                            <video 
                                ref={remoteVideoRef}
                                style={{ 
                                    height: '100%', 
                                    maxWidth: '100%', 
                                    borderRadius: '5%', 
                                    border: `3px solid ${primaryDark}`,     
                                    backgroundImage: `url('${assetUrl}/user.png')`,
                                    backgroundSize: '50% ',  // Adjust these values to control the size of the poster
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',

                                }}
                            />
                        </Box>
                    </Grid>

                </Grid>


            </FlexBetween>

            <Button onClick={leaveChatRoom} color='secondary' sx={{ p: '10px', m: '5%'}}>
                <LogoutIcon fontSize='large'/>
            </Button>

        </Box>
  
    )
}

export default VideoChatPage;