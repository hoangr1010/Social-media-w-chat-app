import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {useDropzone} from 'react-dropzone'
import { useTheme } from '@mui/material/styles';
import { setPosts } from 'state';
import { Box, Typography, Avatar, IconButton, Button, InputBase, Divider, CircularProgress } from '@mui/material';
import FlexBetween from "components/Flexbetween";
import WidgetWrapper from 'components/WidgetWrapper';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function MyPostWidget({ avatarSize}) {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const token = useSelector(state => state.authReducer.token);
    const [post,setPost] = useState('');
    const [isHandlePostLoading,setIsHandlePostLoading] = useState(false);

    // THEME SETTINGS
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const neutralMedium = theme.palette.neutral.medium;
    
    // DROPZONE SETTINGS
    const [isImage,setIsImage] = useState(false);
    const [file,setFile] = useState(null);
    
    const onDrop = useCallback((acceptedFile) => {
        setFile(acceptedFile[0]);
    },[])
    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({onDrop, accept: {
        'image/*': ['.jpeg', '.png']
    }})

    // CONTROLLERS

    const handlePost = async () => {
        setIsHandlePostLoading(true);
        const formData = new FormData();    
        
        formData.append('description', post);
        formData.append('userId', user._id);

        if (file) {
            formData.append('picture', file);
            formData.append('picturePath', file.path);
        }
        
        await fetch(`${backendUrl}/posts`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then(data => {
                console.log(data);
                if (data.userPosts) {
                    const posts = data.userPosts;
                    dispatch(setPosts(posts));
                }
            })
            .catch(err => console.log(err));
        
        // reset post form
        setPost('');
        setFile(null);
        setIsHandlePostLoading(false)
    }
    

    return (
      <WidgetWrapper width='100%'>
        <Box padding='0 10px'>

        <FlexBetween>
            <Avatar 
                sx={{
                    width: avatarSize,
                    height: avatarSize,
                }}
                src={`${assetUrl}/${user.picturePath}`}
            />       

            <Box backgroundColor={neutralLight} width='100%' sx={{
                    ml: '20px', 
                    p: '10px 20px',
                    borderRadius: '25px'               
                }}>
                <InputBase 
                    fullWidth 
                    multiline 
                    placeholder="How are you today?"
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                />        
            </Box>
        </FlexBetween>

        {/* Image block */}
        {
            !isImage && (
                <Box padding='1.1rem 0px'>
                    <Divider sx={{ bgcolor: neutralLight }}/>
                </Box>
            )
        }

        {
            (isImage && !file) && (
                <Box
                    margin='1.1rem 0px'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                    height='90px'
                    sx={{
                        border: 'solid 1px',
                        borderRadius: '5px',
                        borderColor: neutralLight,
                    }}
                >
                    <Box 
                        {...getRootProps()}
                        padding='1.1rem 0px'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        width='85%'
                        sx={{
                            border: 'dashed 1px',
                            borderRadius: '5px',
                            '&:hover': { cursor: 'pointer' },
                        }}
                    >
                        <input {...getInputProps()} />
                        {
                            isDragActive ? (
                                <Typography>Drop the Image here ...</Typography>
                            ) : (
                                <Typography>Drag and drop image here, or click to select files</Typography>
                            )
                        }
                    </Box>
                </Box>
            )
        }

        {
            (isImage && file && !isHandlePostLoading) && (
                <FlexBetween
                    margin='1.1rem 0px'
                    padding='1rem 0.8rem'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                    sx={{
                        border: 'solid 1px',
                        borderRadius: '5px',
                        borderColor: neutralLight,
                    }}
                >
                    {/* Image name */}
                    <FlexBetween gap='10px'>
                        <ImageOutlinedIcon/>
                        <Typography>{file.name}</Typography>
                    </FlexBetween>

                    {/* Edit image */}
                    <FlexBetween gap='10px'>
                        <IconButton onClick={open} sx={{color: neutralMedium}}>
                            <EditOutlinedIcon />
                        </IconButton>

                        <IconButton onClick={() => setFile(null)} color='error'>
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </FlexBetween>


                </FlexBetween>
            )
        }

        {isImage && file && isHandlePostLoading && (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                padding='1.1rem 0px'
            >
                <CircularProgress/>
            </Box>

        )}

        {/* ---- END Image block ---------*/}

        <FlexBetween gap='7%'>
            
            {/* Image, Video button */}
            <FlexBetween gap='30%'>

                <FlexBetween 
                    gap='3px' 
                    onClick={() => setIsImage(!isImage)}
                    sx={{
                    '&:hover': {
                        cursor: 'pointer',
                    }
                }}>
                    <ImageOutlinedIcon sx={{ color: neutralMedium }}/>
                    <Typography color={neutralMedium}>
                        Image
                    </Typography>
                </FlexBetween>

                <FlexBetween gap='3px' sx={{
                    '&:hover': {
                        cursor: 'pointer',
                    }
                }}>
                    <VideoLibraryOutlinedIcon sx={{ color: neutralMedium }}/>
                    <Typography color={neutralMedium}>
                        Video
                    </Typography>
                </FlexBetween>


            </FlexBetween>
            
            <Button disabled={!post&&!file} onClick={handlePost} variant="contained" sx={{borderRadius: '20px'}}>Post</Button>

        </FlexBetween>

    
        </Box>
      </WidgetWrapper>
    );
  }
  
  export default MyPostWidget;