import { useRef, useEffect } from 'react';
import { Box, Typography, InputBase, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';


function CommentWidget({ comments }) {

  const boxRef = useRef(null);

  // THEME SETTINGS
  const theme = useTheme();
  const neutralDark = theme.palette.neutral.light;
  const primaryDark = theme.palette.primary.dark;

  useEffect(() => {
    // Scroll to the bottom with smooth scrolling when comments change
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [comments]);

  return (
    <Box>
      <Box
        ref={boxRef} 
        maxHeight='8rem'  
        sx={{
            overflow: 'auto',
            mt: '10px'
        }}
      >
        {
            comments.map((comment,index) => (
                <Box 
                    key={index}
                    backgroundColor={neutralDark}
                    margin='5px 10px'
                    padding='0px 10px'
                    borderRadius='10px'
                >
                    <Typography>{comment}</Typography>
                </Box>
            ))
        }

      </Box>
    </Box>
  );
}

export default CommentWidget;