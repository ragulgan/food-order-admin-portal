/* eslint-disable */
import * as React from 'react'
import {
  Box, Button, Grid, IconButton, TextField, Typography,
  CircularProgress, FormControlLabel, Switch, Autocomplete, Avatar, Stack, InputAdornment, Tooltip, Popover,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ClearIcon from '@mui/icons-material/Clear'
import { styled, useTheme } from '@mui/material/styles'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { IMaskInput } from 'react-imask'
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import merchant from '../../../assets/images/merchantEmpImage.svg'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { addMerchant, clearAddState, clearMerchantId } from '../../../reduxState/merchantSlice/merchantAddSlice'
import { updateMerchantById, clearUpdateState, clearUpdateMerchantId } from '../../../reduxState/merchantSlice/merchantUpdateSlice'
import { fetchMerchantById, clearViewState as merchantViewClearState } from '../../../reduxState/merchantSlice/merchantsViewSlice'
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice'
import { fetchState } from '../../../reduxState/merchantSlice/stateSlice'
import { fetchRegion } from '../../../reduxState/merchantSlice/regionSlice'
import { fetchRoles } from '../../../reduxState/settingSlice/roleSlice/roleSlice'
import { singleFileUpload, clearState as clearFileUpload } from '../../../reduxState/fileupload/singleFileUpload'
import { deleteFile, clearState as clearDeleteFile } from '../../../reduxState/fileupload/deleteFile'
import { RootState, AppDispatch } from '../../../reduxState/store'
import _ from 'lodash'
import { RESTRICTED_FILE_FORMAT_TYPE, Role_Types } from '../../utils/constant';

const Input = styled('input')({
  display: 'none',
})

const MerchantAdd: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const updateTaskState = useSelector((state: RootState) => state.merchantUpdate)
  const addTaskState = useSelector((state: RootState) => state.merchantAdd)
  const readTaskState = useSelector((state: RootState) => state.merchantView)
  const countryData = useSelector((state: RootState) => state.countryDropdown)
  const stateData = useSelector((state: RootState) => state.stateDropdown)
  const regionData = useSelector((state: RootState) => state.cityDropdown)
  const roleData = useSelector((state: RootState) => state.role)
  const merchantUploadState = useSelector((state: RootState) => state.singleUpload.data)
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>('')
  const [selectedStateId, setSelectedStateId] = React.useState<string>('')
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [imageValue, setImageValue] = React.useState(merchantUploadState)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [fileSizeError,setFileSizeError] = React.useState<any>('')
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [anchorElWeb, setAnchorElWeb] = React.useState<HTMLElement | null>(null);
  const [merchantEmailModal, setMerchantEmailModal] = React.useState<any>(false);
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE', sort: 'asc' };
    dispatch(fetchCountry(params))
    dispatch(fetchState(params))
    dispatch(fetchRegion(params))
  }, [])

  React.useEffect(() => {
    if (selectedCountryId) {
      const params: any = { status: 'ACTIVE', countryId: selectedCountryId, sort: 'asc' };
      dispatch(fetchState(params))
    }
  }, [selectedCountryId])

  React.useEffect(() => {
    if (selectedStateId) {
      const params: any = { status: 'ACTIVE', stateId: selectedStateId, sort: 'asc' };
      dispatch(fetchRegion(params))
    }
  }, [selectedStateId])

  React.useEffect(() => {
    setImageValue(merchantUploadState)
  }, [merchantUploadState])

  React.useEffect(() => {
    if(roles_data?.role === Role_Types.Admin){
      const params: any = {status: 'ACTIVE', type: Role_Types.Merchant }
      dispatch(fetchRoles(params))
    }
  }, [roles_data?.role === Role_Types.Admin])

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
        setIsErrorSnackbarOpen(true);
        setTimeout(()=>{
          dispatch(clearAddState());
          dispatch(clearUpdateState());
          dispatch(clearUpdateMerchantId());
          dispatch(clearMerchantId());
        },2000)
    }
  }, [addTaskState, updateTaskState]);

  const validationSchema = yup.object().shape({
    contactAddress: yup.string().required(''),
    contactEmail: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    contactName: yup.string().required(''),
    contactNo: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    restaurantDesc: yup.string().required(''),
    restaurantName: yup.string().required(''),
    password: yup.string().required('').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/, 'Passwords should be 8 to 15 characters long and contain alphanumeric characters'),
    website: yup.string().url('Please enter a valid URL').required(''),
    city: yup.object().required(''),
    country: yup.object().required(''),
    state: yup.object().required(''),
    status: yup.boolean().required(''),
    // image: yup.object().required(''),
  })

  const { handleSubmit, reset, control, formState: { errors }, watch, setValue } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      city: '',
      contactAddress: '',
      contactEmail: '',
      contactName: '',
      contactNo: '',
      country: '',
      image: '',
      restaurantDesc: '',
      restaurantName: '',
      state: '',
      status: true,
      website: '',
      roleId: '',
      password: '',
    }
  })
  const statusWatch = watch('status');
  const onSubmit: SubmitHandler<any> = (event: any) => {
    const merchantRole = readTaskState?.data && readTaskState?.data?.roleModuleDetails ? readTaskState?.data?.roleModuleDetails?.id : ''
    const mailEditCheck = readTaskState?.data && readTaskState?.data?.contactEmail ? readTaskState?.data?.contactEmail : ''
    const payload: any = {
      city: event.city.id,
      contactAddress: event.contactAddress.trim(),
      contactEmail: event.contactEmail.trim(),
      contactName: event.contactName.trim(),
      contactNo: event.contactNo,
      country: event.country.id,
      image: { id: imageValue?.id, displayName: imageValue?.displayName, filePath: imageValue?.filePath },
      restaurantDesc: event.restaurantDesc.trim(),
      restaurantName: event.restaurantName.trim(),
      state: event.state.id,
      status: event.status === true ? 'ACTIVE' : 'INACTIVE',
      website: event.website.trim(),
      roleId: roles_data?.role === Role_Types.Admin ? roleData?.data[0]?.id : merchantRole,
      password: event.password.trim(),
    }
    if (location.state) {
      payload.id = location.state
      if (payload?.contactEmail !== mailEditCheck && roles_data?.role === Role_Types.Merchant) {
        setMerchantEmailModal(true)
      } else {
        dispatch(updateMerchantById(payload))
      }
    }
    else {
      dispatch(addMerchant(payload))
    }
  }

  const variantModelClose = (event: any) => {
    const merchantRole = readTaskState?.data && readTaskState?.data?.roleModuleDetails ? readTaskState?.data?.roleModuleDetails?.id : ''
    const mailEditCheck = readTaskState?.data && readTaskState?.data?.contactEmail ? readTaskState?.data?.contactEmail : ''
    const payload: any = {
      city: event.city.id,
      contactAddress: event.contactAddress.trim(),
      contactEmail: event.contactEmail.trim(),
      contactName: event.contactName.trim(),
      contactNo: event.contactNo,
      country: event.country.id,
      image: { id: imageValue?.id, displayName: imageValue?.displayName, filePath: imageValue?.filePath },
      restaurantDesc: event.restaurantDesc.trim(),
      restaurantName: event.restaurantName.trim(),
      state: event.state.id,
      status: event.status === true ? 'ACTIVE' : 'INACTIVE',
      website: event.website.trim(),
      roleId: roles_data?.role === Role_Types.Admin ? roleData?.data[0]?.id : merchantRole,
      password: event.password.trim(),
    }
    if (location.state) {
      payload.id = location.state
      if (payload?.contactEmail !== mailEditCheck) {
        dispatch(updateMerchantById(payload))
        setMerchantEmailModal(false)
        if (roles_data?.role === Role_Types.Merchant) {
          setTimeout(() => {
            navigate(`/login/merchant`);
            localStorage.clear();
          }, 100);
        } else {
          return null;
        }
      }
    }
  }

  const CancelEmailUpdate = () => {
      const countryEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.country) ? readTaskState?.data?.country : null;
      const roleEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.roleModuleDetails) ? readTaskState?.data?.roleModuleDetails : null;
      const StateData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.state) ? readTaskState?.data?.state : null;
      const CityData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.city) ? readTaskState?.data?.city : null;

      reset({
        contactAddress: readTaskState?.data?.contactAddress,
        contactEmail: readTaskState?.data?.contactEmail,
        contactName: readTaskState?.data?.contactName,
        contactNo: readTaskState?.data?.contactNo,
        country: countryEntries,
        state: StateData,
        city: CityData,
        image: readTaskState?.data?.image,
        restaurantDesc: readTaskState?.data?.restaurantDesc,
        restaurantName: readTaskState?.data?.restaurantName,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        website: readTaskState?.data?.website,
        roleId: roleEntries,
        password: readTaskState?.data?.password,
      })
      setImageValue(readTaskState?.data?.image)
      setMerchantEmailModal(false)
  }

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset({
        city: '',
        contactAddress: '',
        contactEmail: '',
        contactName: '',
        contactNo: '',
        country: '',
        image: '',
        restaurantDesc: '',
        restaurantName: '',
        state: '',
        status: true,
        website: '',
        roleId: '',
        password: '',
      });
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(merchantViewClearState())
      navigate("/merchants/list")
    }
  }, [addTaskState, updateTaskState])

  React.useEffect(() => {
    return () => {
    dispatch(merchantViewClearState())
    dispatch(clearFileUpload())
    dispatch(clearDeleteFile())
  }
  },[])

  React.useEffect(() => {
    if (location.state) {
      dispatch(fetchMerchantById(location.state))
    }
  }, [location.state])

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState.data?.id) {
      seteditShow(true)
      const countryEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.country) ? readTaskState?.data?.country : null;
      const roleEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.roleModuleDetails) ? readTaskState?.data?.roleModuleDetails : null;
      const StateData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.state) ? readTaskState?.data?.state : null;
      const CityData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.city) ? readTaskState?.data?.city : null;

      reset({
        contactAddress: readTaskState?.data?.contactAddress,
        contactEmail: readTaskState?.data?.contactEmail,
        contactName: readTaskState?.data?.contactName,
        contactNo: readTaskState?.data?.contactNo,
        country: countryEntries,
        state: StateData,
        city: CityData,
        image: readTaskState?.data?.image,
        restaurantDesc: readTaskState?.data?.restaurantDesc,
        restaurantName: readTaskState?.data?.restaurantName,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        website: readTaskState?.data?.website,
        roleId: roleEntries,
        password: readTaskState?.data?.password,
      })
      setImageValue(readTaskState?.data?.image)
    }
  }, [readTaskState])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5;
    const file: any = e.target.files?.[0];
  
    if (file) {
      const fileSize = file.size / (1024 * 1024);
      const fileType = file.type;
  
      if (_.includes(RESTRICTED_FILE_FORMAT_TYPE, fileType) && fileSize <= maxFileSize) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        dispatch(singleFileUpload(formData));
      } else {
        setIsErrorSnackbarOpen(true);
        let errorMessage = '';
        if (fileSize > maxFileSize) {
          errorMessage = `File size must be below ${maxFileSize} MB! File size is: ${Math.round(fileSize)} MB`;
        } else {
          errorMessage = 'Uploaded file is not a valid image. Only JPG, PNG, and JPEG files are allowed.';
        }
        setFileSizeError(errorMessage);
      }
    }
  };

  const handleDelete = () => {
    if (merchantUploadState?.id) {
      dispatch(deleteFile(merchantUploadState?.id))
      dispatch(clearFileUpload())
    }
  }

  const handleOnClose = () => {
    reset({
      city: '',
      contactAddress: '',
      contactEmail: '',
      contactName: '',
      contactNo: '',
      country: '',
      image: '',
      restaurantDesc: '',
      restaurantName: '',
      state: '',
      status: true,
      website: '',
      roleId: '',
      password: '',
    });
    dispatch(clearDeleteFile())
    dispatch(clearFileUpload())
    dispatch(merchantViewClearState())
    navigate('/merchants/list')
  }

  const passwordHandler = (event: any) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

