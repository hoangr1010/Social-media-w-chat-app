import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Badge, Avatar } from '@mui/material';

function AvatarStatus({ name, picturePath, size, status }) {

    const assetUrl = process.env.REACT_APP_STATIC_ASSETS_URL;

    // THEME SETTINGS
    const theme = useTheme();
    const background = theme.palette.background.default;

    return (
        <Badge 
            badgeContent=' '
            invisible={status=='offline' ? true : false}
            overlap="circular"
            size='small'
            color='message'
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            sx={{
                '& .MuiBadge-badge': {
                    right: '10%',
                    top: '40%',
                    border: `2px solid ${background}`,
                    padding: '0 4px',
            }}}
        >
            <Avatar 
                alt={name}
                src={`${assetUrl}/${picturePath}`}
                sx={{ width: size, height: size }}/>
        </Badge>
    )
}

export default AvatarStatus;