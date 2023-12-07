import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const WidgetWrapper = styled(Box)( ({ theme }) => ({
    padding: "1rem 1rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius: "15px"
}));

export default WidgetWrapper;