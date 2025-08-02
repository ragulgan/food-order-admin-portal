import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppSnackbar from '../../commonToast/customizeAlert';
import { AppDispatch, RootState } from '../../../reduxState/store';
import { forgotPassword, clearState as forgotPasswordClearState } from '../../../reduxState/authSlice/ForgotPasswordSlice';
import { requestForToken } from '../../../firebase/firebaseConfig';

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

type Inputs = {
  email: string;
  password: string;
  type: string;
};
const MerchantLogin: React.FC = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [showForgotSuccessAlert, setShowForgotSuccessAlert] = useState<boolean>(false);
  const [showForgotErrorAlert, setShowForgotErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [value, setValue] = React.useState<any>(0);
  const forgotPasswordState = useSelector((state: RootState) => state.forgotPassword);
  const token = localStorage.getItem('AUTH_TOKEN');
  const FCM = localStorage.getItem('FCM') ? localStorage.getItem('FCM') : ''

  React.useEffect(()=>{
    requestForToken()
  },[])

  React.useEffect(() => {
    if (forgotPasswordState?.error === true) {
      setShowForgotErrorAlert(true);
    }else {
      setShowForgotErrorAlert(false);
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
    const inputs = {...data, type:'MERCHANT', fcmToken: FCM}
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
      const errorMessage = errorCode?.response?.data?.message || 'Something went wrong!';
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
    setLoading(false);
    reset();
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
    dispatch(forgotPassword(values))
    reset();
  };

  useEffect(()=> {
    if(forgotPasswordState && forgotPasswordState.code === 200) {
      setTimeout(() => {
        dispatch(forgotPasswordClearState())
      },2000)
    }
  }, [forgotPasswordState])

  return (
        <React.Fragment>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '12px' }}>
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
              <Grid item xs={12} className='txt-center' style={{ marginTop: '25px' }}>
                <Typography className='forgot-password-link' onClick={handleForgotPasswordModal}>
                  Forgot Password ?
                </Typography>
              </Grid>
            </form>
            {showForgotSuccessAlert && (
              <AppSnackbar
                showAlert={showForgotSuccessAlert}
                message={forgotPasswordState.message}
                type="success"
                onClose={handleCloseAlert}
              />
            )}
            {showErrorAlert && (
              <AppSnackbar
                showAlert={showErrorAlert}
                message={errorMessage}
                type="error"
                onClose={handleCloseAlert}
              />
            )}
            {showForgotErrorAlert && (
              <AppSnackbar
                showAlert={showForgotErrorAlert}
                message={forgotPasswordState.message === 'Internal Server Error' ? 'Email is required' : forgotPasswordState.message}
                type="error"
                onClose={handleCloseAlert}
              />
            )}
        </Grid>
        </React.Fragment>
  );
}
export default MerchantLogin;