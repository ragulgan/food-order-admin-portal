import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Tabs, Tab, Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import logo from "../../../assets/images/logo-white.svg";
import footerlogo from "../../../assets/images/footerlogo.webp"
import deliverGif from "../../../assets/images/login_left_image.svg"
import AppSnackbar from '../../commonToast/customizeAlert';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { forgotPassword, clearState as forgotPasswordClearState } from '../../../reduxState/authSlice/ForgotPasswordSlice';
import MerchantLogin from './merchantloginTab'
import { requestForToken } from '../../../firebase/firebaseConfig';
import _ from 'lodash'

const CustomButton = styled(Button)({
  background: '#FC8019',
  borderRadius: '12px',
  color: '#FFFFFF',
  height: '50px',
  boxShadow: 'none'
});

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#B8B8B8',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#DCDCDC',
      borderRadius: '12px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#DCDCDC',
    },
    '& input': {
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '115%',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Inputs = {
  email: string;
  password: string;
  type: string;
};
const Login: React.FC = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [showForgotSuccessAlert, setShowForgotSuccessAlert] = useState<boolean>(false);
  const [showForgotErrorAlert, setShowForgotErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorForgotMessage, setErrorForgotMessage] = useState<any>('');
  const [value, setValue] = React.useState<any>(0);
  const forgotPasswordState = useSelector((state: RootState) => state.forgotPassword);
  const token = localStorage.getItem('AUTH_TOKEN');
  const FCM = localStorage.getItem('FCM') ? localStorage.getItem('FCM') : ''

  const locationCheck = location.pathname.slice(1).split('/')[1];

  React.useEffect(()=>{
    requestForToken()
  },[])

  React.useEffect(() => {
    if (forgotPasswordState?.error === true) {
      setShowForgotErrorAlert(true);
      setErrorForgotMessage(forgotPasswordState.message)
    }else {
      setShowForgotErrorAlert(false);
      setErrorForgotMessage('')
    }
  }, [forgotPasswordState]);

  React.useEffect(() => {
    if (forgotPasswordState?.code === 200) {
      setShowForgotSuccessAlert(true);
    }else {
      setShowForgotSuccessAlert(false);
    }
  }, [forgotPasswordState]);

  const validationSchema = yup.object().shape({
    email: yup.string().required('Email is required').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid Email'),
    password: yup.string().required('Password is required')
  });
  const { handleSubmit, register, reset, getValues, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(validationSchema)
  });
  const passwordHandler = (event: any) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const inputs = {...data, type: locationCheck ==='admin' ? 'ADMIN' : locationCheck === 'merchant' ? 'MERCHANT': locationCheck === 'branch' ? 'BRANCH': '', fcmToken: FCM}
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth`, inputs, config);
      localStorage.setItem("AUTH_TOKEN", response?.data?.data?.accessToken);
      localStorage.setItem("ROLES", JSON.stringify(response?.data?.data));
    } catch (errorCode: any) {
      const errorMessage = errorCode?.response?.data?.message|| 'Something went wrong!';
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
    setLoading(false);
    reset({
      ...data,
      email: errors.email ? '' : data.email,
      password: errors.password ? '' : data.password
    });
  };

  useEffect(()=> {
    if(token){
      navigate(`/dashboard`);
    }
  },[token])
  
  const handleCloseAlert = () => {
    setShowForgotSuccessAlert(false);
    setShowErrorAlert(false);
    setShowForgotErrorAlert(false);
  };
  const handleForgotPasswordModal = () => {
    const values = getValues("email");
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(_.isEmpty(values)) {
      setShowForgotErrorAlert(true)
      setErrorForgotMessage("Email is required.")
    }else if(!emailRegex.test(values)){
      setShowForgotErrorAlert(true)
      setErrorForgotMessage("Invalid email format.")
    }else{
      dispatch(forgotPassword(values))
      reset();
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(()=> {
    if(forgotPasswordState && forgotPasswordState.code === 200) {
      setTimeout(() => {
        dispatch(forgotPasswordClearState())
      },2000)
    }
  }, [forgotPasswordState])

  return (
    <Grid container className="container-head" spacing={2} m={0} width="100%" py={2}>
      <Grid container className="container" item md={8} m={0} width="100%">
        <Grid xs={12} sm={6} md={6} className="logo">
          <img src={logo} alt='logo'></img>
          <div style={{ paddingTop: "50px" }}>
            <img src={deliverGif} alt="img" style={{ width: '75%', height: '75%' }} />
          </div>
          <Typography component="h6" variant="h6" className='login-left-side-text'>
            "Empower your food business operations with precision. Seamlessly oversee orders, products, and deliveries for an exceptional customer experience."
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="form">
          <Box className='right-side-form-padding'>
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '12px' }}>
              {locationCheck ==='admin' ? <><Typography className='login-tab-active-header'>Admin</Typography></> : locationCheck === 'merchant' ? <><Typography className='login-tab-active-header'>Merchant</Typography></>: locationCheck === 'branch' ? 
              <>
              <Typography className='login-tab-active-header'>Branch Manager</Typography>
              </>: null}
              <Typography component="h6" variant="h6" className='login-text' pt={2}>Login</Typography>
              <Typography className='login-sub-heading' py={2}>
                Please login to your account
              </Typography>
              <CustomTextField
                fullWidth
                label="Email"
                id="email"
                variant="outlined"
                required
                className='required-asterisk-color'
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <CustomTextField
                fullWidth
                label="Password"
                variant="outlined"
                required
                className='required-asterisk-color'
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>
                    <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={passwordHandler}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }}
              />
              <CustomButton variant="contained" size='medium' type="submit" className='login-button-text' fullWidth disabled={loading}>
                {
                  loading ? <CircularProgress size={18} style={{ color: '#FFFFFF', marginLeft: '2px' }} /> : 'Login'
                }
              </CustomButton>
              {locationCheck === 'admin' || locationCheck === "branch"? 
              <>
              <Grid item xs={12} className='txt-center' style={{ marginTop: '25px' }}>
                <Typography sx={{height: '17px'}} className='forgot-password-link' onClick={handleForgotPasswordModal}>
                  <span style={{display: 'none'}}>Forgot Password ?</span>
                </Typography>
              </Grid>
              </> : locationCheck === 'merchant' ? 
              <>
              <Grid item xs={12} className='txt-center' style={{ marginTop: '25px' }}>
                <Typography className='forgot-password-link' onClick={handleForgotPasswordModal}>
                  Forgot Password ?
                </Typography>
              </Grid>
              </> : null}        
            </form>
            {showErrorAlert && (
              <AppSnackbar
                showAlert={showErrorAlert}
                message={errorMessage}
                type="error"
                onClose={handleCloseAlert}
              />
            )}
            {showForgotSuccessAlert && (
              <AppSnackbar
                showAlert={showForgotSuccessAlert}
                message={forgotPasswordState.message}
                type="success"
                onClose={handleCloseAlert}
              />
            )}
            {showForgotErrorAlert && (
              <AppSnackbar
                showAlert={showForgotErrorAlert}
                message={errorForgotMessage}
                type="error"
                onClose={handleCloseAlert}
              />
            )}
          </Box>
          <div style={{padding: '12px'}}>
            <img src={footerlogo} alt="Footer" style={{ width: '100%', height: 'auto' }} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Login;