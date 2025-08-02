import * as React from 'react';
import { Typography, Box, Grid, TextField, Button } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '../../reduxState/store';
import merchant from '../../assets/images/merchantEmpImage.svg'
import { fetchMerchants, clearListState } from '../../reduxState/merchantSlice/merchantListSlice';
import { Role_Types } from '../utils/constant'
import _ from "lodash";


const GeneralTabs: React.FC<any> = () => {

  const { control, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      contactNo: '',
      contactAddress: '',
    }
  });
  const readTaskState = useSelector((state: RootState) => state.merchants);
  const dispatch = useDispatch<AppDispatch>();
  // roles
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)

  React.useEffect(() => {
    if (roles_data?.role !== Role_Types.Admin) {
      dispatch(fetchMerchants(''))
    }
  }, [])

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Admin) {
      dispatch(clearListState())
    }
  }, [])

  React.useEffect(() => {
    if (readTaskState && readTaskState.data) {
      reset({
        fullName: readTaskState?.data[0]?.contactName,
        email: readTaskState?.data[0]?.contactEmail,
        contactNo: readTaskState?.data[0]?.contactNo,
        contactAddress: readTaskState?.data[0]?.contactAddress,
      })
    }
  }, [readTaskState])

  return (
    <React.Fragment>
      <Box className='general-box'>
      <Box sx={{ bgcolor: 'background.paper', position:'sticky', top: "19%", zIndex: 2 }}>
        <Typography variant="h6" align='left' className='general-title inter-med' my={2}>
          Personal Details
        </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  render={({ field: { value } }) => (
                    <TextField
                      margin="normal"
                      fullWidth
                      id="fullName"
                      label="Full Name"
                      name="fullName"
                      disabled
                      value={value}
                      InputProps={{
                        autoComplete: 'off',
                        sx: {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field: { value } }) => (
                    <TextField
                      margin="normal"
                      fullWidth
                      disabled
                      id="email"
                      label="Email Address"
                      name="email"
                      value={value}
                      InputProps={{
                        autoComplete: 'off',
                        sx: {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="contactNo"
                  control={control}
                  defaultValue=""
                  render={({ field: { value } }) => (
                    <TextField
                      margin="normal"
                      fullWidth
                      id="contactNo"
                      label="Contact Number"
                      name="contactNo"
                      disabled
                      value={value}
                      InputProps={{
                        autoComplete: 'off',
                        sx: {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="contactAddress"
                  control={control}
                  defaultValue=""
                  render={({ field: { value } }) => (
                    <TextField
                      margin="normal"
                      fullWidth
                      multiline
                      disabled
                      maxRows={3}
                      id="contactAddress"
                      label="Address"
                      name="contactAddress"
                      value={value}
                      InputProps={{
                        autoComplete: 'off',
                        sx: {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container columns={12} spacing={2} px={3} className='img-padding'>
              <Grid item xs={12} lg={12} display='flex' justifyContent='center'>
                {readTaskState?.data[0]?.image && !_.isEmpty(readTaskState?.data[0]?.image?.id) ?
                  <img src={`${process.env.REACT_APP_API_BASE_URL}${readTaskState?.data[0]?.image?.filePath}`} width={'100%'} height={'100%'} alt="Profile picture" /> :
                  <img src={merchant} width={'100%'} height={'100%'} alt="Profile picture" />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box className='general-box' mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }} className='general-title inter-med' my={2}>
              Delete Account
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" className='delete-text inter-med' mb={1}>
              Delete your account and all of your source data. This is irreversible.
            </Typography>
            <Button variant="outlined" className='delete-button inter-med'>
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default GeneralTabs;