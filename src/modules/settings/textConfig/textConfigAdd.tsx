/* eslint-disable */
import * as React from 'react';
import {
  Typography, Box, Button,
  Grid, TextField, Autocomplete, CircularProgress,
  Avatar,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as yup from 'yup';
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addLanguage, clearAddState } from '../../../reduxState/settingSlice/language/textConfigAddSlice';
import { updateLanguageById, clearUpdateState } from '../../../reduxState/settingSlice/language/textConfigUpdate';
import { fetchLanguageById, clearViewState } from '../../../reduxState/settingSlice/language/textConfigViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import { singleJsonFileUpload, clearState as clearFileUpload } from '../../../reduxState/fileupload/singleFilejsonUpload'
import { deleteJsonFile, clearState as clearDeleteFile } from '../../../reduxState/fileupload/deleteJsonFile'
import { singleMobileJsonFileUpload, clearState as clearMobileFileUpload } from '../../../reduxState/fileupload/singleMobileConfigFile'
import { deleteMobileJsonFile, clearState as clearMobileDeleteFile } from '../../../reduxState/fileupload/deleteMobileJsonFile'
import { singleDriverJsonFileUpload, clearState as clearDriverFileUpload } from '../../../reduxState/fileupload/singleDriverConfigFile'
import { deleteDriverJsonFile, clearState as clearDriverDeleteFile } from '../../../reduxState/fileupload/deleteDriverJsonFile'
import { RESTRICTED_JSON_FILE_TYPE } from '../../utils/constant';
import jsonPreview from '../../../assets/images/jsonImage.jpg'

interface ConfirmationModalProps {
  onBack: () => void;
  languageId: any;
}

