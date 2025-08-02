import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice'
import { fetchState } from '../../../reduxState/settingSlice/stateSlice/materStateSlice';
import { addCity, clearAddState } from '../../../reduxState/settingSlice/citySlice/cityAddSlice';
import { updateCityById, clearUpdateState } from '../../../reduxState/settingSlice/citySlice/cityUpdateSlice';
import { fetchCityById, clearViewState } from '../../../reduxState/settingSlice/citySlice/cityViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import _ from 'lodash'

interface ConfirmationModalProps {
  onBack: () => void;
  cityId: any;
}

const cityStatus: any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const CityAdd: React.FC<any> = ({ onBack, cityId }: ConfirmationModalProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.cityAdd);
  const updateTaskState = useSelector((state: RootState) => state.cityUpdate);
  const readTaskState = useSelector((state: RootState) => state.cityView);
  const countryData = useSelector((state: RootState) => state.countryDropdown)
  const stateData = useSelector((state: RootState) => state.stateList)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>('');

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      },2000)
    }
  }, [addTaskState, updateTaskState]);

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE', sort: 'asc' };
    dispatch(fetchCountry(params))
    dispatch(fetchState(params))
  }, [])

  React.useEffect(() => {
    if (selectedCountryId) {
      const params: any = { status: 'ACTIVE', countryId: selectedCountryId, sort: 'asc' };
      dispatch(fetchState(params))
    }
  }, [selectedCountryId])

  const validationSchema = yup.object().shape({
    countryId: yup.object().required(''),
    stateId: yup.object().required(''),
    cityName: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      countryId: '',
      stateId: '',
      cityName: '',
      status: '',
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      countryId: event.countryId.id,
      stateId: event.stateId.id,
      cityName: event.cityName.trim(),
      status: event.status.value
    }
    if (cityId) {
      payload.id = cityId;
      dispatch(updateCityById(payload));
    }
    else {
      dispatch(addCity(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset();
      dispatch(clearViewState())
      onBack();
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      }, 3000)
    }
  }, [addTaskState, updateTaskState])

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
  }
  },[])

  React.useEffect(() => {
    if (cityId) {
      dispatch(fetchCityById(cityId));
    }
  }, [cityId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const Status = cityStatus.find((item: any) => item.value === readTaskState?.data?.status);
      const countryEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.country) ? readTaskState?.data?.country : null;
      const stateEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.state) ? readTaskState?.data?.state : null;
      reset({
        countryId: countryEntries,
        stateId: stateEntries,
        cityName: readTaskState?.data?.cityName,
        status: Status,
      })
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset({
      countryId: '',
      stateId: '',
      cityName: '',
      status: '',
    });
    dispatch(clearViewState())
    onBack();
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  return (
    <React.Fragment>
      <Box className='general-box' mt={2}>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <Typography variant="h6" className='role-title inter-med' mb={2}>
            {editShow ? 'Edit City' : 'Add City'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Country Name
              </Typography>
              <Controller
                name="countryId"
                control={control}
                defaultValue=""
                rules={{ required: 'country is required' }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    sx={{ marginTop: '8px' }}
                    disablePortal
                    fullWidth
                    id="countryId"
                    className='merchant-border-radius required-asterisk-auto-color'
                    value={value || null}
                    options={countryData.data}
                    getOptionLabel={(option: any) => option.countryName || ''}
                    onChange={(_, data: any) => { 
                      onChange(data)
                      if (data !== null) {
                        setSelectedCountryId(data && data.id)
                      }
                     }}
                    renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }} 
                    autoFocus
                    error={!!error} label="Select Country" InputLabelProps={{ required: true }} />)}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                State Name
              </Typography>
              <Controller
                name="stateId"
                control={control}
                defaultValue=""
                rules={{ required: 'state is required' }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    sx={{ marginTop: '8px' }}
                    disablePortal
                    fullWidth
                    id="stateId"
                    className='merchant-border-radius required-asterisk-auto-color'
                    value={value || null}
                    options={stateData.data}
                    getOptionLabel={(option: any) => option.stateName || ''}
                    disabled={!selectedCountryId && !editShow ? true : false}
                    onChange={(_, data: any) => { onChange(data) }}
                    renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }} error={!!error} label="Select State" InputLabelProps={{ required: true }} />)}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                City Name
              </Typography>
              <Controller
                name="cityName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="cityName"
                    label="Type here"
                    name="cityName"
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
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Status
              </Typography>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                rules={{ required: 'status required' }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    sx={{ marginTop: '8px' }}
                    disablePortal
                    fullWidth
                    id="status"
                    className='merchant-border-radius required-asterisk-auto-color'
                    value={value || null}
                    options={cityStatus}
                    getOptionLabel={(option: any) => option.name || ''}
                    onChange={(_, data: any) => { onChange(data) }}
                    renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }} error={!!error} label="Status" InputLabelProps={{ required: true }} />)}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Discard</Button>
                <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                  {
                    addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                      !editShow ? 'Save' : 'Update'
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addTaskState?.message || updateTaskState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment>
  )
}

export default CityAdd;