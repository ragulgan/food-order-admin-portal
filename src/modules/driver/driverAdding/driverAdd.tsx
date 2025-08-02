/* eslint-disable */
import React, { Fragment, useState, useEffect } from 'react'
import {
  Box, Button, Grid, TextField, Typography, CircularProgress, Autocomplete, Avatar, IconButton, FormControlLabel,
  Switch, Stack, Checkbox, InputAdornment, Popover
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear'
import avatorEmpty from '../../../assets/images/avatorEmpty.png'
import { Controller, useForm } from "react-hook-form";
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice';
import { fetchState } from '../../../reduxState/merchantSlice/stateSlice';
import { fetchRegion } from '../../../reduxState/merchantSlice/regionSlice';
import { formatToUTC, dateStringToObject } from "../../utils/dateformat";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { addDriver, clearAddState } from '../../../reduxState/driverSlice/driverAddSlice';
import { updateDriverById, clearUpdateState } from '../../../reduxState/driverSlice/driverUpdateSlice';
import { fetchDriverById, clearViewState } from '../../../reduxState/driverSlice/driverViewSlice';
import { multipleFileUpload, clearState as clearMultipleFileUpload } from '../../../reduxState/fileupload/multipleFileUpload';
import { singleFileUpload, clearState as clearSingleFileUpload } from '../../../reduxState/fileupload/singleFileUpload'
import { deleteFile, clearState as clearDeleteFile } from '../../../reduxState/fileupload/deleteFile'
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '../../../reduxState/store';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IMaskInput } from 'react-imask';
import { useNavigate, useLocation } from 'react-router-dom';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import _ from 'lodash'
import dayjs, { Dayjs } from 'dayjs';
import { RESTRICTED_FILE_FORMAT_TYPE } from '../../utils/constant';

const endOfQ12022 = dayjs().subtract(18, 'year');
const startOfQ12022 = dayjs().subtract(50, 'year');

