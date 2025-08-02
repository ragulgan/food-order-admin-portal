import React, { Fragment, useState, useEffect } from 'react'
import {
  Box, Button, Grid, TextField, Typography, CircularProgress, Stack
} from '@mui/material';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IMaskInput } from 'react-imask';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { addCoupon, clearAddState } from '../../../../reduxState/offerCouponSlice/couponAddSlice';
import { updateCouponById, clearUpdateState } from '../../../../reduxState/offerCouponSlice/couponUpdateSlice';
import { clearEditState, fetchCouponById } from '../../../../reduxState/offerCouponSlice/couponEditSlice';
import FormControlLabel from '@mui/material/FormControlLabel';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert'

const CouponAdd: React.FC<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const addCouponData = useSelector((state: RootState) => state.couponAdd);
  const updateCouponData = useSelector((state: RootState) => state.couponUpdate);
  const editCouponState = useSelector((state: RootState) => state.couponEdit);
  const [inputValue, setInputValue] = useState('');
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (addCouponData?.error === true || updateCouponData?.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [addCouponData, updateCouponData]);

  const validationSchema = yup.object().shape({
    couponName: yup.string().required(''),
    couponPercentage: yup.number().required('').typeError('Percentage must be a number').min(1, 'Percentage must be greater than or equal to 1').max(100, 'Percentage cannot exceed 100'),
    couponDescription: yup.string().required(''),
    status: yup.boolean().required(''),
  });
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      couponCode: '',
      couponName: '',
      couponPercentage: '',
      couponDescription: '',
      status: true,
    }
  });
  const statusWatch = watch('status');

  const onSubmit = (event: any) => {
    const payload: any = {
      coupenName: event.couponName.trim(),
      coupenPerc: event.couponPercentage,
      coupenDesc: event.couponDescription.trim(),
      status: event.status === true ? 'ACTIVE' : 'INACTIVE'
    }
    if (location.state) {
      payload.id = location.state;
      dispatch(updateCouponById(payload));
    }
    else {
      dispatch(addCoupon(payload));
    }
  }
  React.useEffect(() => {
    if (addCouponData?.code === 200 || updateCouponData?.code === 200) {
      reset({
        couponCode: '',
        couponName: '',
        couponPercentage: '',
        couponDescription: '',
        status: true,
      });
      dispatch(clearEditState())
      navigate("/OffersCoupons/coupons")
    }
  }, [addCouponData, updateCouponData])

  useEffect(() => {
    if (location.state) {
      dispatch(fetchCouponById(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (editCouponState && editCouponState?.code === 200 && editCouponState && editCouponState?.data && editCouponState?.data?.id) {
      seteditShow(true)
      reset({
        couponName: editCouponState?.data?.coupenName,
        couponCode: editCouponState?.data?.coupenCode,
        couponDescription: editCouponState?.data?.coupenDesc,
        couponPercentage: editCouponState?.data?.coupenPerc,
        status: editCouponState?.data?.status === 'ACTIVE' ? true : false,
      });
    }
  }, [editCouponState])


  const handleOnCloseModal = () => {
    reset({
      couponCode: '',
      couponName: '',
      couponPercentage: '',
      couponDescription: '',
      status: true,
    });
    dispatch(clearEditState())
    navigate("/OffersCoupons/coupons")
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearAddState());
    dispatch(clearUpdateState());
  };

  return (
    <Fragment>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px', width: "100%" }}>
        <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <Typography className='view-details-header' variant="h5" align='center' mb={2}>{editShow ? "Edit Coupon" : "Add Coupon"}</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  {
                    editShow ? (
                      <Controller
                        name="couponCode"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            disabled
                            fullWidth
                            id="couponCode"
                            label="Coupon Code"
                            name="couponCode"
                            value={value || ''}
                            onChange={onChange}
                            InputProps={{
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px',
                              }
                            }}
                          />
                        )}
                      />
                    ) : null
                  }

                  <Controller
                    name="couponName"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="couponName"
                        label="Coupon Name"
                        name="couponName"
                        required
                        className='required-asterisk-color'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        inputProps={{
                          onKeyPress: (event) => {
                            const regex = /^[a-zA-Z0-9\s]+$/;
                            if (!regex.test(event.key) || value.length >= 30) {
                              event.preventDefault();
                            }
                          },
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          sx: {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="couponPercentage"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="couponPercentage"
                        label="Coupon Percentage"
                        name="couponPercentage"
                        required
                        className='required-asterisk-color'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}    
                        InputProps={{
                          endAdornment: '%',
                          inputComponent: IMaskInput as any,
                          autoComplete: 'off',
                          inputProps: {
                            mask: '000',
                          },
                          sx: {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="couponDescription"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="couponDescription"
                        label="Coupon Description"
                        name="couponDescription"
                        required
                        className='required-asterisk-color'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        helperText="max 250 characters"
                        rows={2}
                        multiline
                        inputProps={{
                          onKeyPress: (event) => {
                            if (value.length >= 250) {
                              event.preventDefault();
                            }
                          },
                        }}
                        InputProps={{
                          autoComplete: 'off',
                          sx: {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                  <FormControlLabel
                    control={
                      <Controller
                        name="status"
                        control={control}
                        render={({ field: { value }, fieldState: { error } }) => (
                          <Stack direction="row" alignItems="center">
                            <Switch
                              checked={value}
                              onChange={(e) => setValue('status', e.target.checked)}
                              color={value ? 'warning' : 'default'}
                            />
                            <Typography className={statusWatch === true ? 'branch-status-active' : 'branch-status-inactive'}>{statusWatch === true ? 'Active' : 'Inactive'}</Typography>
                          </Stack>
                        )}
                      />
                    }
                    label=""
                    labelPlacement="start"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addCouponData?.loading || updateCouponData?.loading} onClick={() => handleSubmit(onSubmit)}>
                      {
                        addCouponData?.loading || updateCouponData?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                        !editShow  ? 'Save': 'Update'
                      }
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Box>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addCouponData?.message || updateCouponData?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  )
}

export default CouponAdd