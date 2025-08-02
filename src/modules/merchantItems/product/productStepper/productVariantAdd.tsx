/* eslint-disable */
import * as React from 'react';
import {
  Box, Button, Grid, IconButton, TextField, Typography,
  MenuItem, CircularProgress, Avatar,
  FormControl, InputLabel, Select,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'
import { updateProductById, clearState as clearProductState } from '../../../../reduxState/merchantItemSlice/product/productUpdateSlice';
import { fetchProductViewDetailById, clearState as clearViewState } from '../../../../reduxState/merchantItemSlice/product/productViewSlice';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { REGEX } from '../../../utils/constant';
import _ from 'lodash'

const Input = styled('input')({
  display: 'none',
});

const VariantStatus : any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
];

const BranchAdd: React.FC<any> = ({ onStepBack, onVariantComplete, setAddTimeEditProductId, statusCheck }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const productId = useSelector((state: RootState) => state.productAdd.productId)
  const updateProductId = useSelector((state: RootState) => state.productUpdate.productUpdateId)
  const updateTaskState = useSelector((state: RootState) => state.productUpdate);
  const readTaskState = useSelector((state: RootState) => state.productView);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [initialVariantAdded, setInitialVariantAdded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<any>('');

  React.useEffect(() => {
    if (updateTaskState && updateTaskState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [updateTaskState]);

  React.useEffect(() => {
    if (updateTaskState && updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearProductState());
      },2000)
    }
  }, [updateTaskState]);

  const validationSchema = yup.object().shape({
    price: yup.string().required(''),
    description: yup.string().required(''),
    variantName: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, register, reset, control, formState: { errors }, getValues } = useForm<any>({
    // resolver: yupResolver(validationSchema),
    defaultValues: {
      variantName: '',
      description: '',
      price: '',
      status: ''
    },
  });

  const { fields: members, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'members',
  });

  React.useEffect(() => {
    if (!_.isEmpty(productId) && !initialVariantAdded) {
      const data = {
        variantName: "",
        price: "",
        description: "",
        status: ""
      };
      handleAppendVariant(data);
      setInitialVariantAdded(true);
      setAddTimeEditProductId(productId)
    }
  }, [productId, initialVariantAdded]);

  const handleAppendVariant = (data?: any) => {
    const { variantName, price, description, status,id } = data;
    const { members } = getValues();
    const currentRowIsEmpty = members.some((member: any) => (
      !member?.variantName || !member?.price || !member?.status
    ));

    if (currentRowIsEmpty) {
      setIsErrorSnackbarOpen(true)
      setErrorMessage('Please fill in all fields of the added variant.');
      return;
    }
    appendVariant({
      variantName,
      price,
      description,
      status,
      id
    });
  };

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const { members } = event
    if (productId) {
      const payload: any = {
        variantId: members.map((variant: any) => ({
          variantName: variant?.variantName.trim(),
          price: variant?.price.trim(),
          description: variant?.description.trim(),
          status: variant?.status,
        })),
      };
      const params = {
        ...payload,
        id: productId,
        status: statusCheck ? 'ACTIVE' : "INACTIVE"
      }
      dispatch(updateProductById(params));
    } else if(updateProductId) {
      const payload: any = {
        variantId: members.map((variant: any) => ({
          variantName: variant?.variantName.trim(),
          price: variant?.price.trim(),
          description: variant?.description.trim(),
          status: variant?.status,
          id: variant?.id
        })),
      };
      const params = {
        ...payload,
        id: updateProductId,
        status: statusCheck ? 'ACTIVE' : "INACTIVE"
      }
      dispatch(updateProductById(params));
    }
}
  

  React.useEffect(() => {
    if (updateTaskState && updateTaskState?.code === 200) {
      onVariantComplete(1)
      dispatch(clearProductState())
      dispatch(clearViewState())
    }
  }, [updateTaskState])

  React.useEffect(() => {
    return () => {
    dispatch(clearViewState())
  }
  },[])

  React.useEffect(() => {
    if (updateProductId) {
      dispatch(fetchProductViewDetailById(updateProductId));
    }
  }, [updateProductId]);

  React.useEffect(() => {
    if (!_.isEmpty(updateProductId)) {
      const variants = readTaskState?.data?.variantDetails;
      if (variants && !_.isEmpty(variants)) {
        reset({ members: [] });
        variants.forEach((data: any) => {
          const stepForm = {
            variantName: data?.variantName,
            description: data?.description,
            price: data?.price,
            status: data?.status,
            id:data?.id
          };
  
          const existingVariantIndex = members.findIndex((member: any) => member?.id === data?.variant?.id);
          if (existingVariantIndex !== -1) {
            const updatedMember = {
              ...stepForm,
              id: members[existingVariantIndex].id
            };
            members[existingVariantIndex] = updatedMember;
          } else {
            handleAppendVariant(stepForm);
          }
        });
      }
    }
  }, [updateProductId]);

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  return (
    <React.Fragment>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          {members.map((field, index) => (
            <Grid container key={field.id} spacing={2} style={{ margin: "0", width: "100%" }}>
              <Grid item xs={6}>
                <Typography className='view-details-header' variant="h6" component="div">
                  Variant {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {index > 0 ? (<Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end', p: 1 }}>
                  <Button
                    variant="text"
                    startIcon={<ClearIcon style={{ color: '#FB640A' }} />}
                    onClick={() => removeVariant(index)}
                  />
                </Box>) : null
                }
              </Grid>
              <Grid item xs={12} sm={9}>
                <Grid container spacing={2} justifyContent='space-between'>
                  <Grid item xs={8.25} sm={6}>
                    <Controller
                      name={`members[${index}].variantName`}
                      control={control}
                      defaultValue=""
                      rules={{ required: 'variantName required' }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id={`variantName-${index}`}
                          label="VariantName"
                          name={`variantName-${index}`}
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={onChange}
                          error={!!error}
                          autoFocus
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
                              borderRadius: '8px'
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={8.25} sm={6}>
                    <Controller
                      name={`members[${index}].price`}
                      control={control}
                      defaultValue=""
                      rules={{ required: 'price required' }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id={`price-${index}`}
                          label="Price"
                          name={`price-${index}`}
                          required
                          className='required-asterisk-color'
                          value={value || ''}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const regex = REGEX.DECIMAL_NUMERIC;
                            if (regex.test(inputValue) || inputValue === '') {
                              onChange(inputValue);
                            }
                          }}
                          error={!!error}
                          InputProps={{
                            startAdornment: 'OMR',
                            autoComplete: 'off',
                            sx: {
                              borderRadius: '8px'
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={8.25} sm={6}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                      <Controller
                        name={`members[${index}].status`}
                        control={control}
                        defaultValue=""
                        rules={{ required: 'status required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Select
                            labelId={`status-label-${index}`}
                            id={`status-${index}`}
                            value={value || ''}
                            onChange={onChange}
                            label="Status"
                            sx={{ borderRadius: '8px' }}
                            required
                          >
                            <MenuItem value="">
                              <em>Select a status</em>
                            </MenuItem>
                            {VariantStatus.map((option: any) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={8.25} sm={6}>
                    <Controller
                      name={`members[${index}].description`}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={3}
                          id={`description-${index}`}
                          label="Description (Optional)"
                          name={`description-${index}`}
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
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} sm={12}>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end', p: 1 }}>
              <Button
                className='styledButtonCancel'
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  const data = {
                    variantName: "",
                    price: "",
                    description: "",
                    status: ""
                  };
                  handleAppendVariant(data);
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
              <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={() => { onStepBack(0) }}>Back</Button>
              <Button className='styledButtonSave' variant="contained" type="submit" disabled={updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                {
                  updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                    'Next'
                }
              </Button>
            </Box>
          </Grid>
        </form>
      </Box>
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={updateTaskState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={updateTaskState?.message || errorMessage}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment >
  )
}

export default BranchAdd;