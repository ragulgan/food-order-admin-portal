import React, { Fragment, useState, useEffect, ChangeEvent } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, Grid, IconButton, Modal, TextField, Typography, CircularProgress, Avatar, Autocomplete, FormControlLabel, Stack, Switch,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import subCategory from '../../../../assets/images/Category.svg'
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { addSubCategory, clearAddState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryAddSlice';
import { fetchCategories } from '../../../../reduxState/merchantItemSlice/category/categoryListSlice';
import { multipleFileUpload, clearState as clearFileUpload } from '../../../../reduxState/fileupload/multipleFileUpload';
import { deleteFile, clearState as clearDeleteFile } from '../../../../reduxState/fileupload/deleteFile';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { fetchBranch } from '../../../../reduxState/branchSlice/branchListSlice';
import { updateSubCategoryById, clearUpdateState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryUpdateSlice';
import { fetchSubCategoryById, clearViewState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryViewSlice';
import SwipeableTextMobileStepper from '../../../commonToast/imageCarousel';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert'
import _ from 'lodash'

const Input = styled('input')({
  display: 'none',
});

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcategoryId: any;
  handleReset: () => void;
}

const SubCategoryAdd: React.FC<any> = ({ isOpen, onClose, subcategoryId, handleReset }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const subCategoryAddState = useSelector((state: RootState) => state.subCategoryAdd);
  const subCategoryUpdateState = useSelector((state: RootState) => state.subcategoryUpdate);
  const branchData = useSelector((state: RootState) => state.branchList)
  const categoryData = useSelector((state: RootState) => state.categoryList);
  const readTaskState = useSelector((state: RootState) => state.subcategoryView);
  const subCategoryUpload = useSelector((state: RootState) => state.multipleUpload.data);
  const subcategoryImg = subCategoryUpload ? subCategoryUpload : ([]);
  const [selectedBranch, setSelectedBranch] = React.useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('');
  const [formSubmitted, setFormSubmitted] = React.useState(false)
  const [newImage, setNewImage] = React.useState(subCategoryUpload);
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (editShow && subCategoryUpload) {
      const imageValue = subCategoryUpload.map((img: any) => {
        const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
        return newObj
      })
      if (imageValue?.length > 0 && newImage?.length > 0) {
        subCategoryUpload && subCategoryUpload.map((img: any) => {
          const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
          setNewImage((values: any) => ([
            ...values,
            newObj
          ]))
        })
      } else if (imageValue && imageValue?.length > 0) {
        setNewImage(imageValue)
      }
    } else if (subCategoryUpload && subCategoryUpload?.length > 0) {
      setNewImage(subCategoryUpload)
    }
  }, [subCategoryUpload, editShow]);

  React.useEffect(() => {
    dispatch(fetchBranch({ status: 'ACTIVE' }));
  }, []);

  React.useEffect(() => {
    dispatch(fetchCategories({ status: 'ACTIVE' }));
  }, []);

  React.useEffect(() => {
    if (subCategoryAddState.error === true || subCategoryUpdateState.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [subCategoryAddState, subCategoryUpdateState]);

  const validationSchema = yup.object().shape({
    subCategoryName: yup.string().required(''),
    description: yup.string().required(''),
    categoryName: yup.object().required(''),
    branchName: yup.object().required(''),
    images: yup.array().required(''),
    status: yup.boolean().required('')
  });

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categoryName: {},
      branchName: {},
      description: '',
      images: [],
      subCategoryName: '',
      status: true,
    },
  });
  const statusWatch = watch('status');

  const newcategoryImg = newImage.map((img: any) => {
    const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
    return newObj;
  })

  const onSubmit = (event: any) => {
    const subcategory: Array<any> = [];
    subcategoryImg.forEach((element: any) => {
      subcategory.push(element.filePath)
    });
    event.images = subcategory
    const payload: any = {
      branchId: event.branchName.id,
      categoryId: event.categoryName.id,
      description: event.description,
      subCategoryName: event.subCategoryName.trim(),
      images: newcategoryImg,
      status: event.status === true ? 'ACTIVE' : 'INACTIVE'
    }
    if (subcategoryId) {
      payload.id = subcategoryId;
      dispatch(updateSubCategoryById(payload));
    }
    else {
      dispatch(addSubCategory(payload));
    }
  };

  React.useEffect(() => {
    if (subCategoryAddState.code === 200) {
      reset();
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      onClose();
      handleReset();
    } else if (subCategoryUpdateState.code === 200) {
      reset({
        categoryName: '',
        branchName: '',
        description: '',
        images: [],
        subCategoryName: '',
        status: true,
      });
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewState())
      onClose();
      handleReset();
    }
  }, [subCategoryAddState, subCategoryUpdateState])

  useEffect(() => {
    if (subcategoryId) {
      dispatch(fetchSubCategoryById(subcategoryId));
    }
  }, [subcategoryId]);

  useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const branchEntries = branchData.data.find((item: any) => item.branchName === readTaskState?.data?.branchDetails?.branchName)
      const categoryEntries = categoryData.data.find((item: any) => item.categoryName === readTaskState?.data?.categoryDetails?.categoryName)
      const updateImage = readTaskState?.data?.images.filter(function (item: any) {
        const value = Object.values(item)
        if (!_.isNull(value && value[0])) {
          return item
        } else {
          return null
        }
      })
      setNewImage(updateImage)
      reset({
        branchName: branchEntries,
        categoryName: categoryEntries,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        description: readTaskState?.data?.description,
        images: readTaskState?.data?.images,
        subCategoryName: readTaskState?.data?.subCategoryName,
      })
    }
  }, [readTaskState])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files;
    const uploadArray: Array<any> = []
    for (var i = 0; i < files.length; i++) {
      uploadArray.push(files[i]);
    }
    const formData: any = new FormData();
    const length = uploadArray.length
    for (let i = 0; i < length; i++) {
      formData.append('file', uploadArray[i]);
    }
    dispatch(multipleFileUpload(formData));
  };

  const handleDelete = (image: any) => {
    const updatedImages = newImage.filter((img: any) => img.id !== image.id);
    setNewImage(updatedImages);
    dispatch(deleteFile(image.id));
  };

  const handleOnCloseModal = () => {
    reset({
      categoryName: '',
      branchName: '',
      description: '',
      images: [],
      subCategoryName: '',
      status: true,
    });
    dispatch(clearFileUpload())
    dispatch(clearDeleteFile())
    dispatch(clearViewState())
    onClose();
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearAddState());
    dispatch(clearUpdateState());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'scroll', width: '75%', height: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '18px' }}>
          <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
            <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>{subcategoryId ? "Edit SubCategory" : "Add SubCategory"}</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Controller
                          name="branchName"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Branch Name required' }}
                          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              sx={{ marginTop: '16px' }}
                              disablePortal
                              id="branchName"
                              style={{ borderRadius: '8px' }}
                              value={value || null}
                              options={branchData.data}
                              getOptionLabel={(option: any) => option.branchName || ''}
                              onChange={(_, data: any) => {
                                onChange(data)
                                if (data !== null) {
                                  setSelectedBranchId(data.id)
                                  setSelectedBranch(data)
                                }
                              }}
                              renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                              autoFocus
                              error={!!error} label="Branch" />)}
                              clearIcon={value ? <ClearIcon /> : null}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="categoryName"
                          control={control}
                          rules={{ required: 'category required' }}
                          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              sx={{ marginTop: '16px' }}
                              id="tags-standard"
                              options={categoryData.data}
                              getOptionLabel={(option: any) => option?.categoryName || ''}
                              value={value || null}
                              onChange={(_, data: any) => {
                                onChange(data)
                              }}
                              renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                                error={!!error} label="Category" />)}
                              clearIcon={value ? <ClearIcon /> : null}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="subCategoryName"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                              margin="normal"
                              fullWidth
                              id="subCategoryName"
                              label="SubCategory"
                              name="subCategoryName"
                              required
                              value={value}
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
                      </Grid>
                      <Grid item xs={6}>
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
                      <Grid item xs={12}>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                              margin="normal"
                              fullWidth
                              rows={2}
                              multiline
                              id="description"
                              label="Description"
                              name="description"
                              required
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
                                  borderRadius: '8px',
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} textAlign={'center'}>
                    <Controller
                      name="images"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Typography className='list-header' sx={{ ml: 1.5 }} mt={2}>Sub Category Images</Typography>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
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
                                {newImage && _.isArray(newImage) && newImage?.length > 0 ? (
                                  <Box py={2}>
                                    <SwipeableTextMobileStepper id={newImage} borderRadius={'50%'} width={'50%'} height={'25vh'} />
                                  </Box>
                                ) : (
                                  <img
                                    src={subCategory}
                                    alt="upload"
                                    style={{ borderRadius: '50%' }}
                                  />
                                )}
                              </Box>
                            </IconButton>
                          </label>
                          <Typography className='image-type-text' sx={{ ml: 1.5 }}>(Note: upload png, jpg, jpeg format / Max 5 MB size file)</Typography>
                        </>
                      )}
                    />
                    {newImage &&
                      _.isArray(newImage) && newImage.map((image: any) => (
                        !_.isEmpty(image.filePath) ? (
                          <Box key={image.id} sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems: 'center' }}>
                            <Avatar
                              src={`${process.env.REACT_APP_API_BASE_URL}${image.filePath}`}
                              sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                            />
                            <Box className='preview-image-text'>{image.displayName}</Box>
                            <IconButton color="warning" onClick={() => handleDelete(image)}>
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        ) : null
                      ))
                    }
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                      <Button className='styledButtonSave' variant="contained" type="submit" disabled={subCategoryUpdateState?.loading || subCategoryUpdateState?.loading} onClick={() => handleSubmit(onSubmit)}>
                      {
                        subCategoryAddState?.loading || subCategoryUpdateState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
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
      </Modal>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={subCategoryAddState?.message || subCategoryUpdateState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment >
  )
}

export default SubCategoryAdd;