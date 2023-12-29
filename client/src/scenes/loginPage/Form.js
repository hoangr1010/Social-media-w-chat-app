import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from 'formik';
import {useDropzone} from 'react-dropzone'
import * as yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { setLogin } from 'state';
import { Box, Typography, Grid, TextField, Button, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Form() {
    const [formType, setFormType] = useState('login');
    const isRegister = formType ==='register';
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // THEME PALETTE SETTINGS
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const neutralLight = theme.palette.neutral.light;
    const neutralDark = theme.palette.neutral.dark;
    const neutralMediumMain = theme.palette.neutral.mediumMain;
    const primaryDark = theme.palette.primary.dark;


    // YUP SETTINGS
    const loginSchema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email address')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'password should be of minimum 8 characters length')
            .required('Password is required')
    })

    const registerSchema = yup.object({
        firstName: yup
            .string('Enter your first name')
            .required('First name is required'),
        lastName: yup
            .string('Enter your last name')
            .required('Last name is required'),
        location: yup
            .string('Enter your last name'),
        occupation: yup
            .string('Enter your occupation'),
        email: yup
            .string("Enter your email address")
            .email('Enter a valid email address')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'password should be of minimum 8 characters length')
            .required('Password is required'),
    })

    // FORMIK SETTINGS
    const initialLoginValue = {
        email: '',
        password: ''
    }

    const initialRegisterValue = {
        firstName: '',
        lastName: '',
        location: '',
        occupation: '',
        email: '',
        password: '',
    }

    const formik = useFormik({
        initialValues: isRegister ? initialRegisterValue : initialLoginValue,
        validationSchema: isRegister ? registerSchema : loginSchema,
        onSubmit: handleSubmit,
    })

    // DROPZONE SETTINGS
    const [file,setFile] = useState(null);
    const onDrop = useCallback(acceptedFile => {
        setFile(acceptedFile[0])
    },[])
    const {getRootProps, getInputProps, open, isDragActive} = useDropzone({onDrop, accept: {
        'image/*': ['.jpeg', '.png']
    }})

    // CONTROLLERS
    async function handleSubmit(values, formikProps) {
        if (isRegister) {
            await registerPost(values);
        } else {
            await loginPost(values);
        }

        formikProps.resetForm();
        setFile(null);
    }

    async function registerPost(values) {
        const formData = new FormData();
        
        if (file) {
            formData.append('picture',file);
            formData.append('picturePath', file.path);
        }

        for (let field in values) {
            formData.append(field, values[field]);
        }

        await fetch(`${backendUrl}/auth/register`, {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

        setFormType('login');
    }

    async function loginPost(values) {

        await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                // Save user and token in redux
                dispatch(setLogin({user: data.user, token: data.token}));
                navigate('/home');
                navigate(0);
            })
            .catch(err => alert(err.message));

    }

    return (
        <Box >
          <form onSubmit={formik.handleSubmit}>

            {isRegister ? (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                        <TextField 
                            name="firstName" 
                            fullWidth 
                            label='First Name'
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <TextField 
                            name="lastName" 
                            fullWidth 
                            label='Last Name'
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            name="location" 
                            fullWidth 
                            label='Location'
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.location && Boolean(formik.errors.location)}   
                            helperText={formik.touched.location && formik.errors.location}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="occupation" 
                            fullWidth 
                            label='Occupation'
                            value={formik.values.occupation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.occupation && Boolean(formik.errors.occupation)}    
                            helperText={formik.touched.occupation && formik.errors.occupation}               
                        />
                    </Grid>
                    
                    {/* Image Dropzone */}
                    {file ? (
                        // Show file name
                        <Grid item xs={12}>
                            <Box 
                                display='flex'
                                justifyContent='space-between'
                                alignContent='center'
                                padding='10px 10px'
                                sx={{
                                    border: 'solid 1px',
                                    borderRadius: '5px',
                                    borderColor:neutralMediumMain,
                                }}
                            >
                                {/* show file name */}
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    gap='5px'
                                >
                                    <ImageIcon/>
                                    <Typography>
                                        {file.path}
                                    </Typography>
                                </Box>

                                {/* Edit button */}
                                <Box>
                                    <IconButton>
                                        <EditIcon size='small' onClick={open}/>
                                    </IconButton>
                                    <IconButton>
                                        <DeleteIcon size='small' color='error' onClick={() => setFile(null)}/>
                                    </IconButton>
                                </Box>
                                
                            </Box>
                        </Grid>
                    ) : (
                    // File dropzone
                    <Grid item xs={12}>
                        <Box 
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            padding='10px 10px'
                            sx={{
                                border: 'solid 1px',
                                borderRadius: '5px',
                                borderColor:neutralMediumMain,
                            }}
                        >
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ? (
                                        <Typography
                                            padding = '10px 100px'
                                            sx={{
                                                '&: hover': {
                                                    cursor: 'pointer'
                                                    
                                                },
                                                border: 'dashed',
                                                borderRadius: '5px',
                                                borderColor: primary
                                            }}
                                        >Drop the image here ....</Typography>
                                    ) : (
                                        <Typography 
                                            padding = '10px 25px'
                                            color={neutralDark}
                                            border='solid'
                                            sx={{
                                                '&: hover': {
                                                    cursor: 'pointer'
                                                },
                                                border: 'dashed',
                                                borderRadius: '5px',
                                                borderColor: primaryDark
                                            }}
                                        >Drag and drop image here, or click to select image</Typography>
                                    )
                                }
                            </div>
                        </Box>
                    </Grid>
                    )}
                    {/* ----------------- */}
                    
                    <Grid item xs={12}>
                        <TextField 
                            name='email' 
                            fullWidth 
                            label='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)} 
                            helperText={formik.touched.email && formik.errors.email}                  
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name='password' 
                            fullWidth 
                            label='Password' 
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)} 
                            helperText={formik.touched.password && formik.errors.password}                  
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField 
                            name='email' 
                            fullWidth 
                            label='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)} 
                            helperText={formik.touched.email && formik.errors.email}                  
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name='password' 
                            fullWidth 
                            label='Password' 
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)} 
                            helperText={formik.touched.password && formik.errors.password}                  
                        />
                    </Grid>
                </Grid>
            )}
            
            <Button type='submit' fullWidth variant='contained' sx={{my: '15px', py: '15px'}}>
                <Typography fontWeight='bold' color={neutralLight}>
                    {isRegister ? 'Register' : 'Login'}
                </Typography>
            </Button>

          </form>

          <Typography 
            color='primary'
            onClick={() => {
                formik.resetForm();
                setFormType(isRegister ? 'login' : 'register');
                }
            }
            sx={{
                textDecoration: 'underline',
                '&:hover': {
                    color: primaryDark,
                    cursor: 'pointer',
                }
            }}
          >
            {isRegister ? "Already Have an account? Login here" : "Don't have an account? Sign Up here"}
          </Typography>
        </Box>
    )
  }
  
  export default Form;