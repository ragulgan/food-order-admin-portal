import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice'
import { addState, clearAddState } from '../../../reduxState/settingSlice/stateSlice/stateAddSlice';
import { updateStateById, clearUpdateState } from '../../../reduxState/settingSlice/stateSlice/stateUpdateSlice';
import { fetchStateById, clearViewState } from '../../../reduxState/settingSlice/stateSlice/stateViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import _ from 'lodash'

interface ConfirmationModalProps {
  onBack: () => void;
  stateId: any;
}

const StateStatus : any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const StateAdd: React.FC<any> = ({ onBack, stateId }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.stateAdd);
  const updateTaskState = useSelector((state: RootState) => state.stateUpdate);
  const readTaskState = useSelector((state: RootState) => state.stateView);
  const countryData = useSelector((state: RootState) => state.countryDropdown)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);

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
    dispatch(fetchCountry({ status: 'ACTIVE', sort: 'asc' }))
  }, [])

  const validationSchema = yup.object().shape({
    countryId: yup.object().required(''),
    stateName: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      countryId: '',
      stateName: '',
      status: '',
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      countryId: event.countryId.id,
      stateName: event.stateName.trim(),
      status: event.status.value
    }
    if (stateId) {
      payload.id = stateId;
      dispatch(updateStateById(payload));
    }
    else {
      dispatch(addState(payload));
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
    if (stateId) {
      dispatch(fetchStateById(stateId));
    }
  }, [stateId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState.code === 200 && readTaskState && readTaskState.data && readTaskState.data?.id) {
      seteditShow(true)
      const Status = StateStatus.find((item: any) => item.value === readTaskState?.data?.status);
      const countryEntries = readTaskState?.data && !_.isEmpty(readTaskState?.data?.country) ? readTaskState?.data?.country : null;
      reset({
        countryId: countryEntries,
        stateName: readTaskState?.data?.stateName,
        status: Status,
      })
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset({
      countryId: '',
      stateName: '',
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
            {editShow ? 'Edit State' : 'Add State'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    onChange={(_, data: any) => { onChange(data) }}
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
            <Grid item sm={12} md={6} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                State Name
              </Typography>
              <Controller
                name="stateName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="stateName"
                    label="Type here"
                    name="stateName"
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
            <Grid item sm={12} md={6} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    options={StateStatus}
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

export default StateAdd;