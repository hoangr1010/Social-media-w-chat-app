import { cyan, grey, red, lightGreen } from '@mui/material/colors';

export default function themeSettings (mode) {
    return {
        palette: mode==='dark' ? {
            // set up for dark themes
            primary: {
                dark: cyan["A200"],
                main: cyan["A400"],
                light: cyan["A700"],
            },
            secondary: {
                main: red['A400']
            },
            neutral: {
                dark: grey[100],
                main: grey[200],
                mediumMain: grey[300],
                medium: grey[400],
                light: grey[600]
            },
            text: {
                primary: '#fff',
                contrast: '#000',
                secondary: grey[400],
                disable: grey[500],
            },
            background: {
                default: grey[900],
                alt: grey[800]
            },
            message: {
                main: lightGreen['A400']
            }
        } : {
            // set up for light themes
            primary: {
                dark: cyan["A700"],
                main: cyan["A400"],
                light: cyan["A200"],
            },
            secondary: {
                main: red[500]
            },
            neutral: {
                dark: grey[700],
                main: grey[500],
                mediumMain: grey[600],
                medium: grey[500],
                light: grey[300],
            },
            text: {
                primary: '#000',
                contrast: '#fff',
                secondary: grey[900],
                disable: grey[800],
            },
            background: {
                default: grey[200],
                alt: grey[100],
            },
            message: {
                main: lightGreen['A400']
            }
        },
        typography: {
            fontFamily: 'Rubik',
            fontSize: 12,
            h1: {
                fontSize: 40
            },
            h2: {
                fontSize: 32
            },
            h3: {
                fontSize: 24
            },
            h4: {
                fontSize: 20
            },
            h5: {
                fontSize: 16
            },
            h6: {
                fontSize: 14
            }
        }
    }
}