const handlePopoverOpenWeb = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElWeb(event.currentTarget);
};

const handlePopoverCloseWeb = () => {
  setAnchorElWeb(null);
};

const openWeb = Boolean(anchorElWeb);
const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px', width: "100%" }}>
        <Grid container spacing={2} style={{ margin: "0", width: "100%" }}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography className='view-details-header' variant="h5" align='left' mb={2}>{editShow ? "Edit Merchant" : "Add Merchant"}</Typography>
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
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={12} lg={9}>
                  <Grid container columns={8.25} spacing={2} justifyContent='space-between'>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="restaurantName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="restaurantName"
                            label="Restaurant Name"
                            name="restaurantName"
                            required
                            className='required-asterisk-color'
                            autoFocus
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9@#&^\-_$ /\s]+$/;
                                if (!regex.test(event.key) || value.length >= 30) {
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
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="contactName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="contactName"
                            label="Contact Name"
                            name="contactName"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z\s]+$/;
                                if (!regex.test(event.key) || value.length >= 30) {
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
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="contactEmail"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="contactEmail"
                            label="Merchant Email"
                            name="contactEmail"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 100) {
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
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="contactNo"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="contactNo"
                            label="Merchant phone number"
                            name="contactNo"
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
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="website"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="website"
                            label="Website"
                            name="website"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9_:./-]+$/;
                                if (!regex.test(event.key) || value.length >= 50) {
                                  event.preventDefault();
                                }
                              }
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>
                                <IconButton
                                  aria-label='info'
                                  aria-owns={openWeb ? 'mouse-over-popover' : undefined}
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverOpenWeb}
                                  onMouseLeave={handlePopoverCloseWeb}
                                >
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </InputAdornment>,
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: 'none',
                        '& .MuiPaper-root': {
                          width: '200px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 0, 0, 0.54)',
                          color: '#fff',
                        },
                      }}
                        open={openWeb}
                        anchorEl={anchorElWeb}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverCloseWeb}
                        disableRestoreFocus
                      >
                        <Typography sx={{ p: 1, fontSize: '12px' }}>Ex: http (or) https://example.com</Typography>
                      </Popover>
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Country is required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="country"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={countryData.data}
                            getOptionLabel={(option: any) => option.countryName || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedCountryId(data.id)
                              }
                            }}
                            filterOptions={(options, { inputValue }) =>
                              options.filter((option: any) =>
                                option.countryName.toLowerCase().includes(inputValue.toLowerCase())
                              )
                            }
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="Country" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="state"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'State is required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="state"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={stateData.data}
                            getOptionLabel={(option: any) => option.stateName || ''}
                            disabled={!selectedCountryId && !editShow ? true : false}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedStateId(data.id)
                              }
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="State" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="city"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'City is required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="city"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={regionData.data}
                            getOptionLabel={(option: any) => option.cityName || ''}
                            disabled={!selectedStateId && !editShow  ? true : false}
                            onChange={(_, data: any) => { onChange(data) }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="City" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      {roles_data.role === Role_Types.Admin && roleData && !roleData?.loading ?  
                      <Controller
                        name="roleId"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px' }}
                            disablePortal
                            disabled
                            id="roleId"
                            className='merchant-border-radius'
                            defaultValue={roleData.data[0]}
                            options={roleData.data}
                            getOptionLabel={(option: any) => option.role || ''}
                            onChange={(_, data: any) => { onChange(data) }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} label="Role" />)}
                          />
                        )}
                      /> :
                      roles_data.role !== Role_Types.Admin ?
                      <Controller
                      name="roleId"
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, onChange, value } }) => (
                        <Autocomplete
                          sx={{ marginTop: '16px' }}
                          disablePortal
                          id="roleId"
                          className='merchant-border-radius'
                          disabled
                          value={readTaskState?.data?.roleModuleDetails || null}
                          options={roleData.data}
                          getOptionLabel={(option: any) => option.role || ''}
                          onChange={(_, data: any) => { onChange(data) }}
                          renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                            ...params.inputProps,
                            autoComplete: 'off',
                          }} label="Role" />)}
                        />
                      )}
                    />: null}
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            required
                            className='required-asterisk-color'
                            type={showPassword ? 'text' : 'password'}
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 15) {
                                  event.preventDefault();
                                }
                              },
                              onPaste: (event) => {
                                event.preventDefault();
                              },
                              onDrop: (event) => {
                                event.preventDefault();
                              },
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>
                                <Tooltip title= {showPassword ? "Hide password" : "Show password"}>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={passwordHandler}
                                  edge='end'
                                >
                                  {showPassword ?  <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                </IconButton>
                                </Tooltip>
                                <IconButton
                                  aria-label='info'
                                  aria-owns={open ? 'mouse-over-popover' : undefined}
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverOpen}
                                  onMouseLeave={handlePopoverClose}
                                >
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </InputAdornment>,
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: 'none',
                        '& .MuiPaper-root': {
                          width: '200px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 0, 0, 0.54)',
                          color: '#fff'
                        },
                      }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                      >
                        <Typography sx={{ p: 1, fontSize: '12px' }}>Passwords should be 8 to 15 characters long and contain alphanumeric characters.</Typography>
                      </Popover>
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="restaurantDesc"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            multiline
                            rows={3}
                            id="restaurantDesc"
                            label="Restaurant Details"
                            name="restaurantDesc"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            helperText="max 250 characters"
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
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="contactAddress"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            multiline
                            rows={3}
                            id="contactAddress"
                            label="Contact Address"
                            name="contactAddress"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            helperText="max 250 characters"
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 250) {
                                  event.preventDefault();
                                }
                              }
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
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={6} md={5} lg={3} textAlign={'center'}>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <Typography className='list-header' sx={{ml: 1.5}} mt={2}>Merchant image</Typography>
                        <Input
                          type="file"
                          accept="image/*"
                          id="icon-button-file"
                          onChange={(e) => {
                            {
                              handleFileChange(e)
                              e.target.value === null
                            }
                          }}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton className='remhover' color="primary" component="div" sx={{ display: 'block' }}>
                            <Box>
                              {!editShow && !_.isEmpty(imageValue) ?
                                (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                    alt="preview"
                                    width='184px' height='180px' style={{ borderRadius: '50px', objectFit: 'cover',  background: '#FFFFFF', overflow: 'hidden' }} 
                                    loading='lazy'
                                  />
                                ) : editShow && !_.isEmpty(imageValue) && !_.isNull(imageValue.id) ? (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                    alt="preview"
                                    width='184px' height='180px' style={{ borderRadius: '50px', objectFit: 'cover',  background: '#FFFFFF', overflow: 'hidden' }} 
                                    loading='lazy'
                                  />
                                ) :
                                  (
                                    <img
                                      src={merchant}
                                      alt="upload"
                                      width='184px' height='180px' style={{ borderRadius: '50px', objectFit: 'cover',  background: '#FFFFFF', overflow: 'hidden' }} 
                                      loading='lazy'
                                    />
                                  )}
                            </Box>
                          </IconButton>
                        </label>
                        <Typography className='image-type-text' sx={{ml: 1.5}}>(Note: upload png, jpg, jpeg format / Max 5 MB size file)</Typography>
                      </>
                    )}
                  />
                  {!_.isEmpty(imageValue) && !_.isNull(imageValue.id) && (
                    <Box sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems:'center' }}>
                      <Avatar
                        key={imageValue.id}
                        src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                        sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                      />
                      <Box className='preview-image-text'>
                        {imageValue.displayName}
                      </Box>
                      <IconButton color="warning" onClick={handleDelete}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Dialog open={merchantEmailModal} onClose={() => setMerchantEmailModal(false)} className='signout-list'>
                      <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
                      <DialogContent>
                        Would you like to update your email and log in again?
                      </DialogContent>
                      <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                        <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={CancelEmailUpdate}>Cancel</Button>
                        <Button className='styledButtonSave' variant="contained" type='submit' disabled={ updateTaskState?.loading} onClick={handleSubmit(variantModelClose)}>
                          {
                           updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                           'Ok' 
                          }
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnClose}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
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
      </Box>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addTaskState?.fieldError || addTaskState?.message || updateTaskState?.fieldError || updateTaskState?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment >
  )
}

export default MerchantAdd;
