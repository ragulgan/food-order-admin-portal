import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from '../../../reduxState/merchantItemSlice/product/productListSlice';
import { addConfigration, clearAddState } from '../../../reduxState/settingSlice/configration/configrationAddSlice';
import { updateConfigrationById, clearUpdateState } from '../../../reduxState/settingSlice/configration/configrationUpdateSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import { fetchConfigration, clearState as clearViewState } from '../../../reduxState/settingSlice/configration/configrationSlice';

const configStatus = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const ConfigAdd: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.configrationAdd);
  const updateTaskState = useSelector((state: RootState) => state.configrationUpdate);
  const readTaskState = useSelector((state: RootState) => state.configrationList);
  const productData = useSelector((state: RootState) => state.productList)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<any>([]);

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
    dispatch(fetchProducts({ status: 'ACTIVE' }))
  }, [])

  //configuration add alert and update alert
  React.useEffect(() => {
    if (addTaskState && addTaskState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (updateTaskState && updateTaskState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [addTaskState, updateTaskState]);

  const validationSchema = yup.object().shape({
    // products: yup.array().required(''),
    description: yup.string().required(''),
    title: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, control, reset, formState } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      products: [{}],
      description: '',
      title: '',
      status: {},
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const muptipleProduct: Array<any> = [];
    product.forEach((product: any) => {
      muptipleProduct.push(product.id)
    })
    const payload: any = {
      products: muptipleProduct,
      description: event.description.trim(),
      title: event.title.trim(),
      status: event.status.value
    }
    if (readTaskState?.data?.id) {
      dispatch(updateConfigrationById(payload));
    }
    else {
      dispatch(addConfigration(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset();
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      }, 3000)
    }
  }, [addTaskState, updateTaskState])

  React.useEffect(() => {
    dispatch(fetchConfigration(''));
  }, []);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const Status = configStatus.find((item: any) => item.value === readTaskState?.data?.status);
      setProduct(readTaskState?.data?.productDetails)
      reset({
        description: readTaskState?.data?.description,
        title: readTaskState?.data?.title,
        status: Status,
      })
    }
  }, [readTaskState])

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  }; 

  return (
    <React.Fragment>
      <Box className='general-box'>
        <Box sx={{ bgcolor: 'background.paper', position:'sticky', top: "21%", zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <Typography variant="h6" className='role-title inter-med' mb={2}>
            Add Configuration Details
          </Typography>
        </Box>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Title
              </Typography>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="title"
                    label="Type here"
                    name="title"
                    required
                    className='required-asterisk-color'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    inputProps={{
                      onKeyPress: (event) => {
                        const regex = /^[a-zA-Z\s]+$/;
                        if (!regex.test(event.key) || value.length >= 50) {
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
            <Grid item sm={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Product
              </Typography>
              <Controller
                name="products"
                control={control}
                rules={{ required: 'product is required' }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    limitTags={1}
                    fullWidth
                    sx={{ marginTop: '8px' }}
                    id="products"
                    className='merchant-border-radius required-asterisk-auto-color'
                    options={productData.data}
                    getOptionLabel={(option: any) => option?.productName}
                    value={product}
                    onChange={(_, data: any) => {
                      const isProductAlreadySelected = product.some(
                        (existingProduct: any) => existingProduct.id === data.id
                      );
                      if (!isProductAlreadySelected) {
                        setProduct(data);
                      }
                    }}
                    getOptionDisabled={(option) => (product?.length === 2 ? true : false)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!error}
                        label="Products"
                        InputLabelProps={{ required: true }}
                      />
                    )}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    options={configStatus}
                    getOptionLabel={(option: any) => option.name || ''}
                    onChange={(_, data: any) => { onChange(data) }}
                    renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }} error={!!error}  label="Status" InputLabelProps={{ required: true }} />)}
                    clearOnBlur={value ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Description
              </Typography>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={3}
                    id="description"
                    label="Type here"
                    name="description"
                    required
                    className='required-asterisk-color'
                    value={value}
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
            <Grid item sm={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button className={ !formState.isDirty ? 'styledButtonSave-inactive' : 'styledButtonSave'} variant="contained" type="submit" disabled={!formState.isDirty || addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                  {
                    addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                    !editShow  ? 'Save': 'Update'
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={addTaskState?.message || updateTaskState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
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

export default ConfigAdd;