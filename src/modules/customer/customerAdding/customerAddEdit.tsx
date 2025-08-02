/* eslint-disable */
import React, { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, Grid, Modal, TextField, Typography,
  CircularProgress, FormControlLabel, Switch, Stack
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import avatorEmpty from '../../../assets/images/avatorEmpty.png'
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, clearAddState } from '../../../reduxState/customerSlice/customerAddSlice';
import { updateCustomerById, clearUpdateState } from '../../../reduxState/customerSlice/customerUpdateSlice';
import { fetchCustomerById, clearViewState } from '../../../reduxState/customerSlice/customerViewSlice';
import { singleFileUpload, clearState as clearFileUpload } from '../../../reduxState/fileupload/singleFileUpload'
import { deleteFile, clearState as clearDeleteFile } from '../../../reduxState/fileupload/deleteFile'
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import _ from 'lodash'

const Input = styled('input')({
  display: 'none',
});

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: any;
  handleReset: () => void;
}

const CustomerAdd: React.FC<any> = ({ isOpen, onClose, customerId, handleReset}: ConfirmationModalProps) => {
  const validationSchema = yup.object().shape({
    firstName: yup.string().required(''),
    lastName: yup.string().required(''),
    mobileNo: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    email: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    status: yup.boolean().required(''),
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNo: '',
      image: {},
      email: '',
      status: true,
    },
  });

  const statusWatch = watch('status');

  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.customerAdd)
  const updateTaskState = useSelector((state: RootState) => state.customerUpdate)
  const readTaskState = useSelector((state: RootState) => state.customerView)
  const customerUploadState = useSelector((state: RootState) => state.singleUpload.data)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [imageValue, setImageValue] = React.useState(customerUploadState)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    setImageValue(customerUploadState)
  }, [customerUploadState])

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
        setIsErrorSnackbarOpen(true);
        setTimeout(()=>{
          dispatch(clearAddState());
          dispatch(clearUpdateState());
        },2000)
    }
  }, [addTaskState, updateTaskState]);

  const handleOnCloseModal = () => {
    reset({
      firstName: '',
      lastName: '',
      mobileNo: '',
      image: '',
      email: '',
      status: true,
    });
    dispatch(clearFileUpload())
    dispatch(clearViewState())
    onClose();
  }

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      firstName: event.firstName.trim(),
      lastName: event.lastName.trim(),
      mobileNo: event.mobileNo,
      email: event.email.trim(),
      image: { id: imageValue?.id, displayName: imageValue?.displayName, filePath: imageValue?.filePath },
      status: event.status === true ? 'ACTIVE' : 'INACTIVE'
    }
    if (customerId) {
      payload.id = customerId;
      dispatch(updateCustomerById(payload));
    }
    else {
      dispatch(addCustomer(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200) {
      reset();
      dispatch(clearFileUpload())
      onClose();
      handleReset();
    }
  }, [addTaskState])
  React.useEffect(() => {
    if (updateTaskState?.code === 200) {
      reset({
        firstName: '',
        lastName: '',
        mobileNo: '',
        image: '',
        email: '',
        status: true,
      });
      dispatch(clearFileUpload())
      dispatch(clearViewState())
      onClose();
      handleReset();
    }
  }, [updateTaskState])

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerById(customerId));
    }
  }, [customerId]);

  useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      reset({
        firstName: readTaskState?.data?.firstName,
        lastName: readTaskState?.data?.lastName,
        mobileNo: readTaskState?.data?.mobileNumber,
        email: readTaskState?.data?.emailId,
        image: readTaskState?.data?.image,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
      })
      setImageValue(readTaskState?.data?.image)
    }
  }, [readTaskState])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files?.[0]
    const formData = new FormData()
    formData.append('file', files)
    dispatch(singleFileUpload(formData))
  }

  const handleDelete = () => {
    if (customerUploadState?.id) {
      dispatch(deleteFile(customerUploadState?.id))
      dispatch(clearFileUpload())
    }
  }

  const handleProfileImageClick = () => {
    const inputElement = document.getElementById('profile-image-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'scroll', width: '75%', height: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '18px' }}>
          <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
            <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>{customerId ? "Edit Customer" : "Add Customer"}</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={onChange}
                          error={!!error}
                          autoFocus
                          inputProps={{
                            onKeyPress: (event) => {
                              const regex = /^[a-zA-Z]+$/;
                              if (!regex.test(event.key) || value.length >= 15) {
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
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id="email"
                          label="Email"
                          name="email"
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={onChange}
                          error={!!error}
                          inputProps={{
                            onKeyPress: (event) => {
                              if (value.length >= 30) {
                                event.preventDefault();
                              }
                            },
                          }}
                          InputProps={{
                            autoComplete: 'off',
                            sx: {
                              borderRadius: '8px'
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={onChange}
                          error={!!error}
                          inputProps={{
                            onKeyPress: (event) => {
                              const regex = /^[a-zA-Z]+$/;
                              if (!regex.test(event.key) || value.length >= 15) {
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
                      name="mobileNo"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id="mobileNo"
                          label="Contact No"
                          name="mobileNo"
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={onChange}
                          error={!!error}
                          InputProps={{
                            autoComplete: 'off',
                            inputComponent: IMaskInput as any,
                            inputProps: {
                              mask: '0000000000',
                            },
                            sx: {
                              borderRadius: '8px'
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Grid container columns={12} spacing={2} px={3} className='img-padding' >
                      <Grid item xs={12} lg={12} display='flex' justifyContent='center' >
                        {!customerId && !_.isEmpty(imageValue) ? (
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                            width={'180px'}
                            height={'180px'}
                            alt="Profile picture"
                            style={{ borderRadius: '20px', objectFit: 'cover' }}
                            loading='lazy'
                          />
                        ) : customerId && !_.isEmpty(imageValue) && !_.isNull(imageValue.id) ? (
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                            width={'180px'}
                            height={'180px'}
                            alt="Profile picture"
                            style={{ borderRadius: '20px', objectFit: 'cover' }}
                            loading='lazy'
                          />
                        ) : (
                          <img
                            src={avatorEmpty}
                            width={'180px'}
                            height={'180px'}
                            alt="Profile picture"
                            style={{ borderRadius: '20px', objectFit: 'cover' }}
                            loading='lazy'
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} lg={12} display='flex' justifyContent='center'>
                        <Button className='profile-button' variant="outlined" onClick={handleProfileImageClick}>
                          Change Profile Image
                        </Button>
                        <input
                          accept="image/*"
                          id="profile-image-upload"
                          type="file"
                          onChange={(e) => {
                            {
                              handleFileChange(e)
                              e.target.value === null
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                      <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={() => handleSubmit(onSubmit)}>
                      {
                        addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                        !editShow  ? 'Save': 'Update'
                      }
                    </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box >
      </Modal>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addTaskState?.message || updateTaskState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment >
  )
}

export default CustomerAdd;