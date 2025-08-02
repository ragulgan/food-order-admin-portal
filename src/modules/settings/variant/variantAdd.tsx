import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addVariant, clearAddState } from '../../../reduxState/settingSlice/variant/variantAdd';
import { updateVariantById, clearUpdateState } from '../../../reduxState/settingSlice/variant/variantUpdateSlice';
import { fetchVariantById, clearViewState } from '../../../reduxState/settingSlice/variant/variantViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'

interface ConfirmationModalProps {
  onBack: () => void;
  variantId: any;
}

const VariantStatus: any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const VariantAdd: React.FC<any> = ({ onBack, variantId }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.variantAdd);
  const updateTaskState = useSelector((state: RootState) => state.variantUpdate);
  const readTaskState = useSelector((state: RootState) => state.variantView);
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

  const validationSchema = yup.object().shape({
    variantName: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      variantName: '',
      status: '',
    },
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      variantName: event.variantName.trim(),
      status: event.status.value
    }
    if (variantId) {
      payload.id = variantId;
      dispatch(updateVariantById(payload));
    }
    else {
      dispatch(addVariant(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset({
        variantName: '',
        status: '',
      });
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
    if (variantId) {
      dispatch(fetchVariantById(variantId));
    }
  }, [variantId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState.code === 200 && readTaskState && readTaskState.data && readTaskState.data?.id) {
      seteditShow(true)
      const Status = VariantStatus.find((item: any) => item.value === readTaskState?.data?.status);
      reset({
        variantName: readTaskState?.data?.variantName,
        status: Status,
      })
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset({
      variantName: '',
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
            {editShow ? 'Edit Variant Type' : 'Add Variant Type'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Variant Name
              </Typography>
              <Controller
                name="variantName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="variantName"
                    label="Type here"
                    name="variantName"
                    required
                    autoFocus
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    inputProps={{
                      onKeyPress: (event) => {
                        const regex = /^[a-zA-Z0-9\s!@#$%^&*()\-_+=<>?,;:'"\\/\[\]{}|~`]+$/;
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
                    className='merchant-border-radius'
                    value={value || null}
                    options={VariantStatus}
                    getOptionLabel={(option: any) => option.name || ''}
                    onChange={(_, data: any) => { onChange(data) }}
                    renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }} error={!!error} label="Status" />)}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Discard</Button>
                <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={() => handleSubmit(onSubmit)}>
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

export default VariantAdd;