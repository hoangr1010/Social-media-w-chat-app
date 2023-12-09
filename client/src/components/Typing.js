import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

function Typing({ name }) {

    const [dots, setDots] = useState('');

    // THEME SETTINGS
    const theme = useTheme();
    const alt = theme.palette.background.alt;

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDots((prevDots) => prevDots.length == 3 ? '' : prevDots + '.')
        },500);

        return () => {
            clearInterval(dotInterval);
        }

    },[])

    return (
        <Box
            backgroundColor = {alt}
            padding='0px 3px'
        >
            <Typography fontStyle='italic'>
                {name} typing{dots}
            </Typography>
        </Box>
    )
}

export default Typing;