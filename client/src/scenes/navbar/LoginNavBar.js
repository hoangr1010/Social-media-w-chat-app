import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';


function LoginNavBar() {

    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const primaryLight = theme.palette.primary.light;

    return (
      <Box 
        display='flex' 
        justifyContent='center' 
        alignContent='center'
        backgroundColor={alt}
        padding='10px 0'>
        <Typography 
            color='primary' 
            fontWeight='bold' 
            fontSize='clamp(1rem,2rem,2.25rem)'
            sx = {{
                '&:hover': {
                    color: {primaryLight},
                    cursor: 'pointer'
                }
            }}
            >
            Hey!
        </Typography>
      </Box>
    );
  }
  
  export default LoginNavBar;