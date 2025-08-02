/* eslint-disable */
import React, { useState } from 'react'
import { Autocomplete, Box, CircularProgress, FormControlLabel, Grid, Stack, Switch, TextField, Typography, Button, IconButton, Avatar, FormGroup, Checkbox, InputAdornment, Tooltip, Popover } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import { fetchMerchants } from '../../reduxState/merchantSlice/merchantListSlice';
import { IMaskInput } from 'react-imask';
import { fetchCountry } from '../../reduxState/settingSlice/countrySlice/countrySlice';
import { fetchState } from '../../reduxState/merchantSlice/stateSlice';
import { fetchRegion } from '../../reduxState/merchantSlice/regionSlice';
import { fetchCuisine } from '../../reduxState/settingSlice/categoryType/cuisineSlice';
import { fetchCategories } from '../../reduxState/merchantItemSlice/category/categoryListSlice'
import { multipleFileUpload, clearState as clearFileUpload } from '../../reduxState/fileupload/multipleFileUpload';
import { deleteFile, clearState as clearDeleteFile } from '../../reduxState/fileupload/deleteFile';
import _ from 'lodash';
import SwipeableTextMobileStepper from '../commonToast/imageCarousel';
import branchDummy from '../../assets/images/Branch.svg'
import ClearIcon from '@mui/icons-material/Clear';
import { addBranch, clearAddState } from '../../reduxState/branchSlice/branchAddSlice';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearViewState, fetchBranchById } from '../../reduxState/branchSlice/branchViewSlice';
import { clearUpdateState, updateBranchById } from '../../reduxState/branchSlice/branchUpdateSlice';
import AppSnackbar, { IAppSnackbar } from '../commonToast/customizeAlert'
import { fetchRoles } from '../../reduxState/settingSlice/roleSlice/roleSlice'
import { RESTRICTED_FILE_FORMAT_TYPE, Role_Types, REGEX, staticLocation } from '../utils/constant';
import { Map } from '../../UIComponents';

const Input = styled('input')({
  display: 'none',
});

const branchTypes: any = [
  { value: 'MainBranch', name: 'MainBranch' },
  { value: 'SubBranch', name: 'SubBranch' },
];

const initialCheckBoxList = [
  { value: "0", name: 'Monday' },
  { value: "0", name: 'Tuesday' },
  { value: "0", name: 'Wednesday' },
  { value: "0", name: 'Thursday' },
  { value: "0", name: 'Friday' },
  { value: "0", name: 'Saturday' },
  { value: "0", name: 'Sunday' },
];

const foodType: any = [
  { value: 'Veg', name: 'Veg' },
  { value: 'NonVeg', name: 'NonVeg' },
  { value: 'Both', name: 'veg & Non-veg' },
]
interface IMarkers {
  lat: number,
  lng: number
}

