import React, { useState } from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import logo from "../../../assets/images/logo-white.svg";
import deliverGif from "../../../assets/images/reset_left_image.svg"
import footerlogo from "../../../assets/images/footerlogo.webp"
import AppSnackbar from '../../commonToast/customizeAlert';
import { updatePasswordByToken, clearUpdateState } from '../../../reduxState/authSlice/resetPasswordSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';

const CustomButton = styled(Button)({
  background: '#FC8019',
  borderRadius: '12px',
  color: '#FFFFFF',
  height: '50px',
  boxShadow: 'none'
});
const CustomTypography = styled(Typography)({
  fontWeight: '400',
  fontSize: '16px',
  textAlign: 'start',
  color: '#999999',
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
  newpassword: string;
  confirmpassword: string;
};
const ResetPassword: React.FC = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const updateTaskState = useSelector((state: RootState) => state.updatePassword)

  React.useEffect(() => {
    if (updateTaskState.status === 'succeeded') {
      setShowSuccessAlert(true);
    }else{
      setShowSuccessAlert(false);
    }
  }, [updateTaskState]);

  React.useEffect(() => {
    if (updateTaskState.error === true) {
      setShowErrorAlert(true);
    }else{
      setShowErrorAlert(false);
    }
  }, [updateTaskState]);

  const validationSchema = yup.object().shape({
    newpassword: yup.string().required('').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/, 'Passwords should be 8 to 15 characters long and contain alphanumeric characters'),
    confirmpassword: yup.string().required('').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/, 'Passwords should be 8 to 15 characters long and contain alphanumeric characters').oneOf([yup.ref("newpassword")], "Passwords do not match"),
  });
  const { handleSubmit, register, reset, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      newpassword: '',
      confirmpassword: '',
    },
  });
  const passwordHandler = (event: any) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }

  const confirmPasswordHandler = (event: any) => {
    event.preventDefault()
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const locations = location.search.split('?')[1];
    const token = locations.split('token=')[1]
    const payload: any = {
      newPassword: data.newpassword.trim(),
      confirmPassword: data.confirmpassword.trim(),
    }
    dispatch(updatePasswordByToken({ payload, token }));
  };
  React.useEffect(() => {
    if (updateTaskState.code === 200) {
      reset();
      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate(`/login/merchant`);
      }, 3000)
    }
  }, [updateTaskState])
  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

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
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '100px' }}>
            <Typography component="h6" variant="h6" className='login-text'>Reset Password</Typography>
            <Typography className='login-sub-heading' py={2}>
              Please type new password
            </Typography>
            <CustomTextField
              fullWidth
              label="New Password"
              variant="outlined"
              required
              className='required-asterisk-color'
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('newpassword')}
              error={!!errors.newpassword}
              helperText={errors.newpassword?.message}
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
            <CustomTextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              required
              className='required-asterisk-color'
              type={showConfirmPassword ? 'text' : 'password'}
              margin="normal"
              {...register('confirmpassword')}
              error={!!errors.confirmpassword}
              helperText={errors.confirmpassword?.message}
              InputProps={{
                endAdornment: <InputAdornment position='end'>
                  <Tooltip title={showConfirmPassword ? "Hide password" : "Show password"}>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={confirmPasswordHandler}
                    edge='end'
                  >
                    {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                  </Tooltip>
                </InputAdornment>
              }}
            />
            <CustomButton variant="contained" size='medium' type="submit" className='login-button-text' fullWidth disabled={loading}>
              {
                loading ? <CircularProgress size={18} style={{ color: '#FFFFFF', marginLeft: '2px' }} /> : 'Submit'
              }
            </CustomButton>
          </form>
          {showSuccessAlert && (
            <AppSnackbar
              showAlert={showSuccessAlert}
              message={updateTaskState.message}
              type="success"
              onClose={handleCloseAlert}
            />
          )}
          {showErrorAlert && (
            <AppSnackbar
              showAlert={showErrorAlert}
              message={updateTaskState.message}
              type="error"
              onClose={handleCloseAlert}
            />
          )}
          </Box>
          <div style={{padding: '24px 12px'}}>
            <img src={footerlogo} alt="Footer" style={{ width: '100%', height: 'auto' }} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default ResetPassword;