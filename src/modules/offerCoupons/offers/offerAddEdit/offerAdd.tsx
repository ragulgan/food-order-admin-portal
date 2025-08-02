/* eslint-disable */
import * as React from 'react'
import {
  Box, Button, Grid, TextField, Typography, CircularProgress, Autocomplete, Avatar, IconButton, Stack
} from '@mui/material';
import Switch from '@mui/material/Switch';
import ClearIcon from '@mui/icons-material/Clear'
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IMaskInput } from 'react-imask';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { fetchBranch } from '../../../../reduxState/branchSlice/branchListSlice';
import { addOffer, clearAddState } from '../../../../reduxState/offerCouponSlice/offerAddSlice';
import { updateOfferById, clearUpdateState } from '../../../../reduxState/offerCouponSlice/offerEditSlice';
import { clearViewState, fetchOfferById } from '../../../../reduxState/offerCouponSlice/offerViewSlice';
import { singleFileUpload, clearState as clearFileUpload } from '../../../../reduxState/fileupload/singleFileUpload'
import { deleteFile, clearState as clearDeleteFile } from '../../../../reduxState/fileupload/deleteFile'
import Food from '../../../../assets/images/Food.svg'
import FormControlLabel from '@mui/material/FormControlLabel';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert'
import _ from 'lodash'
import { RESTRICTED_FILE_FORMAT_TYPE } from '../../../utils/constant';

const Input = styled('input')({
  display: 'none',
})