const DriverAdd: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addTaskState = useSelector((state: RootState) => state.driverAdd);
  const updateTaskState = useSelector((state: RootState) => state.driverUpdate);
  const readTaskState = useSelector((state: RootState) => state.driverView);
  const countryData = useSelector((state: RootState) => state.countryDropdown);
  const stateData = useSelector((state: RootState) => state.stateDropdown);
  const cityData = useSelector((state: RootState) => state.cityDropdown);
  const driverUploadState = useSelector((state: RootState) => state.singleUpload.data)
  const documentUpload = useSelector((state: RootState) => state.multipleUpload.data);
  const documentImg = documentUpload ? documentUpload : ([]);
  const [selectedCurrentStateId, setSelectedCurrentStateId] = useState<string>('');
  const [selectedCurrentCountryId, setSelectedCurrentCountryId] = useState<string>('');
  const [selectedPermanentStateId, setSelectedPermanentStateId] = useState<string>('');
  const [selectedPermanentCountryId, setSelectedPermanentCountryId] = useState<string>('');
  const [image, setImage] = useState(driverUploadState);
  const [newImage, setNewImage] = React.useState(documentUpload)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [isChecked , setIsChecked] = React.useState(false);
  const [countryWatch, setCountryWatch] = React.useState<any>()
  const [stateWatch, setStateWatch] = React.useState<any>()
  const [cityWatch, setCityWatch] = React.useState<any>()
  const navigate = useNavigate()
  const location = useLocation();
  const [birthDate, setBirthDate] = React.useState<any>(null);
  const [fileSizeError,setFileSizeError] = React.useState<any>('')
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [anchorElVehicleNo, setAnchorElVehicleNo] = React.useState<HTMLElement | null>(null);
  const [anchorElVehicleRCNo, setAnchorElVehicleRCNo] = React.useState<HTMLElement | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<any>('');

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(''),
    lastName: yup.string().required(''),
    email: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    nin: yup.string().required('').matches(/^(\d{12})$/, 'Please enter correct NIN Number Ex: 90xx xxxx xxxx xx12'),
    phoneNumber: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    status: yup.boolean().required(''),
    currentDoorNumber: yup.string().required(''),
    currentStreetName: yup.string().required(''),
    currentLocality: yup.string().required(''),
    currentPinCode: yup.string().required('').matches(/^(\d{6})$/, 'Please enter valid pin code Ex: 9xxxx2'),
    currentCity: yup.object().required(''),
    currentState: yup.object().required(''),
    currentCountry: yup.object().required(''),
    driverVehicleNumber: yup.string().required('').matches(/^([a-zA-Z]{2})(\d{2})([a-zA-Z]{2})(\d{4})$/, 'Please enter valid vehicle number Ex: TN xx AA xxxx'),
    driverVehicleBrand: yup.string().required(''),
    driverVehicleModel: yup.string().required(''),
    driverVehicleColor: yup.string().required(''),
    driverVehicleRCNumber: yup.string().required('').matches(/^([a-zA-Z]{3})(\d{8})$/, 'Please enter valid RC number Ex: TNN xxxxxxxx'),
    driverVehicleInsuranceNumber: yup.string().required(''),
    // dob: yup.string().required(''),
    // profile: yup.object().required(''),
    // permanentDoorNumber: yup.string().required(''),
    // permanentStreetName: yup.string().required(''),
    // permanentLocality:  yup.string().required(''),
    // permanentPinCode:  yup.string().required('').matches(/^(\d{6})$/, 'Please enter valid pin code Ex: 9xxxx2'),
    // permanentCity:  yup.object().required(''),
    // permanentState: yup.object().required(''),
    // permanentCountry:  yup.object().required(''),
    // documents: yup.array().required(''),
  });

  const EditvalidationSchema = yup.object().shape({
    firstName: yup.string().required(''),
    lastName: yup.string().required(''),
    email: yup.string().required('').matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ''),
    nin: yup.string().required('').matches(/^(\d{12})$/, 'Please enter correct NIN Number Ex: 90xx xxxx xxxx xx12'),
    phoneNumber: yup.string().required('').matches(/^[6789]\d{9}$/, ''),
    status: yup.boolean().required(''),
    currentDoorNumber: yup.string().required(''),
    currentStreetName: yup.string().required(''),
    currentLocality: yup.string().required(''),
    currentPinCode: yup.string().required('').matches(/^(\d{6})$/, 'Please enter valid pin code Ex: 9xxxx2'),
    currentCity: yup.object().required(''),
    currentState: yup.object().required(''),
    currentCountry: yup.object().required(''),
    driverVehicleNumber: yup.string().required('').matches(/^([a-zA-Z]{2})(\d{2})([a-zA-Z]{2})(\d{4})$/, 'Please enter valid vehicle number Ex: TN xx AA xxxx'),
    driverVehicleBrand: yup.string().required(''),
    driverVehicleModel: yup.string().required(''),
    driverVehicleColor: yup.string().required(''),
    driverVehicleRCNumber: yup.string().required('').matches(/^([a-zA-Z]{3})(\d{8})$/, 'Please enter valid RC number Ex: TNN xxxxxxxx'),
    driverVehicleInsuranceNumber: yup.string().required(''),
    permanentDoorNumber: yup.string().required(''),
    permanentStreetName: yup.string().required(''),
    permanentLocality: yup.string().required(''),
    permanentPinCode: yup.string().required('').matches(/^(\d{6})$/, 'Please enter valid pin code Ex: 9xxxx2'),
    permanentCity: yup.object().required(''),
    permanentState: yup.object().required(''),
    permanentCountry: yup.object().required(''),
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: editShow ? yupResolver(EditvalidationSchema) : yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      nin: '',
      phoneNumber: '',
      dob: '',
      status: true,
      currentDoorNumber: '',
      currentStreetName: '',
      currentLocality: '',
      currentPinCode: '',
      currentCity: '',
      currentState: '',
      currentCountry: '',
      profile: '',
      permanentDoorNumber: '',
      permanentStreetName: '',
      permanentLocality: '',
      permanentPinCode: '',
      permanentCity: '',
      permanentState: '',
      permanentCountry: '',
      driverVehicleNumber: '',
      driverVehicleBrand: '',
      driverVehicleModel: '',
      driverVehicleColor: '',
      driverVehicleRCNumber: '',
      driverVehicleInsuranceNumber: '',
      documents: [''],
    }
  });
  const statusWatch = watch('status');
  const doorNoWatch = watch('currentDoorNumber');
  const streetNameWatch = watch('currentStreetName');
  const localityWatch = watch('currentLocality');
  const pinCodeWatch = watch('currentPinCode');

  React.useEffect(() => {
    if (editShow && documentUpload) {
      const imageValue = documentUpload?.map((img: any) => {
        const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
        return newObj
      })
      if (imageValue?.length > 0 && newImage?.length > 0) {
        documentUpload && documentUpload?.map((img: any) => {
          const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
          setNewImage((values: any) => ([
            ...values,
            newObj
          ]))
        })
      } else if (imageValue && imageValue?.length > 0) {
        setNewImage(imageValue)
      }
    } else if (documentUpload && documentUpload?.length > 0) {
      setNewImage(documentUpload)
    }
  }, [documentUpload, editShow]);

  useEffect(() => {
    const params: any = { status: 'ACTIVE', sort: 'asc' };
    dispatch(fetchCountry(params));
    dispatch(fetchState(params))
    dispatch(fetchRegion(params))
  }, []);

  React.useEffect(() => {
    if (selectedCurrentCountryId) {
      const params: any = { status: 'ACTIVE', countryId: selectedCurrentCountryId, sort: 'asc' };
      dispatch(fetchState(params))
    } 
  }, [selectedCurrentCountryId])

  React.useEffect(() => {
    if (selectedCurrentStateId) {
      const params: any = { status: 'ACTIVE', stateId: selectedCurrentStateId, sort: 'asc' };
      dispatch(fetchRegion(params))
    }
  }, [selectedCurrentStateId])

  React.useEffect(() => {
    if (selectedPermanentCountryId) {
      const params: any = { status: 'ACTIVE', countryId: selectedPermanentCountryId, sort: 'asc' };
      dispatch(fetchState(params))
    }
  }, [selectedPermanentCountryId])

  React.useEffect(() => {
    if (selectedPermanentStateId) {
      const params: any = { status: 'ACTIVE', stateId: selectedPermanentStateId, sort: 'asc' };
      dispatch(fetchRegion(params))
    }
  }, [selectedPermanentStateId])

  useEffect(() => {
    setImage(driverUploadState)
  }, [driverUploadState])

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
        setIsErrorSnackbarOpen(true);
        setTimeout(()=>{
          dispatch(clearAddState());
          dispatch(clearUpdateState());
        },2000)
    }
  }, [addTaskState, updateTaskState]);

  const newdocumentImg = newImage?.map((img: any) => {
    const newObj = { id: img?.id, filePath: img?.filePath, displayName: img?.displayName }
    return newObj;
  })

  const onSubmit = (event: any) => {
    const document: Array<any> = [];
    documentImg.forEach((element: any) => {
      document.push(element.filePath)
    });
    event.documents = document;
    const payload: any = {
      firstName: event.firstName.trim(),
      lastName: event.lastName.trim(),
      emailId: event.email.trim(),
      nin: event.nin,
      phoneNumber: event.phoneNumber,
      dob: birthDate,
      status: event.status === true ? 'ACTIVE' : 'INACTIVE',
      currentAddressDoorNo: event.currentDoorNumber.trim(),
      currentAddressStreet: event.currentStreetName.trim(),
      currentAddressLocality: event.currentLocality.trim(),
      currentAddressPincode: event.currentPinCode.trim(),
      currentAddressCity: event.currentCity.id,
      currentAddressState: event.currentState.id,
      currentAddressCountry: event.currentCountry.id,
      profile: { id: image?.id, displayName: image?.displayName, filePath: image?.filePath },
      permanentAddressDoorNo: isChecked ? doorNoWatch : event.permanentDoorNumber.trim(),
      permanentAddressStreet: isChecked ? streetNameWatch: event.permanentStreetName.trim(),
      permanentAddressLocality: isChecked ? localityWatch : event.permanentLocality.trim(),
      permanentAddressPincode: isChecked ? pinCodeWatch : event.permanentPinCode.trim(),
      permanentAddressCity: isChecked ? cityWatch && cityWatch.id : event.permanentCity.id,
      permanentAddressState: isChecked ? stateWatch && stateWatch.id : event.permanentState.id,
      permanentAddressCountry: isChecked ? countryWatch && countryWatch.id : event.permanentCountry.id,
      driverVehicleNumber: event.driverVehicleNumber.trim(),
      driverVehicleBrand: event.driverVehicleBrand.trim(),
      driverVehicleModel: event.driverVehicleModel.trim(),
      driverVehicleColor: event.driverVehicleColor.trim(),
      driverVehicleRCNumber: event.driverVehicleRCNumber.trim(),
      vehicleInsuranceNumber: event.driverVehicleInsuranceNumber.trim(),
      documents: newdocumentImg,
    }
    if (location.state) {
      payload.id = location.state;
      dispatch(updateDriverById(payload));
    }
    else {
      dispatch(addDriver(payload));
    }
  }

  React.useEffect(() => {
    if (addTaskState && addTaskState?.code === 200) {
      reset();
      dispatch(clearSingleFileUpload())
      dispatch(clearMultipleFileUpload())
      dispatch(clearDeleteFile())
      navigate("/drivers/list")
    }
  }, [addTaskState])

  React.useEffect(() => {
    if (updateTaskState && updateTaskState?.code === 200) {
      reset();
      dispatch(clearSingleFileUpload())
      dispatch(clearMultipleFileUpload())
      dispatch(clearDeleteFile())
      dispatch(clearViewState())
      navigate("/drivers/list")
    }
  }, [updateTaskState])

  const handleOnCloseModal = () => {
    reset({
      firstName: '',
      lastName: '',
      email: '',
      nin: '',
      phoneNumber: '',
      dob: '',
      status: true,
      currentDoorNumber: '',
      currentStreetName: '',
      currentLocality: '',
      currentPinCode: '',
      currentCity: '',
      currentState: '',
      currentCountry: '',
      profile: '',
      permanentDoorNumber: '',
      permanentStreetName: '',
      permanentLocality: '',
      permanentPinCode: '',
      permanentCity: '',
      permanentState: '',
      permanentCountry: '',
      driverVehicleNumber: '',
      driverVehicleBrand: '',
      driverVehicleModel: '',
      driverVehicleColor: '',
      driverVehicleRCNumber: '',
      driverVehicleInsuranceNumber: '',
      documents: [''],
    });
    dispatch(clearSingleFileUpload())
    dispatch(clearMultipleFileUpload())
    dispatch(clearDeleteFile())
    dispatch(clearViewState())
    navigate("/drivers/list")
  }

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
      dispatch(clearSingleFileUpload())
      dispatch(clearMultipleFileUpload())
      dispatch(clearDeleteFile())
  }
  },[])

  useEffect(() => {
    if (location.state) {
      dispatch(fetchDriverById(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState.data?.id) {
      seteditShow(true)
      const documentImage = !_.isEmpty(readTaskState?.data?.documents) || !_.isNull(readTaskState?.data?.documents) ? readTaskState?.data?.documents : null;
      const currentCountryData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.currentAddressCountryDetails) ? readTaskState?.data?.currentAddressCountryDetails : null;
      const currentStateData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.currentAddressStateDetails) ? readTaskState?.data?.currentAddressStateDetails : null;
      const currentCityData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.currentAddressCityDetails) ? readTaskState?.data?.currentAddressCityDetails : null;
      const permanentCountryData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.permanentAddressCountryDetails) ? readTaskState?.data?.permanentAddressCountryDetails : null;
      const permanentStateData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.permanentAddressStateDetails) ? readTaskState?.data?.permanentAddressStateDetails : null;
      const permanentCityData = readTaskState?.data && !_.isEmpty(readTaskState?.data?.permanentAddressCityDetails) ? readTaskState?.data?.permanentAddressCityDetails : null;
      const updateImage =   documentImage?.filter(function (item: any) {
        const value = Object.values(item)
        if (!_.isNull(value && value[0])) {
          return item
        } else {
          return null
        }
      })
      setNewImage(updateImage)
      setBirthDate(dayjs(readTaskState?.data?.dob))
      reset({
        firstName: readTaskState?.data?.firstName,
        lastName: readTaskState?.data?.lastName,
        email: readTaskState?.data?.emailId,
        nin: readTaskState?.data?.nin,
        phoneNumber: readTaskState?.data?.phoneNumber,
        status: readTaskState?.data?.status === 'ACTIVE' ? true : false,
        currentDoorNumber: readTaskState?.data?.currentAddressDoorNo,
        currentStreetName: readTaskState?.data?.currentAddressStreet,
        currentLocality: readTaskState?.data?.currentAddressLocality,
        currentPinCode: readTaskState?.data?.currentAddressPincode,
        currentCity: currentCityData,
        currentState: currentStateData,
        currentCountry: currentCountryData,
        profile: readTaskState?.data?.profile,
        permanentDoorNumber: readTaskState?.data?.permanentAddressDoorNo,
        permanentStreetName: readTaskState?.data?.permanentAddressStreet,
        permanentLocality: readTaskState?.data?.permanentAddressLocality,
        permanentPinCode: readTaskState?.data?.permanentAddressPincode,
        permanentCity: permanentCityData,
        permanentState: permanentStateData,
        permanentCountry: permanentCountryData,
        driverVehicleNumber: readTaskState?.data?.driverVehicleNumber,
        driverVehicleBrand: readTaskState?.data?.driverVehicleBrand,
        driverVehicleModel: readTaskState?.data?.driverVehicleModel,
        driverVehicleColor: readTaskState?.data?.driverVehicleColor,
        driverVehicleRCNumber: readTaskState?.data?.driverVehicleRCNumber,
        driverVehicleInsuranceNumber: readTaskState?.data?.vehicleInsuranceNumber,
        documents: readTaskState?.data?.documents,
      })
      setImage(readTaskState?.data?.profile)
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
    if (driverUploadState?.id) {
      dispatch(deleteFile(driverUploadState?.id))
      dispatch(clearSingleFileUpload())
    }
  }

  const handleProfileImageClick = () => {
    const inputElement = document.getElementById('profile-image-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleMultipleDelete = (image: any) => {
    const updatedImages = newImage.filter((img: any) => img.id !== image.id);
    setNewImage(updatedImages);
    dispatch(deleteFile(image.id));
  };

  const handleDocumentImageClick = () => {
    const inputElement = document.getElementById('document-image-upload') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  const CheckedSameAddress = (e: any) => {
    if(_.isEmpty(doorNoWatch) || _.isEmpty(streetNameWatch) || _.isEmpty(localityWatch) || _.isEmpty(pinCodeWatch) || _.isUndefined(countryWatch) || _.isUndefined(stateWatch) || _.isUndefined(cityWatch) || _.isEmpty(countryWatch) || _.isEmpty(stateWatch) || _.isEmpty(cityWatch)){
      setIsErrorSnackbarOpen(true); 
      setErrorMessage('Please fill in all fields of the current address.');
    }else {
      setIsChecked(e.target.checked)
    }
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
};

const handlePopoverClose = () => {
  setAnchorEl(null);
};

const handlePopoverOpenVehicleNo = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorElVehicleNo(event.currentTarget);
};

const handlePopoverCloseVehicleNo = () => {
  setAnchorElVehicleNo(null);
};

const handlePopoverOpenVehicleRCNo = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorElVehicleRCNo(event.currentTarget);
};

