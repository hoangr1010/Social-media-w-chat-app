import { useTheme } from '@mui/material/styles';
import Form from 'scenes/loginPage/Form';
import { Box, Typography, useMediaQuery } from '@mui/material';


function LoginPage() {

    const theme = useTheme();
    const alt = theme.palette.background.alt;

    // screen size adaptivity settings
    const isNonMobileScreen = useMediaQuery('(min-width:800px)');


    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          mt: '20px'
        }}
      >

      <Box 
        width={isNonMobileScreen ? '50%' : '90%'} 
        backgroundColor={alt}
        padding='30px 25px'
        borderRadius='20px'
      >
        <Typography fontWeight='bold' fontSize='1.25rem' sx={{pb: '20px'}}>
          Welcome to Hey!
        </Typography>
        <Form />
      </Box>
      
      </Box>
    );
  }
  
  export default LoginPage;