const OfferAdding: React.FC<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const branchData = useSelector((state: RootState) => state.branchList);
  const addOfferData = useSelector((state: RootState) => state.offerAdd);
  const updateOfferData = useSelector((state: RootState) => state.offerUpdate);
  const viewOfferState = useSelector((state: RootState) => state.offerView);
  const merchantUploadState = useSelector((state: RootState) => state.singleUpload.data)
  const [selectedColor, setSelectedColor] = React.useState('');
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [imageValue, setImageValue] = React.useState(merchantUploadState)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [fileSizeError,setFileSizeError] = React.useState<any>('')

  React.useEffect(() => {
    if (addOfferData?.error === true || updateOfferData?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      },2000)
    }
  }, [addOfferData, updateOfferData]);

  React.useEffect(() => {
    dispatch(fetchBranch({ status: 'ACTIVE' }));
  }, []);

  React.useEffect(() => {
    setImageValue(merchantUploadState)
  }, [merchantUploadState])

  const validationSchema = yup.object().shape({
    offerDesc: yup.string().required(''),
    offerName: yup.string().required(''),
    offerPerc: yup.number().required('').typeError('Percentage must be a number').min(1, 'Percentage must be greater than or equal to 1').max(100, 'Percentage cannot exceed 100'),
    status: yup.boolean().required(''),
    branchName: yup.object().required(''),
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      branchName: '',
      offerColor: '',
      offerDesc: '',
      offerImage: '',
      offerName: '',
      offerPerc: '',
      status: true,
    }
  });
  const statusWatch = watch('status');

  const onSubmit = (event: any) => {
    const payload: any = {
      branchId: event.branchName.id,
      offerColor: selectedColor ? selectedColor.trim() : '#000000',
      offerDesc: event.offerDesc.trim(),
      offerImage: { id: imageValue?.id, displayName: imageValue?.displayName, filePath: imageValue?.filePath },
      offerName: event.offerName.trim(),
      offerPerc: event.offerPerc,
      status: event.status === true ? 'ACTIVE' : 'INACTIVE'
    }

    if (location.state) {
      payload.id = location.state;
      dispatch(updateOfferById(payload));
    }
    else {
      dispatch(addOffer(payload));
    }
  }

  React.useEffect(() => {
    if (addOfferData?.code === 200 || updateOfferData?.code === 200) {
      reset({
        branchName: '',
        offerColor: '',
        offerDesc: '',
        offerImage: '',
        offerName: '',
        offerPerc: '',
        status: true,
      });
      dispatch(clearFileUpload())
      dispatch(clearViewState())
      dispatch(clearDeleteFile())
      navigate("/OffersCoupons/offers")
    }
  }, [addOfferData, updateOfferData])

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
  }
  },[])

  React.useEffect(() => {
    if (location.state) {
      dispatch(fetchOfferById(location.state));
    }
  }, [location.state]);

  React.useEffect(() => {
    if (viewOfferState && viewOfferState?.code === 200 && viewOfferState && viewOfferState?.data && viewOfferState?.data?.id) {
      seteditShow(true)
      setSelectedColor(viewOfferState?.data?.offerColor)
      const Branch = viewOfferState?.data && !_.isEmpty(viewOfferState?.data?.branchDetails) ? viewOfferState?.data?.branchDetails : null;
      reset({
        branchName: Branch,
        offerDesc: viewOfferState?.data?.offerDesc,
        offerImage: viewOfferState?.data?.offerImage,
        offerName: viewOfferState?.data?.offerName,
        offerPerc: viewOfferState?.data?.offerPerc,
        status: viewOfferState?.data?.status === 'ACTIVE' ? true : false,
      });
      setImageValue(viewOfferState?.data?.offerImage)
    }
  }, [viewOfferState])

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

  const handleOnCloseModal = () => {
    reset({
      branchName: '',
      offerColor: '',
      offerDesc: '',
      offerImage: '',
      offerName: '',
      offerPerc: '',
      status: true,
    });
    dispatch(clearFileUpload())
    dispatch(clearDeleteFile())
    dispatch(clearViewState())
    navigate("/OffersCoupons/offers")
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px', width: "100%" }}>
        <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <Typography className='view-details-header' variant="h5" align='center' mb={2}>{editShow ? "Edit Offer" : "Add Offer"}</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="branchName"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'branch type required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        sx={{ marginTop: '16px', marginBottom: '8px' }}
                        disablePortal
                        id="branchName"
                        className='merchant-border-radius required-asterisk-auto-color'
                        style={{ borderRadius: '8px' }}
                        value={value || null}
                        options={branchData.data}
                        getOptionLabel={(option: any) => option.branchName || ''}
                        onChange={(_, data: any) => { onChange(data) }}
                        renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                          ...params.inputProps,
                          autoComplete: 'off',
                        }}
                        autoFocus
                        error={!!error} label="Branch Name" InputLabelProps={{ required: true }} />)}
                        clearOnBlur={value ? true : false}
                      />
                    )}
                  />
                  <Controller
                    name="offerPerc"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="offerPerc"
                        label="Offer Percentage"
                        name="offerPerc"
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
                  <Controller
                    name="offerDesc"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="offerDesc"
                        label="Description"
                        name="offerDesc"
                        required
                        className='required-asterisk-color'
                        value={value || ''}
                        onChange={onChange}
                        error={!!error}
                        rows={2}
                        multiline
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
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="offerName"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="offerName"
                        label="Offer Name"
                        name="offerName"
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
                    name="offerColor"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <div>
                        <TextField
                          margin="normal"
                          className='color-input required-asterisk-color'
                          fullWidth
                          id="offerColor"
                          label="Banner Color"
                          name="offerColor"
                          type='color'
                          required
                          value={selectedColor || ''}
                          onChange={(e) => {
                            setSelectedColor(e.target.value)
                          }}
                          error={!!error}
                          inputProps={{
                            onKeyPress: (event) => {
                              const regex = /^[a-zA-Z0-9#]+$/;
                              if (!regex.test(event.key) || value.length >= 7) {
                                event.preventDefault();
                              }
                            }
                          }}
                          InputProps={{
                            autoComplete: 'off',
                            sx: {
                              borderRadius: '8px',
                            },
                            startAdornment: (
                              <Box p={0.25}>
                                <Typography>{selectedColor}</Typography>
                              </Box>
                            ),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
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
                <Grid item xs={12} sm={6} md={4} textAlign={'center'}>
                  <Controller
                    name="offerImage"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <Typography className='list-header' sx={{ml: 1.5}} mt={2}>Offer Images</Typography>
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
                          <IconButton className='remhover' color="primary" component="div" sx={{ width: '100%', display: 'block' }}>
                            <Box>
                              {!editShow && !_.isEmpty(imageValue) ?
                                (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                    alt="preview"
                                    style={{ width: '72%', height: '30vh', overflow: 'hidden', borderRadius: '20px', objectFit: 'cover', background: '#FFFFFF' }}
                                  />
                                ) : editShow && !_.isEmpty(imageValue) && !_.isNull(imageValue.id) ? (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                    alt="preview"
                                    style={{ 
                                      width: '72%', height: '30vh', overflow: 'hidden', borderRadius: '20px', objectFit: 'cover', background: '#FFFFFF' }}
                                  />
                                ) :
                                  (
                                    <img
                                      src={Food}
                                      alt="upload"
                                      style={{
                                        width: '72%',
                                        height: '30vh',
                                        borderRadius: '20px',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  )}
                            </Box>
                          </IconButton>
                        </label>
                        <Typography className='image-type-text' sx={{ml: 1.5}}>(Note: upload png, jpg, jpeg format / Max 5 MB size file)</Typography>
                      </>
                    )}
                  />
                  {!_.isEmpty(imageValue) && !_.isNull(imageValue.filePath) && (
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
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addOfferData?.loading || updateOfferData?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        addOfferData?.loading || updateOfferData?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
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
          message={addOfferData?.message || updateOfferData?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment>
  )
}

export default OfferAdding