/* eslint-disable */
import React, { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, Grid, IconButton, Modal, TextField, Typography, CircularProgress, Avatar, FormControlLabel, Stack, Switch,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Category from '../../../../assets/images/Category.svg'
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, clearAddState } from '../../../../reduxState/merchantItemSlice/category/categoryAdding';
import { singleFileUpload, clearState as clearFileUpload } from '../../../../reduxState/fileupload/singleFileUpload'
import { deleteFile, clearState as clearDeleteFile } from '../../../../reduxState/fileupload/deleteFile';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { updateCategoryById, clearUpdateState } from '../../../../reduxState/merchantItemSlice/category/categoryUpdateSlice';
import { fetchCategoryById, clearViewState } from '../../../../reduxState/merchantItemSlice/category/categoryViewSlice';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert'
import _ from 'lodash'
import { RESTRICTED_FILE_FORMAT_TYPE } from '../../../utils/constant';

const Input = styled('input')({
  display: 'none',
});

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: any;
  handleReset: () => void;
}

const CategoryAdd: React.FC<any> = ({ isOpen, onClose, categoryId, handleReset }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const categoryAddState = useSelector((state: RootState) => state.categoryAdding);
  const categoryUpdateState = useSelector((state: RootState) => state.categoryUpdate);
  const readTaskState = useSelector((state: RootState) => state.categoryView)
  const categoryUploadState = useSelector((state: RootState) => state.singleUpload.data)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [imageValue, setImageValue] = React.useState(categoryUploadState)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [fileSizeError,setFileSizeError] = React.useState<any>('')

  React.useEffect(() => {
    setImageValue(categoryUploadState)
  }, [categoryUploadState])

  React.useEffect(() => {
    if (categoryAddState?.error === true || categoryUpdateState?.error === true) {
        setIsErrorSnackbarOpen(true);
        setTimeout(()=>{
          dispatch(clearAddState());
          dispatch(clearUpdateState());
        },2000)
    }
  }, [categoryAddState, categoryUpdateState]);

  const validationSchema = yup.object().shape({
    categoryName: yup.string().required(''),
    status: yup.boolean().required(''),
    // images: yup.object().required(''),
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categoryName: '',
      images: '',
      status: true,
    },
  });

  const statusWatch = watch('status');

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      categoryName: event.categoryName.trim(),
      images: { id: imageValue?.id, displayName: imageValue?.displayName, filePath: imageValue?.filePath },
      status: event.status === true ? 'ACTIVE' : 'INACTIVE'
    }
    if (categoryId) {
      payload.id = categoryId;
      dispatch(updateCategoryById(payload));
    }
    else {
      dispatch(addCategory(payload));
    }
  };

  React.useEffect(() => {
    if (categoryAddState && categoryAddState?.code === 200) {
      reset();
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      onClose();
      handleReset();
    } else if(categoryUpdateState && categoryUpdateState?.code === 200) {
      reset({
        categoryName: '',
        images: '',
        status: true,
      });
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewState())
      onClose();
      handleReset();
    }
  }, [categoryAddState, categoryUpdateState])

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryById(categoryId));
    }
  }, [categoryId]);

  React.useEffect(() => {
    return () => {
    dispatch(clearViewState())
    dispatch(clearFileUpload())
    dispatch(clearDeleteFile())
  }
  },[])

  useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      reset({
        categoryName: readTaskState?.data?.categoryName,
        images: readTaskState?.data?.images,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
      })
      setImageValue(readTaskState?.data?.images)
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
    if (categoryUploadState?.id) {
      dispatch(deleteFile(categoryUploadState?.id))
      dispatch(clearFileUpload())
    }
  }

  const handleOnCloseModal = () => {
    reset({
      categoryName: '',
      images: '',
      status: true,
    });
    dispatch(clearFileUpload())
    dispatch(clearDeleteFile())
    dispatch(clearViewState())
    onClose();
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'scroll', width: 'auto', height: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '18px' }}>
          <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
            <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>{categoryId ? "Edit Category" : "Add Category"}</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  <Grid item sm={12} md={12} lg={6}>
                    <Controller
                      name="categoryName"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                          margin="normal"
                          fullWidth
                          id="categoryName"
                          label="Category Name"
                          name="categoryName"
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
                  <Grid item sm={12} md={12} lg={4} textAlign={'center'}>
                    <Controller
                      name="images"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Typography className='list-header' sx={{ml: 1.5}} mt={2}>Category images</Typography>
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
                                {!categoryId && !_.isEmpty(imageValue) ?
                                  (
                                    <img
                                      src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                      alt="preview"
                                      width='100px' height='100px' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy'
                                    />
                                  ) : categoryId && !_.isEmpty(imageValue) && !_.isNull(imageValue.id) ? (
                                    <img
                                      src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`}
                                      alt="preview"
                                      width='100px' height='100px' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy'
                                    />
                                  ) :
                                    (
                                      <img
                                        src={Category}
                                        alt="upload"
                                        width='100px' height='100px' style={{ borderRadius: '50%', objectFit: 'cover' }} loading='lazy' 
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
                  <Grid item sm={12} md={12} lg={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                      <Button className='styledButtonSave' variant="contained" type="submit" disabled={categoryAddState?.loading || categoryUpdateState?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        categoryAddState?.loading || categoryUpdateState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
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
      </Modal >
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={categoryAddState?.message || categoryUpdateState?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment >
  )
}

export default CategoryAdd;