const handlePopoverCloseVehicleRCNo = () => {
  setAnchorElVehicleRCNo(null);
};

const open = Boolean(anchorEl);
const openVehicleNo = Boolean(anchorElVehicleNo);
const openVehicleRCNo = Boolean(anchorElVehicleRCNo);

  return (
    <Fragment>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px' }}>
        <Grid container spacing={2} style={{ margin: "0", width: "100%" }}>
          <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
            <Grid item xs={12} my={1.5}>
              <Typography className='branch-header-add' variant="h5" align='left' mb={2}>{editShow ? "Edit Driver" : "Add Driver"}</Typography>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography className='typography-header-driver' variant="h6" align='left'>Personal Details</Typography>
                {editShow ? 
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
                </>  : null}
              </Box>
              <Grid container spacing={2}>
                <Grid item sm={12} lg={9} order={{ sm: 2, md: 1, lg: 1}}>
                  <Grid container columns={8.25} spacing={2} justifyContent='space-between'>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            required
                            className='required-asterisk-color'
                            autoFocus
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z]+$/;
                                if (!regex.test(event.key) || value.length >= 15) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z]+$/;
                                if (!regex.test(event.key) || value.length >= 15) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
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
                                borderRadius: '8px',
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="phoneNumber"
                            label="Phone Number"
                            name="phoneNumber"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            InputProps={{
                              sx: {
                                borderRadius: '8px',
                              },
                              autoComplete: 'off',
                              inputComponent: IMaskInput as any,
                              inputProps: {
                                mask: '0000000000',
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12} mt={1}>
                      <DemoContainer components={['DateTimePicker']}>
                        <DatePicker className="date-input" label="Date of birth"
                          format="DD/MM/YYYY"
                          views={['year', 'month', 'day']}
                          minDate={startOfQ12022}
                          maxDate={endOfQ12022}
                          value={birthDate} 
                          onChange={(newValue) => setBirthDate(newValue)} />
                      </DemoContainer>
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="nin"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="nin"
                            label="National Indentity No"
                            name="nin"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>
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
                             inputComponent: IMaskInput as any,
                             inputProps: {
                               mask: '000000000000',
                             },
                             sx: {
                               borderRadius: '8px',
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
                        <Typography sx={{ p: 1, fontSize: '12px' }}>Ex: 90xx xxxx xx12</Typography>
                      </Popover>
                    </Grid>
                    <Grid item sm={12} md={12} lg={8.25}>
                      <p className='bill-details-header' style={{ marginTop: '16px', marginBottom: '0px' }}>Current Address</p>
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentDoorNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="currentDoorNumber"
                            label="Door Number"
                            name="currentDoorNumber"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`|-]+$/;
                                if (!regex.test(event.key) || value.length >= 10) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentStreetName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="currentStreetName"
                            label="Street Name"
                            name="currentStreetName"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 50) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentLocality"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="currentLocality"
                            label="Locality"
                            name="currentLocality"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 50) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentPinCode"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="currentPinCode"
                            label="Pin Code"
                            name="currentPinCode"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            InputProps={{
                              autoComplete: 'off',
                              inputComponent: IMaskInput as any,
                              inputProps: {
                                mask: '000000',
                              },
                              sx: {
                                borderRadius: '8px',
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentCountry"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="currentCountry"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={countryData.data}
                            getOptionLabel={(option: any) => option.countryName || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedCurrentCountryId(data.id)
                                setCountryWatch(data)
                              }
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="Country" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentState"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="currentState"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={stateData.data}
                            getOptionLabel={(option: any) => option.stateName || ''}
                            disabled={!selectedCurrentCountryId && !editShow  ? true : false}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedCurrentStateId(data.id)
                                setStateWatch(data)
                              }
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="State" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="currentCity"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="currentCity"
                            className='merchant-border-radius required-asterisk-auto-color'
                            value={value || null}
                            options={cityData.data}
                            getOptionLabel={(option: any) => option.cityName || ''}
                            disabled={!selectedCurrentStateId && !editShow  ? true : false}
                            onChange={(_, data: any) => {
                              onChange(data)
                              setCityWatch(data)
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="City" InputLabelProps={{ required: true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item sm={12} md={12} lg={8.25} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <p className='bill-details-header'>Permanent Address</p>
                      {!editShow ?
                      <Box display={'flex'}>
                        <p className='bill-details-header'>Permanent address is same as current address</p>
                        <Checkbox
                          color='warning'
                          checked={isChecked}
                          onChange={CheckedSameAddress}
                        />
                      </Box> : null}
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentDoorNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="permanentDoorNumber"
                            label="Door Number"
                            name="permanentDoorNumber"
                            required={isChecked ? false : true}
                            className='required-asterisk-color'
                            disabled={isChecked}
                            value={isChecked ? doorNoWatch : value}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`|-]+$/;
                                if (!regex.test(event.key) || value.length >= 10) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentStreetName"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="permanentStreetName"
                            label="Street Name"
                            name="permanentStreetName"
                            required={isChecked ? false : true}
                            className='required-asterisk-color'
                            disabled={isChecked}
                            value={isChecked ? streetNameWatch : value}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 50) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentLocality"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="permanentLocality"
                            label="Locality"
                            name="permanentLocality"
                            required={isChecked ? false : true}
                            className='required-asterisk-color'
                            disabled={isChecked}
                            value={isChecked ? localityWatch : value}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                if (value.length >= 50) {
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentPinCode"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="permanentPinCode"
                            label="Pin Code"
                            name="permanentPinCode"
                            required={isChecked ? false : true}
                            className='required-asterisk-color'
                            disabled={isChecked}
                            value={isChecked ? pinCodeWatch : value}
                            onChange={onChange}
                            error={!!error}
                            InputProps={{
                              autoComplete: 'off',
                              inputComponent: IMaskInput as any,
                              inputProps: {
                                mask: '000000',
                              },
                              sx: {
                                borderRadius: '8px',
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentCountry"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="permanentCountry"
                            className='merchant-border-radius required-asterisk-auto-color'
                            disabled={isChecked}
                            value={isChecked ? countryWatch : value}
                            options={countryData?.data}
                            getOptionLabel={(option: any) => option.countryName || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedPermanentCountryId(data.id)
                              }
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="Country" InputLabelProps={{ required: isChecked ? false : true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentState"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="permanentState"
                            className='merchant-border-radius required-asterisk-auto-color'
                            disabled={isChecked || !selectedPermanentCountryId && !editShow  ? true : false}
                            value={isChecked ? stateWatch : value}
                            options={stateData?.data}
                            getOptionLabel={(option: any) => option.stateName || ''}
                            onChange={(_, data: any) => {
                              onChange(data)
                              if (data !== null) {
                                setSelectedPermanentStateId(data.id)
                              }
                            }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="State" InputLabelProps={{ required: isChecked ? false : true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="permanentCity"
                        control={control}
                        defaultValue=""
                        render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            sx={{ marginTop: '16px', marginBottom: '16px' }}
                            disablePortal
                            id="permanentCity"
                            className='merchant-border-radius required-asterisk-auto-color'
                            disabled={isChecked || !selectedPermanentStateId && !editShow  ? true : false}
                            value={isChecked ? cityWatch : value}
                            options={cityData?.data}
                            getOptionLabel={(option: any) => option.cityName || ''}
                            onChange={(_, data: any) => { onChange(data) }}
                            renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                              ...params.inputProps,
                              autoComplete: 'off',
                            }} error={!!error} label="City" InputLabelProps={{ required: isChecked ? false : true }} />)}
                            clearOnBlur={value ? true : false}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12} md={5} lg={3} order={{ sm: 1, md: 2, lg: 2}}>
                  <Grid container columns={12} spacing={2} px={3} className='img-padding'>
                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' >
                      {!editShow && !_.isEmpty(image) ? (
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}${image.filePath}`}
                          width={'180px'}
                          height={'180px'}
                          alt="Profile picture"
                          style={{ borderRadius: '20px', objectFit: 'cover' }}
                        />
                      ) : editShow && !_.isEmpty(image) && !_.isNull(image.id) ? (
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}${image.filePath}`}
                          width={'180px'}
                          height={'180px'}
                          alt="Profile picture"
                          style={{ borderRadius: '20px', objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          src={avatorEmpty}
                          width={'180px'}
                          height={'180px'}
                          alt="Profile picture"
                          style={{ borderRadius: '20px', objectFit: 'cover' }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} lg={12} display='flex' justifyContent='center'>
                      <Button className='profile-button' variant="outlined" onClick={handleProfileImageClick}>
                        Change Profile Image
                      </Button>
                      <input
                        accept="image/*"
                        id="profile-image-upload"
                        type="file"
                        onChange={(e) => {
                          {
                            handleFileChange(e)
                            e.target.value === null
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12} md={12} lg={8.25} order={{ sm: 3, md: 3, lg: 3}}>
                  <Typography className='typography-header-driver' variant="h6" align='left' mt={2}>Vehicle Details</Typography>
                </Grid>
                <Grid item sm={12} lg={9} order={{ sm: 4, md: 4, lg: 4}}>
                  <Grid container columns={8.25} spacing={2} justifyContent='space-between'>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleNumber"
                            label="Driver Vehicle Number"
                            name="driverVehicleNumber"
                            required
                            className='required-asterisk-color'
                            value={value ||''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9]+$/;
                                if (!regex.test(event.key) || value.length >= 10) {
                                  event.preventDefault();
                                }
                              },
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>
                                <IconButton
                                  aria-label='info'
                                  aria-owns={openVehicleNo ? 'mouse-over-popover' : undefined}
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverOpenVehicleNo}
                                  onMouseLeave={handlePopoverCloseVehicleNo}
                                >
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </InputAdornment>,
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px',
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
                        open={openVehicleNo}
                        anchorEl={anchorElVehicleNo}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverCloseVehicleNo}
                        disableRestoreFocus
                      >
                        <Typography sx={{ p: 1, fontSize: '12px' }}>Ex: TN xx AA xxxx</Typography>
                      </Popover>
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleBrand"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleBrand"
                            label="Driver Vehicle Brand"
                            name="driverVehicleBrand"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z]+$/;
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleModel"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleModel"
                            label="Driver Vehicle Model"
                            name="driverVehicleModel"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9]+$/;
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
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleColor"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleColor"
                            label="Driver Vehicle Color"
                            name="driverVehicleColor"
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
                                borderRadius: '8px',
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleRCNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleRCNumber"
                            label="Driver Vehicle RC Number"
                            name="driverVehicleRCNumber"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9]+$/;
                                if (!regex.test(event.key) || value.length >= 11) {
                                  event.preventDefault();
                                }
                              },
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>
                                <IconButton
                                  aria-label='info'
                                  aria-owns={openVehicleRCNo ? 'mouse-over-popover' : undefined}
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverOpenVehicleRCNo}
                                  onMouseLeave={handlePopoverCloseVehicleRCNo}
                                >
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </InputAdornment>,
                              autoComplete: 'off',
                              sx: {
                                borderRadius: '8px',
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
                        open={openVehicleRCNo}
                        anchorEl={anchorElVehicleRCNo}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverCloseVehicleRCNo}
                        disableRestoreFocus
                      >
                        <Typography sx={{ p: 1, fontSize: '12px' }}>Ex: TNN xxxxxxxx</Typography>
                      </Popover>
                    </Grid>
                    <Grid item xs={8.25} sm={4} md={4.12} lg={4.12}>
                      <Controller
                        name="driverVehicleInsuranceNumber"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            id="driverVehicleInsuranceNumber"
                            label="Vehicle Insurance Number"
                            name="driverVehicleInsuranceNumber"
                            required
                            className='required-asterisk-color'
                            value={value || ''}
                            onChange={onChange}
                            error={!!error}
                            inputProps={{
                              onKeyPress: (event) => {
                                const regex = /^[a-zA-Z0-9]+$/;
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
                    <Grid item xs={8.25}>
                      <p className='document-upload-header' style={{ marginTop: '0px' }}>Document</p>
                      <Button className='document-upload-button' variant="outlined" size="large" startIcon={<FileUploadIcon />} onClick={handleDocumentImageClick}>Upload</Button>
                      <input
                        accept="image/*"
                        id="document-image-upload"
                        type="file"
                        multiple
                        onChange={(e) => {
                          {
                            handleMultipleFileChange(e)
                            e.target.value === null
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </Grid>
                    <Grid item xs={8.25}>
                      <Grid container columnSpacing={3}>
                        {newImage &&
                          _.isArray(newImage) && newImage.map((image: any) => (
                            !_.isEmpty(image.filePath) ? (
                              <Grid item xs={4}>
                                <Box key={image.id} sx={{ display: 'flex', mt: 2, border: '0.5px solid #E9E9E9', borderRadius: 3, alignItems: 'center' }}>
                                  <Avatar
                                    src={`${process.env.REACT_APP_API_BASE_URL}${image.filePath}`}
                                    sx={{ width: '40px', height: '40px', marginRight: '8px' }}
                                  />
                                  <Box className='preview-image-text'>{image.displayName}</Box>
                                  <IconButton color="warning" onClick={() => handleMultipleDelete(image)}>
                                    <ClearIcon />
                                  </IconButton>
                                </Box>
                              </Grid>
                            ) : null
                          ))
                        }
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} order={{ sm: 5, md: 5, lg: 5}}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
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
          message={addTaskState?.message || updateTaskState?.message || fileSizeError || errorMessage}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  )
}
export default DriverAdd;