const LanguageStatus: any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const LanguageAdd: React.FC<any> = ({ onBack, languageId }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.languageAdd);
  const updateTaskState = useSelector((state: RootState) => state.languageUpdate);
  const readTaskState = useSelector((state: RootState) => state.languageView);
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const jsonWebUploadState = useSelector((state: RootState) => state.singlejsonUpload.data)
  const jsonMobileUploadState = useSelector((state: RootState) => state.singleMobilejsonUpload.data)
  const jsonDriverUploadState = useSelector((state: RootState) => state.singleDriverjsonUpload.data)
  const [webimageValue, setWebImageValue] = React.useState(jsonWebUploadState)
  const [mobileimageValue, setMobileImageValue] = React.useState(jsonMobileUploadState)
  const [driverimageValue, setDriverImageValue] = React.useState(jsonDriverUploadState)
  const [fileSizeError,setFileSizeError] = React.useState<any>('')

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
    setWebImageValue(jsonWebUploadState)
  }, [jsonWebUploadState])

  React.useEffect(() => {
    setMobileImageValue(jsonMobileUploadState)
  }, [jsonMobileUploadState])

  React.useEffect(() => {
    setDriverImageValue(jsonDriverUploadState)
  }, [jsonDriverUploadState])

  const validationSchema = yup.object().shape({
    langauage: yup.string().required(''),
    langauage_code: yup.string().required(''),
    currency: yup.string().required(''),
    status: yup.object().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      langauage: '',
      langauage_code: '',
      currency: '',
      mobile_config: '',
      web_config: '',
      status: '',
      driver_config: ''
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      langauage: event.langauage.trim(),
      langauage_code: event.langauage_code.trim(),
      currency: event.currency.trim(),
      web_config:  webimageValue?.filePath,
      mobile_config: mobileimageValue?.filePath,
      driver_config: driverimageValue?.filePath,
      status: event.status.value
    }
    if (languageId) {
      payload.id = languageId;
      dispatch(updateLanguageById(payload));
    }
    else {
      dispatch(addLanguage(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset({
        langauage: '',
        langauage_code: '',
        currency: '',
        status: '',
        web_config: '',
        mobile_config: '',
        driver_config: '',
      });
      dispatch(clearViewState())
      dispatch(clearFileUpload())
      dispatch(clearMobileFileUpload())
      dispatch(clearDriverFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearMobileDeleteFile())
      dispatch(clearDriverDeleteFile())
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
      dispatch(clearFileUpload())
      dispatch(clearMobileFileUpload())
      dispatch(clearDriverFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearMobileDeleteFile())
      dispatch(clearDriverDeleteFile())
  }
  },[])

  React.useEffect(() => {
    if (languageId) {
      dispatch(fetchLanguageById(languageId));
    }
  }, [languageId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const Status = LanguageStatus.find((item: any) => item.value === readTaskState?.data?.status);
      reset({
        langauage: readTaskState?.data?.langauage,
        langauage_code: readTaskState?.data?.langauage_code,
        currency: readTaskState?.data?.currency,
        status: Status,
        web_config: readTaskState?.data?.web_config,
        mobile_config: readTaskState?.data?.mobile_config,
        driver_config: readTaskState?.data?.driver_config
      })
      setWebImageValue(readTaskState?.data?.web_config)
      setMobileImageValue(readTaskState?.data?.mobile_config)
      setDriverImageValue(readTaskState?.data?.driver_config)
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset({
      langauage: '',
      langauage_code: '',
      currency: '',
      status: '',
      web_config: '',
      mobile_config: '',
      driver_config: ''
    });
    dispatch(clearDeleteFile())
    dispatch(clearMobileDeleteFile())
    dispatch(clearDriverDeleteFile())
    dispatch(clearFileUpload())
    dispatch(clearMobileFileUpload())
    dispatch(clearDriverFileUpload())
    dispatch(clearViewState())
    onBack();
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  const handleWebJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5;
    const file: any = e.target.files?.[0];
  
    if (file) {
      const fileSize = file.size / (1024 * 1024);
      const fileType = file.type;
  
      if (_.includes(RESTRICTED_JSON_FILE_TYPE, fileType) && fileSize <= maxFileSize) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        dispatch(singleJsonFileUpload(formData));
      } else {
        setIsErrorSnackbarOpen(true);
        let errorMessage = '';
        if (fileSize > maxFileSize) {
          errorMessage = `File size must be below ${maxFileSize} MB! File size is: ${Math.round(fileSize)} MB`;
        } else {
          errorMessage = 'Uploaded file is not a valid json file. Only json files are allowed.';
        }
        setFileSizeError(errorMessage);
      }
    }
  };

  const handleWebJsonImageClick = () => {
    const inputElement = document.getElementById('document-Web-json-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleDelete = () => {
    if (jsonWebUploadState?.id) {
      dispatch(deleteJsonFile(jsonWebUploadState?.id))
      dispatch(clearFileUpload())
    }
  }

  const handleMobileJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5;
    const file: any = e.target.files?.[0];
  
    if (file) {
      const fileSize = file.size / (1024 * 1024);
      const fileType = file.type;
  
      if (_.includes(RESTRICTED_JSON_FILE_TYPE, fileType) && fileSize <= maxFileSize) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        dispatch(singleMobileJsonFileUpload(formData));
      } else {
        setIsErrorSnackbarOpen(true);
        let errorMessage = '';
        if (fileSize > maxFileSize) {
          errorMessage = `File size must be below ${maxFileSize} MB! File size is: ${Math.round(fileSize)} MB`;
        } else {
          errorMessage = 'Uploaded file is not a valid json file. Only json files are allowed.';
        }
        setFileSizeError(errorMessage);
      }
    }
  };

  const handleMobileJsonImageClick = () => {
    const inputElement = document.getElementById('document-Mobile-json-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleMobileDelete = () => {
    if (jsonMobileUploadState?.id) {
      dispatch(deleteMobileJsonFile(jsonMobileUploadState?.id))
      dispatch(clearMobileFileUpload())
    }
  }

  const handleDriverJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5;
    const file: any = e.target.files?.[0];
  
    if (file) {
      const fileSize = file.size / (1024 * 1024);
      const fileType = file.type;
  
      if (_.includes(RESTRICTED_JSON_FILE_TYPE, fileType) && fileSize <= maxFileSize) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        dispatch(singleDriverJsonFileUpload(formData));
      } else {
        setIsErrorSnackbarOpen(true);
        let errorMessage = '';
        if (fileSize > maxFileSize) {
          errorMessage = `File size must be below ${maxFileSize} MB! File size is: ${Math.round(fileSize)} MB`;
        } else {
          errorMessage = 'Uploaded file is not a valid json file. Only json files are allowed.';
        }
        setFileSizeError(errorMessage);
      }
    }
  };

  const handleDriverJsonImageClick = () => {
    const inputElement = document.getElementById('document-Driver-json-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleDriverDelete = () => {
    if (jsonDriverUploadState?.id) {
      dispatch(deleteDriverJsonFile(jsonDriverUploadState?.id))
      dispatch(clearDriverFileUpload())
    }
  }

  return (
    <React.Fragment>
      <Box className='general-box' mt={2}>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <Typography variant="h6" className='role-title inter-med' mb={2}>
            {editShow ? 'Edit Language Type' : 'Add Language Type' }
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Language
              </Typography>
              <Controller
                name="langauage"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="langauage"
                    label="Type here"
                    name="langauage"
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
                Language Code
              </Typography>
              <Controller
                name="langauage_code"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="langauage_code"
                    label="Type here"
                    name="langauage_code"
                    required
                    className='required-asterisk-color'
                    value={value || ''}
                    onChange={onChange}
                    error={!!error}
                    inputProps={{
                      onKeyPress: (event) => {
                        const regex = /^[a-zA-Z\s]+$/;
                        if (!regex.test(event.key) || value.length >= 5) {
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
                Currency
              </Typography>
              <Controller
                name="currency"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="currency"
                    label="Type here"
                    name="currency"
                    required
                    className='required-asterisk-color'
                    value={value || ''}
                    onChange={onChange}
                    error={!!error}
                    inputProps={{
                      onKeyPress: (event) => {
                        const regex = /^[a-zA-Z\s]+$/;
                        if (!regex.test(event.key) || value.length >= 5) {
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
                    options={LanguageStatus}
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
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Web Config
              </Typography>
              <Button className='document-upload-button' variant="outlined" size="large" startIcon={<FileUploadIcon />} onClick={handleWebJsonImageClick}>Upload</Button>
              <input
                accept="application/json"
                id="document-Web-json-upload"
                type="file"
                onChange={(e) => {
                  {
                    handleWebJsonFileChange(e)
                    e.target.value === null
                  }
                }}
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Mobile Config
              </Typography>
              <Button className='document-upload-button' variant="outlined" size="large" startIcon={<FileUploadIcon />} onClick={handleMobileJsonImageClick}>Upload</Button>
              <input
                accept="application/json"
                id="document-Mobile-json-upload"
                type="file"
                onChange={(e) => {
                  {
                    handleMobileJsonFileChange(e)
                    e.target.value === null
                  }
                }}
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!_.isEmpty(webimageValue) && !_.isNull(webimageValue.id) && (
                    <Box sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems:'center' }}>
                      <Avatar
                        key={webimageValue.id}
                        src={jsonPreview}
                        sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                      />
                      <Box className='preview-image-text'>
                        {webimageValue.displayName}
                      </Box>
                      <IconButton color="warning" onClick={handleDelete}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  )}
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!_.isEmpty(mobileimageValue) && !_.isNull(mobileimageValue.id) && (
                    <Box sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems:'center' }}>
                      <Avatar
                        key={mobileimageValue.id}
                        src={jsonPreview}
                        sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                      />
                      <Box className='preview-image-text'>
                        {mobileimageValue.displayName}
                      </Box>
                      <IconButton color="warning" onClick={handleMobileDelete}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  )}
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Driver Config
              </Typography>
              <Button className='document-upload-button' variant="outlined" size="large" startIcon={<FileUploadIcon />} onClick={handleDriverJsonImageClick}>Upload</Button>
              <input
                accept="application/json"
                id="document-Driver-json-upload"
                type="file"
                onChange={(e) => {
                  {
                    handleDriverJsonFileChange(e)
                    e.target.value === null
                  }
                }}
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!_.isEmpty(driverimageValue) && !_.isNull(driverimageValue.id) && (
                    <Box sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems:'center' }}>
                      <Avatar
                        key={driverimageValue.id}
                        src={jsonPreview}
                        sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                      />
                      <Box className='preview-image-text'>
                        {driverimageValue.displayName}
                      </Box>
                      <IconButton color="warning" onClick={handleDriverDelete}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography className='image-type-text'>(Note: upload json format file / Max 5 MB size file)</Typography>
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
          message={addTaskState?.message || updateTaskState?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment>
  )
}

export default LanguageAdd;