/* eslint-disable */
import * as React from 'react';
import {
  Box, Button, Grid, IconButton, TextField, Typography,
  CircularProgress, FormControlLabel, Switch, Autocomplete, Avatar, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { styled, useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import Food from '../../../../assets/images/Food.svg'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'
import { addProduct, clearState as clearAddState } from '../../../../reduxState/merchantItemSlice/product/productAddSlice';
import { updateProductById, clearState as clearProductState } from '../../../../reduxState/merchantItemSlice/product/productUpdateSlice';
import { fetchProductViewDetailById, clearState as clearViewState } from '../../../../reduxState/merchantItemSlice/product/productViewSlice';
import { fetchBranch } from '../../../../reduxState/branchSlice/branchListSlice';
import { fetchBranchById, clearViewState as clearViewBranchId } from '../../../../reduxState/branchSlice/branchViewSlice';
import { multipleFileUpload, clearState as clearFileUpload } from '../../../../reduxState/fileupload/multipleFileUpload';
import { deleteFile, clearState as clearDeleteFile } from '../../../../reduxState/fileupload/deleteFile';
import { fetchShift } from '../../../../reduxState/settingSlice/shiftTime/shiftListSlice';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import SwipeableTextMobileStepper from '../../../commonToast/imageCarousel';
import _ from 'lodash'
import { RESTRICTED_FILE_FORMAT_TYPE, REGEX } from '../../../utils/constant';
import { fetchProducts } from '../../../../reduxState/merchantItemSlice/product/productListSlice';

const Input = styled('input')({
  display: 'none',
});

const foodType = [
  { value: 'Veg', name: 'Veg' },
  { value: 'NonVeg', name: 'NonVeg' },
]

const ProductAdd: React.FC<any> = ({ onProductComplete, onClose, addTimeEditProductId, setStatusCheck }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const theme = useTheme();
  const updateTaskState = useSelector((state: RootState) => state.productUpdate)
  const addTaskState = useSelector((state: RootState) => state.productAdd);
  const readTaskState = useSelector((state: RootState) => state.productView);
  const branchData = useSelector((state: RootState) => state.branchList)
  const branchGetByIdData = useSelector((state: RootState) => state.branchView)
  const productUpload = useSelector((state: RootState) => state.multipleUpload.data);
  const productImg = productUpload ? productUpload : ([]);
  const shiftTypeData = useSelector((state: RootState) => state.shiftList)
  const [newImage, setNewImage] = React.useState(productUpload);
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [shiftTime, setShiftTime] = React.useState<any>([]);
  const [fileSizeError, setFileSizeError] = React.useState<any>('')
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('');
  const [variantModal, setVariantModal] = React.useState<any>(false);
  const [newState, setNewState] = React.useState<any>(false);
  const [filteredArray, setFilteredArray] = React.useState([]);

  React.useEffect(() => {
    if (addTaskState?.status === "succeeded" || updateTaskState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [addTaskState, updateTaskState]);

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearAddState());
        dispatch(clearProductState());
      },2000)
    }
  }, [addTaskState, updateTaskState]);

  React.useEffect(() => {
    if (editShow && productUpload) {
      const imageValue = productUpload.map((img: any) => {
        const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
        return newObj
      })
      if (imageValue?.length > 0 && newImage?.length > 0) {
        productUpload && productUpload.map((img: any) => {
          const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
          setNewImage((values: any) => ([
            ...values,
            newObj
          ]))
        })
      } else if (imageValue && imageValue?.length > 0) {
        setNewImage(imageValue)
      }
    } else if (productUpload && productUpload?.length > 0) {
      setNewImage(productUpload)
    }
  }, [productUpload, editShow]);

  React.useEffect(() => {
    if (!editShow) {
      const params: any = { status: 'ACTIVE' };
      dispatch(fetchBranch(params));
      dispatch(fetchShift(params))
    } else if (editShow) {
      const params: any = { status: 'ACTIVE' };
      dispatch(fetchBranch(params));
      dispatch(fetchShift(params))
    }
  }, [editShow]);

  React.useEffect(() => {
    if (selectedBranchId) {
      dispatch(fetchBranchById(selectedBranchId))
    }
  }, [selectedBranchId])

  const validationSchema = yup.object().shape({
    productName: yup.string().required(''),
    price: yup.string().required(''),
    description: yup.string().required(''),
    branchName: yup.object().required(''),
    categoryName: yup.object().required(''),
    categoryTypes: yup.object().required(''),
    isVeg: yup.object().required(''),
    status: yup.boolean().required(''),
    // images: yup.array().required(''),
  });

  const { handleSubmit, reset, control, formState: { errors }, setValue, watch } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      branchName: '',
      categoryName: '',
      description: '',
      images: [''],
      productName: '',
      price: '',
      status: true,
      categoryTypes: '',
      shiftTime: [{}],
      isVeg: '',
    },
  });
  const statusWatch = watch('status');

  const newbranchImg = newImage.map((img: any) => {
    const newObj = { id: img.id, filePath: img.filePath, displayName: img.displayName }
    return newObj;
  })

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const product: Array<any> = [];
    productImg.forEach((element: any) => {
      product.push(element.filePath)
    });

    const muptipleShift: Array<any> = [];
    shiftTime.forEach((shiftType: any) => {
      muptipleShift.push(shiftType.id)
    })
    event.images = product;
    setStatusCheck(event.status)
    const payload: any = {
      branchId: event.branchName.id,
      categoryId: event.categoryName.id,
      description: event.description.trim(),
      images: newbranchImg,
      productName: event.productName.trim(),
      price: event.price.trim(),
      status: event.status === true ? 'ACTIVE' : 'INACTIVE',
      categoryTypes: event.categoryTypes.id,
      shiftTime: muptipleShift,
      isVeg: event.isVeg.value,
    }
    if (!_.isEmpty(addTimeEditProductId) || location.state) {
      payload.id = addTimeEditProductId || location.state;
      dispatch(updateProductById(payload));
    }
    else {
      dispatch(addProduct(payload));
    }
  }

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      onProductComplete(1)
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearAddState())
      dispatch(clearProductState())
    }
  }, [addTaskState, updateTaskState])

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewBranchId())
    }
  }, [])

  React.useEffect(() => {
    if (location.state || !_.isEmpty(addTimeEditProductId)) {
      const id = addTimeEditProductId || location.state;
      dispatch(fetchProductViewDetailById(id));
    }
  }, [location.state]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const productImage = !_.isEmpty(readTaskState?.data?.images) || !_.isNull(readTaskState?.data?.images) ? readTaskState?.data?.images : null;
      const branchEntries =  readTaskState?.data && !_.isEmpty(readTaskState?.data?.branchDetails) ? readTaskState?.data?.branchDetails : null;
      const categoryEntries =  readTaskState?.data && !_.isEmpty(readTaskState?.data?.categoryTypeDetails) ?  readTaskState?.data?.categoryDetails : null;
      const cuisineEntries =  readTaskState?.data && !_.isEmpty(readTaskState?.data?.categoryTypeDetails) ? readTaskState?.data?.categoryTypeDetails : null;
      const VegType = foodType.find((item: any) => item.value === readTaskState?.data?.isVeg);
      const ShiftTime = readTaskState?.data && !_.isEmpty(readTaskState?.data?.shiftTime) ? readTaskState?.data?.shiftTime : [];
      const updateImage = productImage?.filter(function (item: any) {
        const value = Object.values(item)
        if (!_.isNull(value && value[0])) {
          return item
        } else {
          return null
        }
      })
      setNewImage(updateImage)
      setShiftTime(ShiftTime)
      reset({
        branchName: branchEntries,
        categoryName: categoryEntries,
        description: readTaskState?.data?.description,
        images: readTaskState?.data?.images,
        productName: readTaskState?.data?.productName,
        price: readTaskState?.data?.price,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        isVeg: VegType,
        categoryTypes: cuisineEntries,
      })
      dispatch(fetchBranchById(readTaskState && readTaskState?.data && readTaskState?.data?.branchDetails && readTaskState?.data?.branchDetails?.id))
    }
  }, [readTaskState])

  React.useEffect(() => {
    if (editShow) {
      const uniqueShiftTime: any = shiftTypeData?.data.filter((item1: any) =>
        !readTaskState?.data?.shiftTime.some((item2: any) => item2.id === item1.id)
      );
      setFilteredArray(uniqueShiftTime);
    }
  }, [editShow]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5;
    const files: FileList | null = e.target.files;

    if (files) {
      const uploadArray: File[] = Array.from(files);
      const fileSize = Number(maxFileSize) * 1024 * 1024;

      const invalidFiles: File[] = [];
      const validFiles: File[] = [];

      setFileSizeError('');
      setIsErrorSnackbarOpen(false);

      uploadArray.forEach((file) => {
        const fileType = file.type;
        const fileSizeInBytes = file.size;

        if (_.includes(RESTRICTED_FILE_FORMAT_TYPE, fileType) && fileSizeInBytes < fileSize) {
          validFiles.push(file);
        } else if (file.size >= fileSize) {
          invalidFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (invalidFiles.length === 0) {
        const formData: FormData = new FormData();
        validFiles.forEach((file) => {
          formData.append('file', file);
        });
        dispatch(multipleFileUpload(formData));
      } else {
        setIsErrorSnackbarOpen(true);
        const invalidFileMessages = invalidFiles.map((file) => {
          if (file.size >= fileSize) {
            return `File size must be below ${maxFileSize} MB! File size is: ${Math.round(file.size / 1024)} KB`;
          } else {
            return 'Uploaded file is not a valid image. Only JPG, PNG, and JPEG files are allowed.';
          }
        });
        const errorMessage = invalidFileMessages.join('\n');
        setFileSizeError(errorMessage);
      }
    }
  };

  const handleDelete = (image: any) => {
    const updatedImages = newImage.filter((img: any) => img.id !== image.id);
    setNewImage(updatedImages);
    dispatch(deleteFile(image.id));
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false)
    setIsErrorSnackbarOpen(false);
  };

  const variantModelClose = () => {
    setVariantModal(false)
    setNewState(true)
  }

  const productPageCloseAlert = () => {
    const getbyId = readTaskState && readTaskState?.data && readTaskState?.data?.variantDetails
    if(_.isEmpty(addTimeEditProductId) && !editShow){
      onClose()
      setNewState(false)
    }if(_.isEmpty(getbyId)) {
      setVariantModal(true)
    }else{
      onClose()
      dispatch(clearViewState())
      dispatch(fetchProducts({ status: 'ACTIVE' }));
    }
  }
  return (
    <React.Fragment>
      <Box>
        <Grid container spacing={2} style={{ margin: "0", width: "100%" }}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography className='view-details-header' variant="h5" align='left' mb={2}>{editShow && !addTimeEditProductId ? "Edit Product" : "Add Product"}</Typography>
                {!_.isEmpty(addTimeEditProductId) && readTaskState && readTaskState?.data && _.isEmpty(readTaskState?.data?.variantDetails) && !newState || editShow && readTaskState && readTaskState?.data && _.isEmpty(readTaskState?.data?.variantDetails)  ? null :   
                newState ? 
                <>
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
                </>:   
                <>
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
                </>}
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={12} lg={9}>
                  <Grid container columns={8.25} spacing={2} justifyContent='space-between'>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="branchName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Branch Name required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '24px' }}
                            disablePortal
                            id="branchName"
                            className='merchant-border-radius required-asterisk-auto-color'
                            style={{ borderRadius: '8px' }}
                            value={value || null}
                            options={branchData.data}
                            getOptionLabel={(option: any) => option.branchName || ''}
                            onChange={(_, data: any) => { onChange(data)
                              if(data !==null){
                                setSelectedBranchId(data && data?.id)
                              }
                             }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }}
                            autoFocus
                              error={!!error} label="Branch" InputLabelProps={{ required: true }} />)}
                              clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="categoryName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Category Name required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '24px', marginBottom: '8px' }}
                            disablePortal
                            id="categoryName"
                            className='merchant-border-radius required-asterisk-auto-color'
                            style={{ borderRadius: '8px' }}
                            disabled={!selectedBranchId && !editShow ? true : false}
                            value={value || null}
                            options={branchGetByIdData && branchGetByIdData?.data && branchGetByIdData?.data?.categoryDetails ? branchGetByIdData?.data?.categoryDetails : []}
                            getOptionLabel={(option: any) => option.categoryName || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }}
                              error={!!error} label="Category" InputLabelProps={{ required: true }} />)}
                              clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="productName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="productName"
                            label="Product Name"
                            name="productName"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9@#&^\-_$ /\s]+$/;
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
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="price"
                            label="Price"
                            name="price"
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
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="categoryTypes"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Cuisine Types is required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px' }}
                            disablePortal
                            id="categoryTypes"
                            className='merchant-border-radius required-asterisk-auto-color'
                            style={{ borderRadius: '8px' }}
                            disabled={!selectedBranchId && !editShow ? true : false}
                            value={value || null}
                            options={branchGetByIdData && branchGetByIdData?.data && branchGetByIdData?.data?.categoryTypeDetails ? branchGetByIdData?.data?.categoryTypeDetails : []}
                            getOptionLabel={(option: any) => option?.name || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }}
                              error={!!error} label="Cuisine types" InputLabelProps={{ required: true }} />)}
                              clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="isVeg"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'food type required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px' }}
                            disablePortal
                            id="isVeg"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={foodType}
                            getOptionLabel={(option: any) => option.name || ''}
                            onChange={(_, data: any) => { onChange(data) }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="Food Type" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
                      <Controller
                        name="shiftTime"
                        control={control}
                        render={({ field: { ref, onChange, value } }) => (
                          <Autocomplete
                            multiple
                            limitTags={1}
                            sx={{ marginTop: '16px' }}
                            id="shiftTime"
                            className='merchant-border-radius'
                            options={!editShow ? shiftTypeData.data : filteredArray}
                            getOptionLabel={(option: any) => option?.name}
                            value={shiftTime || null}
                            onChange={(_, data: any) => {
                              const isShiftAlreadySelected = shiftTime.some(
                                (existingShift: any) => existingShift.id === data.id
                              );
                              if (!isShiftAlreadySelected) {
                                setShiftTime(data);
                              }
                            }}
                            getOptionDisabled={(option) => (shiftTime?.length === 3 ? true : false)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Product Available Time (Optional)"
                              />
                            )}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4}>
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
                            label="Product Details"
                            name="description"
                            required
                            className='required-asterisk-color'
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
                <Grid item xs={12} sm={6} md={5} lg={3} textAlign={'center'}>
                  <Controller
                    name="images"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <Typography className='list-header' sx={{ ml: 1.5 }} mt={2}>Upload Images</Typography>
                        <Input
                          type="file"
                          accept="image/*"
                          // multiple
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
                              {newImage && _.isArray(newImage) && newImage?.length > 1 ? (
                                <Box py={2}>
                                  <SwipeableTextMobileStepper id={newImage} />
                                </Box>
                              ) : newImage && _.isArray(newImage) && newImage?.length === 1 ?
                                (newImage.map((step: any, index: any) => (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}${step.filePath}`}
                                    alt="preview"
                                    width='184px' height='180px' style={{ borderRadius: '16px', objectFit: 'cover',  background: '#FFFFFF', overflow: 'hidden' }}
                                    loading='lazy'
                                  />
                                ))) : (
                                  <img
                                    src={Food}
                                    alt="upload"
                                    style={{
                                      width: '100%',
                                      height: '30vh',
                                      borderRadius: '16px', objectFit: 'cover',  background: '#FFFFFF', overflow: 'hidden'
                                    }}
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Dialog open={variantModal} onClose={() => setVariantModal(false)} className='signout-list'>
                      <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
                      <DialogContent>
                        Please add at least one variant for each product;
                        Otherwise,the product will be moved to inactive status.
                      </DialogContent>
                      <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                        <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={onClose}>Back</Button>
                        <Button className='styledButtonSave' variant="contained" onClick={variantModelClose}>Continue</Button>
                      </DialogActions>
                    </Dialog>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={productPageCloseAlert}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                          'Next'
                      }
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
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
          message={addTaskState?.message || updateTaskState?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment >
  )
}

export default ProductAdd;