const BranchAdd: React.FC<any> = () => {
  const merchantData = useSelector((state: RootState) => state.merchants);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation();
  const [selectedStateId, setSelectedStateId] = React.useState<string>('');
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>('');
  const readTaskState = useSelector((state: RootState) => state.branchView);
  const countryData = useSelector((state: RootState) => state.countryDropdown);
  const stateData = useSelector((state: RootState) => state.stateDropdown);
  const regionData = useSelector((state: RootState) => state.cityDropdown);
  const categoryTypeData = useSelector((state: RootState) => state.cuisineList)
  const categoryListData = useSelector((state: RootState) => state.categoryList)
  const branchUpload = useSelector((state: RootState) => state.multipleUpload.data);
  const branchAdd = useSelector((state: RootState) => state.branchAdding);
  const branchUpdate = useSelector((state: RootState) => state.branchUpdate);
  const roleData = useSelector((state: RootState) => state.role)
  const branchImg = branchUpload ? branchUpload : ([]);
  const [newImage, setNewImage] = React.useState(branchUpload)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [editValue, setEditValue] = React.useState<any>([]);
  const [checkBoxList, setCheckBoxList] = React.useState<any>(initialCheckBoxList);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const [category, setCategory] = React.useState<any>([]);
  const [cuisine, setCuisine] = React.useState<any>([]);
  const [fileSizeError, setFileSizeError] = React.useState<any>('')
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [markers, setMarkers] = React.useState<IMarkers>({lat: staticLocation.lat, lng: staticLocation.lng});
  const [drag, setDrag] = React.useState<any>('')
  const [filteredArray, setFilteredArray] = React.useState<any>([]);
  const [filteredCategory, setFilteredCategory] = React.useState<any>([]);

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE' };
    dispatch(fetchMerchants(params));
    dispatch(fetchCuisine(params))
    dispatch(fetchCategories(params));
  }, []);

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE', sort: 'asc' };
    dispatch(fetchCountry(params));
    dispatch(fetchState(params))
    dispatch(fetchRegion(params))
  }, []);

  React.useEffect(() => {
    if (selectedCountryId) {
      const params: any = { status: 'ACTIVE', countryId: selectedCountryId, sort: 'asc' };
      dispatch(fetchState(params))
    }
  }, [selectedCountryId])

  React.useEffect(() => {
    if (selectedStateId) {
      const params: any = { status: 'ACTIVE', stateId: selectedStateId, sort: 'asc' };
      dispatch(fetchRegion(params))
    }
  }, [selectedStateId])

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant) {
      const params: any = { status: 'ACTIVE', type: Role_Types.Branch }
      dispatch(fetchRoles(params))
    }
  }, [roles_data?.role === Role_Types.Admin, roles_data?.role === Role_Types.Merchant])

  React.useEffect(() => {
    if (editShow && branchUpload) {
      const imageValue = branchUpload?.map((img: any) => {
        const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
        return newObj
      })
      if (imageValue?.length > 0 && newImage?.length > 0) {
        branchUpload && branchUpload?.map((img: any) => {
          const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
          setNewImage((values: any) => ([
            ...values,
            newObj
          ]))
        })
      } else if (imageValue && imageValue?.length > 0) {
        setNewImage(imageValue)
      }
    } else if (branchUpload && branchUpload?.length > 0) {
      setNewImage(branchUpload)
    }
  }, [branchUpload, editShow]);

  const validationSchema = yup.object().shape({
    branchName: yup.string().required(''),
    gst: yup.number().required('').typeError('').min(1, '').max(100, ''),
    contactNo: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    contactEmail: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    branchAddress: yup.string().required(''),
    branchMinAmount: yup.string().required(''),
    merchantName: yup.object().required(''),
    branchType: yup.object().required(''),
    isVeg: yup.object().required(''),
    branchLocation: yup.string().required(''),
    branchManager: yup.string().required(''),
    password: yup.string().required('').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/, 'Passwords should be 8 to 15 characters long and contain alphanumeric characters'),
    // categoryTypes: yup.array().required(''),
    // categories: yup.array().required(''),
    // branchisOpen: yup.object().required(''),
    // status: yup.boolean().required(''),
    // images: yup.array().required(''),
  });

  const merchantValidationSchema = yup.object().shape({
    branchName: yup.string().required(''),
    gst: yup.number().required('').typeError('').min(1, '').max(100, ''),
    contactNo: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    contactEmail: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    branchLocation: yup.string().required(''),
    branchAddress: yup.string().required(''),
    branchMinAmount: yup.string().required(''),
    branchType: yup.object().required(''),
    isVeg: yup.object().required(''),
    branchManager: yup.string().required(''),
    password: yup.string().required('').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/, 'Passwords should be 8 to 15 characters long and contain alphanumeric characters'),
  });

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    resolver: roles_data.role === Role_Types.Admin ? yupResolver(validationSchema) : yupResolver(merchantValidationSchema),
    defaultValues: {
      merchantName: '',
      branchName: '',
      branchLocation: '',
      branchType: '',
      gst: '',
      contactNo: '',
      contactEmail: '',
      branchMinAmount: '',
      country: '',
      state: '',
      city: '',
      categoryTypes: [{}],
      categories: [{}],
      contactName: '',
      branchAddress: '',
      branchisOpen: initialCheckBoxList.map((item: any, index: any) => editValue[index] === "1" ? true : false),
      status: true,
      isVeg: '',
      images: [''],
      branchManager: '',
      password: '',
      roleId: '',
      branchTelephoneNumber: '',
      description: ''
    },
  });

  const statusWatch = watch('status');

  const newbranchImg = newImage?.map((img: any) => {
    const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
    return newObj;
  })

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const branch: Array<any> = [];
    branchImg.forEach((element: any) => {
      branch.push(element.filePath)
    });
    event.images = branch;

    const muptipleCuisine: Array<any> = [];
    cuisine.forEach((categoryType: any) => {
      muptipleCuisine.push(categoryType.id)
    })

    const muptipleCategory: Array<any> = [];
    category.forEach((category: any) => {
      muptipleCategory.push(category.id)
    })
    const branchRole = readTaskState?.data && readTaskState?.data?.roleModuleDetails ? readTaskState?.data?.roleModuleDetails?.id : ''
    const payload: any = {
      branchAddress: event.branchAddress.trim(),
      branchIsOpen: event.branchisOpen.map((isChecked: boolean) => (isChecked ? '1' : '0')),
      branchLocation: event.branchLocation.trim(),
      branchMinAmount: event.branchMinAmount.trim(),
      branchName: event.branchName.trim(),
      branchType: event.branchType.value,
      categoryTypes: muptipleCuisine,
      categories: muptipleCategory,
      cityId: "65e9663cc829217d806f5b90",
      contactEmail: event.contactEmail.trim(),
      contactName: event.branchManager.trim(),
      contactNo: event.contactNo,
      branchTelephoneNumber: event.branchTelephoneNumber,
      countryId: "649f3971283a4005e7c7f4af",
      gst: event.gst,
      images: newbranchImg,
      isVeg: event.isVeg.value,
      merchantId: roles_data?.role !== Role_Types.Admin ? merchantData?.data[0].id : event.merchantName?.id,
      stateId: "65e965c3c829217d806f5b8b",
      status: event.status === true ? 'ACTIVE' : 'INACTIVE',
      lat: markers.lat,
      longt: markers.lng,
      roleId: roles_data?.role === Role_Types.Merchant || roles_data?.role === Role_Types.Admin ? roleData?.data[0]?.id : branchRole,
      password: event.password.trim(),
      branchManager: event.branchManager.trim(),
      description: event.description.trim()
    }
    if (location.state) {
      payload.id = location.state;
      dispatch(updateBranchById(payload));
    }
    else {
      dispatch(addBranch(payload));
    }
  }
  React.useEffect(() => {
    if (branchAdd?.error === true || branchUpdate?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      }, 2000)
    }
  }, [branchAdd, branchUpdate]);

  React.useEffect(() => {
    if (branchAdd?.code === 200 || branchUpdate?.code === 200) {
      reset();
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewState())
      navigate("/branch/list")
    }
  }, [branchAdd, branchUpdate])

  React.useEffect(() => {
    return () => {
      dispatch(clearFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewState())
    }
  }, [])

  const passwordHandler = (event: any) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }

  React.useEffect(() => {
    if (location.state) {
      dispatch(fetchBranchById(location.state));
    }
  }, [location.state]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState.data?.id) {
      seteditShow(true)
      const branchImage = !_.isEmpty(readTaskState?.data?.image) || !_.isNull(readTaskState?.data?.image) ? readTaskState?.data?.image : null;
      const Merchant = merchantData?.data.find((item: any) => item.restaurantName === readTaskState?.data?.merchantDetails?.merchantName);
      const BranchType = branchTypes.find((item: any) => item.value === readTaskState?.data?.branchType);
      const VegType = foodType.find((item: any) => item.value === readTaskState?.data?.isVeg);
      const CountryData = countryData?.data.find((item: any) => item.countryName === readTaskState?.data?.country?.countryName);
      const StateData = stateData.data.find((item: any) => item.stateName === readTaskState?.data?.state?.stateName);
      const CityData = regionData.data.find((item: any) => item.cityName === readTaskState?.data?.city?.cityName);
      const updateImage = branchImage?.filter((item: any) => {
        const value = Object.values(item)
        if (!_.isNull(value && value[0])) {
          return item
        } else {
          return null
        }
      })
      const roleEntries = roleData.data.find((item: any) => item.role === readTaskState?.data?.roleModuleDetails?.role)
      const setMenus = readTaskState && readTaskState.data && readTaskState?.data?.branchIsOpen;
      const editValuesConverted = setMenus.map((value: string) => value === '1');
      setNewImage(updateImage)
      setCategory(readTaskState?.data?.categoryDetails)
      setCuisine(readTaskState?.data?.categoryTypeDetails)
      setEditValue(editValuesConverted);
      const newMarker = {
        lat: readTaskState?.data?.lat,
        lng: readTaskState?.data?.longt,
      };
      setMarkers(newMarker);
      reset({
        merchantName: Merchant,
        branchName: readTaskState?.data?.branchName,
        branchLocation: readTaskState?.data?.branchLocation,
        branchType: BranchType,
        gst: readTaskState?.data?.gst,
        contactNo: readTaskState?.data?.contactNo,
        branchTelephoneNumber: readTaskState?.data?.branchTelephoneNumber,
        contactEmail: readTaskState?.data?.contactEmail,
        branchMinAmount: readTaskState?.data?.branchMinAmount,
        country: CountryData,
        state: StateData,
        city: CityData,
        branchAddress: readTaskState?.data?.branchAddress,
        branchisOpen: editValuesConverted,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        isVeg: VegType,
        images: readTaskState?.data?.image,
        roleId: roleEntries,
        password: readTaskState?.data?.password,
        branchManager: readTaskState?.data?.branchManager,
        description: readTaskState?.data?.description,
      })
    }
  }, [readTaskState])

  React.useEffect(() => {
    if (editShow) {
      const uniqueCuisine: any = categoryTypeData.data.filter((item1: any) =>
        !readTaskState?.data?.categoryTypeDetails.some((item2: any) => item2.id === item1.id)
      );
      const uniqueCategory: any = categoryListData.data.filter((item1: any) =>
        !readTaskState?.data?.categoryDetails.some((item2: any) => item2.id === item1.id)
      );
      setFilteredArray(uniqueCuisine);
      setFilteredCategory(uniqueCategory);
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

  const handleCancel = () => {
    reset();
    dispatch(clearDeleteFile())
    dispatch(clearFileUpload())
    dispatch(clearViewState())
    navigate("/branch/list")
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

const getPayload = (arr: object[]): Record<string, string> => {
  const value: Record<string, string> = {};
  arr.forEach((item: any) => {
    if (item.types && item.types.length > 0) {
      const type: string = item.types[0];
      const longName: string = item.long_name;

      value[type] = longName;
    }
  });
  return value;
};

const handleMapClick = (event: any) => {
  const newMarker = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
  setMarkers(newMarker);
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: newMarker }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const branchgetbyIdLocation = readTaskState?.data && readTaskState?.data?.branchLocation ? readTaskState?.data?.branchLocation : ''
      const address = results[0].formatted_address;
      const getAddress = getPayload(results[0]?.address_components)
      reset((prev: any) => ({
        ...prev,
        branchAddress: address,
        branchLocation: !_.isEmpty(getAddress?.political) ? getAddress?.political : branchgetbyIdLocation
      }));
    } else {
      console.error(
        "Geocode was not successful for the following reason:",
        status
      );
    }
  });
};

