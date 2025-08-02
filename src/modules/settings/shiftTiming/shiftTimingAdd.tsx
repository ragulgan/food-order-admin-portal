import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addShift, clearAddState } from '../../../reduxState/settingSlice/shiftTime/shiftAddSlice';
import { updateShiftById, clearUpdateState } from '../../../reduxState/settingSlice/shiftTime/shiftUpdateSlice';
import { fetchShiftById, clearViewState } from '../../../reduxState/settingSlice/shiftTime/shiftViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { formatDisplayTimeOnly } from '../../utils/dateformat'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/en';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ConfirmationModalProps {
  onBack: () => void;
  shiftId: any;
}

const ShiftStatus: any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const ShiftTimingAdd: React.FC<any> = ({ onBack, shiftId }: ConfirmationModalProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.shiftAdd);
  const updateTaskState = useSelector((state: RootState) => state.shiftUpdate);
  const readTaskState = useSelector((state: RootState) => state.shiftView);
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const now = dayjs();
  const formattedTime = now.format('YYYY-MM-DDTHH:mm');
  const [shiftFromTime, setShiftFromTime] = React.useState<Dayjs | any >(dayjs(formattedTime));
  const [shiftToTime, setShiftToTime] = React.useState<Dayjs | any>(formattedTime);

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      },2000)
    }
  }, [addTaskState, updateTaskState]);

  const validationSchema = yup.object().shape({
    name: yup.string().required(''),
    status: yup.object().required(''),
    // fromTime: yup.string().required(''),
    // toTime: yup.string().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      status: '',
      fromTime: '',
      toTime: '',
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      name: event.name.trim(),
      status: event.status.value,
      fromTime: formatDisplayTimeOnly(shiftFromTime),
      toTime: formatDisplayTimeOnly(shiftToTime),
    }
    if (shiftId) {
      payload.id = shiftId;
      dispatch(updateShiftById(payload));
    }
    else {
      dispatch(addShift(payload));
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
    if (shiftId) {
      dispatch(fetchShiftById(shiftId));
    }
  }, [shiftId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState.code === 200 && readTaskState && readTaskState.data && readTaskState.data?.id) {
      seteditShow(true)
      const Status = ShiftStatus.find((item: any) => item.value === readTaskState?.data?.status);

      const dummyDate = dayjs('1970-01-01');
      const selectedFromTime = readTaskState && readTaskState.data && readTaskState.data.fromTime;
      const selectedToTime = readTaskState && readTaskState.data && readTaskState.data.toTime;

      const userTime = dayjs(dummyDate.format('YYYY-MM-DD') + ' ' + selectedFromTime).utcOffset(330);
      const fromTimedata = userTime.format('YYYY-MM-DDTHH:mm');

      const userToTime = dayjs(dummyDate.format('YYYY-MM-DD') + ' ' + selectedToTime).utcOffset(330);
      const toTimedata = userToTime.format('YYYY-MM-DDTHH:mm');

    setShiftFromTime(fromTimedata)
    setShiftToTime(toTimedata)

      reset({
        name: readTaskState?.data?.name,
        status: Status,
      })
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset();
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
            {editShow ? 'Edit Shift Time' : 'Add Shift Time'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Shift Name
              </Typography>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Type here"
                    name="name"
                    required
                    className='required-asterisk-color'
                    autoFocus
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
                    options={ShiftStatus}
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
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                From Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  'TimePicker'
                ]}
                sx={{ borderRadius: '8px' }}
              >
                <DemoItem>
                  <TimePicker label="Pick from time"
                     value={dayjs(shiftFromTime) || ''}
                    className='time-picker-style' 
                    onChange={(newValue) => setShiftFromTime(newValue)} sx={{ my: 1 }} />
                </DemoItem>
              </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                To Time
              </Typography>
              <DemoContainer
                components={[
                  'TimePicker'
                ]}
                sx={{ borderRadius: '8px' }}
              >
                <DemoItem>
                  <TimePicker label="Pick to time"
                    value={dayjs(shiftToTime) || ''} 
                    className='time-picker-style' 
                    onChange={(newValue) => setShiftToTime(newValue)} sx={{ my: 1 }}
                    minTime={dayjs(shiftFromTime)} />
                </DemoItem>
              </DemoContainer>
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

export default ShiftTimingAdd;