React.useEffect(() => {
  if(!_.isEmpty(drag)){
    const getAddress = getPayload(drag?.address_components)
    const address = drag?.formatted_address;
    const branchgetbyIdLocation = readTaskState?.data && readTaskState?.data?.branchLocation ? readTaskState?.data?.branchLocation : ''
    reset((prev: any) => ({
      ...prev,
      branchAddress: address,
      branchLocation: !_.isEmpty(getAddress?.political) ? getAddress?.political : branchgetbyIdLocation
    }));
  }
}, [drag])

React.useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      setMarkers({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => {
      console.error('Error getting current location');
    });
  } else {
    console.log("Geolocation is not available in your browser.");
  }
}, []);

  return (
    <React.Fragment>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px', width: '100%' }}>
        <Grid container spacing={2} style={{ margin: "0", width: "100%" }}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <Grid item xs={12} my={1.5}>
              <Typography className='branch-header-add' variant="h5" align='left'>{editShow ? "Edit Branch" : "Add Branch"}</Typography>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography className='branch-header' variant="h5" align='left'>Branch Details</Typography>
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
              </Box>
              <Grid container spacing={2} columns={13} justifyContent={'space-between'}>
                <Grid item sm={12} lg={8.5} order={{ sm: 1, md: 1, lg: 1 }}>
                  <Grid container columns={8} spacing={2} justifyContent='space-between'>
                    <Grid item xs={8} sm={3.75}>
                      {roles_data.role === Role_Types.Admin ?
                        <Controller
                          name="merchantName"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'merchant required' }}
                          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              sx={{ marginTop: '16px', marginBottom: '8px' }}
                              disablePortal
                              id="merchantName"
                              className='merchant-border-radius required-asterisk-auto-color'
                              style={{ borderRadius: '8px' }}
                              value={value || null}
                              options={merchantData.data}
                              getOptionLabel={(option: any) => option.restaurantName || ''}
                              onChange={(_, data: any) => {
                                onChange(data)
                              }}
                              renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                                autoFocus
                                error={!!error} label="Merchant Name" InputLabelProps={{ required: true }} />)}
                                clearOnBlur={value ? true : false}
                            />
                          )}
                        /> :
                        <Controller
                          name="merchantName"
                          control={control}
                          defaultValue=""
                          render={({ field: { ref, onChange, value } }) => (
                            <Autocomplete
                              sx={{ marginTop: '16px', marginBottom: '8px' }}
                              disablePortal
                              id="merchantName"
                              className='merchant-border-radius'
                              disabled
                              style={{ borderRadius: '8px' }}
                              value={merchantData.data[0] || null}
                              options={merchantData.data}
                              getOptionLabel={(option: any) => option.restaurantName || ''}
                              onChange={(_, data: any) => {
                                onChange(data)
                              }}
                              renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                                label="Merchant Name" />)}
                                clearOnBlur={value ? true : false}
                            />
                          )}
                        />}
                      <Controller
                        name="branchName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                            id="branchName"
                            label="Branch Name"
                            name="branchName"
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
                      <Controller
                        name="branchTelephoneNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            sx={{ marginBottom: '16px' }}
                            margin="normal"
                            fullWidth
                            id="branchTelephoneNumber"
                            label="Telephone Number (optional)"
                            name="branchTelephoneNumber"
                            value={value || ''}
                            onChange={onChange}
                            InputProps={{
                              autoComplete: 'off',
                              inputComponent: IMaskInput as any,
                              inputProps: {
                                mask: '00000 00000',
                              },
                              sx: {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="contactEmail"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            sx={{ marginBottom: '16px' }}
                            margin="normal"
                            fullWidth
                            id="contactEmail"
                            label="Email"
                            name="contactEmail"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 100) {
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
                      <Controller
                        name="branchLocation"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                            id="branchLocation"
                            label="Branch Location"
                            name="branchLocation"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9@#&^\-._$ /\s]+$/;
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
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }}) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                            id="description"
                            label="Description (Optional)"
                            name="description"
                            value={value || ''}
                            onChange={onChange}
                            helperText="max 250 characters"
                            rows={3}
                            multiline
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
                    <Grid item xs={8} sm={3.75}>
                      <Controller
                        name="branchType"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'branch type required' }}
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '8px' }}
                            disablePortal
                            id="branchType"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={branchTypes}
                            getOptionLabel={(option: any) => option.name || ''}
                            onChange={(_, data: any) => { onChange(data) }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="Branch Type" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                      <Controller
                        name="branchManager"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                            id="branchManager"
                            label="Branch Manager"
                            name="branchManager"
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
                      <Controller
                        name="contactNo"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            sx={{ marginBottom: '16px' }}
                            margin="normal"
                            fullWidth
                            id="contactNo"
                            label="Mobile Number"
                            name="contactNo"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            InputProps={{
                              autoComplete: 'off',
                              inputComponent: IMaskInput as any,
                              inputProps: {
                                mask: '0000000000',
                              },
                              sx: {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                              margin="normal"
                              fullWidth
                              sx={{ marginBottom: '16px' }}
                              id="password"
                              label="Password"
                              name="password"
                              required
                              className='required-asterisk-color'
                              type={showPassword ? 'text' : 'password'}
                              value={value || ''}
                              onChange={onChange}
                              error={!!error}
                              inputProps={{
                                onKeyPress: (event) => {
                                  if (value.length >= 15) {
                                    event.preventDefault();
                                  }
                                },
                                onPaste: (event) => {
                                  event.preventDefault();
                                },
                                onDrop: (event) => {
                                  event.preventDefault();
                                },
                              }}
                              InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                  <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                                    <IconButton
                                      aria-label='toggle password visibility'
                                      onClick={passwordHandler}
                                      edge='end'
                                    >
                                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    </IconButton>
                                  </Tooltip>
                                  <IconButton
                                    aria-label='info'
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose}
                                  >
                                    <InfoOutlinedIcon />
                                  </IconButton>
                                </InputAdornment>,
                                autoComplete: 'off',
                                sx: {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          )}
                        />
                        <Popover
                          id="mouse-over-popover"
                          sx={{
                            pointerEvents: 'none',
                            '& .MuiPaper-root': {
                              width: '200px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(0, 0, 0, 0.54)',
                              color: '#fff'
                            },
                          }}
                          open={open}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          onClose={handlePopoverClose}
                          disableRestoreFocus
                        >
                          <Typography sx={{ p: 1, fontSize: '12px' }}>Passwords should be 8 to 15 characters long and contain alphanumeric characters.</Typography>
                        </Popover>
                      </>
                      <Controller
                        name="branchAddress"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                            id="branchAddress"
                            label="Branch Address"
                            name="branchAddress"
                            required
                            disabled
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            rows={4}
                            multiline
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
                <Grid item sm={9} md={5} lg={4} textAlign={'center'} order={{ sm: 7, md: 7, lg: 2 }}>
                  <Controller
                    name="images"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <Typography className='list-header' sx={{ ml: 1.5 }} mt={2}>Banner image</Typography>
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
                                    width='250px' height='160px' style={{ borderRadius: '18px', objectFit: 'cover', background: '#FFFFFF', overflow: 'hidden' }}
                                    loading='lazy'
                                  />
                                ))) : (
                                  <img
                                    src={branchDummy}
                                    alt="upload"
                                    style={{
                                      width: '85%',
                                      height: '30vh',
                                      borderRadius: '18px', objectFit: 'cover', background: '#FFFFFF', overflow: 'hidden'
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
                        <Box key={image.id} sx={{ display: 'flex', mt: 2, mb: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems: 'center' }}>
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
                  <Map markers={markers} setMarkers={setMarkers} handleMapClick={handleMapClick} drag={drag} setDrag={setDrag} />
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='body1'>
                      <span className='lat-long'>Latitude
                      <Tooltip title={`Latitude: ${markers.lat}`} arrow>
                        <IconButton>
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      </span> 
                      {!_.isNull(markers.lat) ? (markers.lat)?.toFixed(6): ''}
                    </Typography>
                    <Typography variant='body1'>
                    <span className='lat-long'>Longitude
                    <Tooltip title={`Latitude: ${markers.lng}`} arrow>
                        <IconButton>
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </span> {!_.isNull(markers.lng) ? (markers.lng)?.toFixed(6): ''}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sm={13} md={13} my={1.5} order={{ sm: 2, md: 2, lg: 3 }}>
                  <Typography className='branch-header' variant="h5" align='left'>Availability Details</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} order={{ sm: 3, md: 3, lg: 4 }}>
                  <Controller
                    name="categoryTypes"
                    control={control}
                    rules={{ required: 'category types required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        sx={{ marginBottom: '16px' }}
                        limitTags={1}
                        id="categoryTypes"
                        className='merchant-border-radius required-asterisk-auto-color'
                        options={!editShow ? categoryTypeData.data: filteredArray}
                        getOptionLabel={(option: any) => option?.name}
                        value={cuisine || null}
                        onChange={(_, data: any) => {
                          const isCuisineAlreadySelected = cuisine.some(
                            (existingCuisine: any) => existingCuisine.id === data.id
                          );
                          if (!isCuisineAlreadySelected) {
                            setCuisine(data);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cuisine types"
                            InputLabelProps={{ required: true }}
                          />
                        )}
                        clearOnBlur={value ? true : false}
                      />
                    )}
                  />
                  <Controller
                    name="gst"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="gst"
                        label="GST percentage"
                        name="gst"
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
                </Grid>
                <Grid item xs={12} sm={6} md={4} order={{ sm: 4, md: 4, lg: 5 }}>
                  <Controller
                    name="categories"
                    control={control}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        sx={{ marginBottom: '16px' }}
                        limitTags={1}
                        id="categories"
                        className='merchant-border-radius required-asterisk-auto-color'
                        options={!editShow ? categoryListData.data : filteredCategory}
                        getOptionLabel={(option: any) => option?.categoryName}
                        value={category || null}
                        onChange={(_, data: any) => {
                          const isCategoryAlreadySelected = category.some(
                            (existingCategory: any) => existingCategory.id === data.id
                          );
                          if (!isCategoryAlreadySelected) {
                            setCategory(data)
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Categories"
                            InputLabelProps={{ required: true }}
                          />
                        )}
                        clearOnBlur={value ? true : false}
                      />
                    )}
                  />
                  <Controller
                    name="branchMinAmount"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="branchMinAmount"
                        label="Branch Minimum Amount"
                        name="branchMinAmount"
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
                        helperText={error && error.message}
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
                <Grid item xs={12} sm={6} md={4} order={{ sm: 5, md: 5, lg: 6 }}>
                  <Controller
                    name="isVeg"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'food type required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
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
                <Grid item xs={12} order={{ sm: 6, md: 6, lg: 7 }}>
                  <Typography>Branch is open</Typography>
                  <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                    {checkBoxList.map((item: any, index: any) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Controller
                            name={`branchisOpen.${index}`}
                            control={control}
                            render={({ field: { value }, fieldState: { error } }) => (
                              <Checkbox
                                color='warning'
                                name={`branchisOpen.${index}`}
                                checked={value}
                                onChange={(e) => setValue(`branchisOpen.${index}`, e.target.checked)}
                              />
                            )}
                          />
                        }
                        label={item.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} order={{ sm: 8, md: 8, lg: 8 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={branchAdd?.loading || branchUpdate?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        branchAdd?.loading || branchUpdate?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                          !editShow ? 'Save' : 'Update'
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
          message={branchAdd?.message || branchUpdate?.message || fileSizeError}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment >
  )
}

export default BranchAdd