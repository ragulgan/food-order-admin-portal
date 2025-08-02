import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled, alpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box, Table, Grid, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, Checkbox, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Menu, Pagination, Chip, Stack, ListItemIcon, Avatar, Autocomplete,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import deliveryGif from '../../../assets/images/delivery-boy.gif'
import driverImage from '../../../assets/images/driver_empty.webp'
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriver } from '../../../reduxState/driverSlice/driverListSlice';
import { deleteDriverById, clearDeleteState } from '../../../reduxState/driverSlice/driverDeleteSlice';
import { AppDispatch, RootState } from '../../../reduxState/store';
import AppSnackbar from '../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { endOfDay } from "../../utils/dateformat"
import { clearAddState } from '../../../reduxState/driverSlice/driverAddSlice';
import { clearUpdateState } from '../../../reduxState/driverSlice/driverUpdateSlice';
import { useNavigate } from 'react-router-dom';
import Loading from '../../commonToast/loader';
import { REGEX } from '../../utils/constant';
import _ from 'lodash'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fff',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#fff',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  driverId: string;
  phoneNumber: string;
  currentAddressDoorNo: string,
  currentAddressStreet: string,
  currentAddressLocality: string,
  currentAddressCountryDetails: {
    id: string,
    countryName: string
  },
  currentAddressCityDetails: {
    id: string,
    cityName: string
  },
  currentAddressStateDetails: {
    id: string,
    stateName: string
  },
  currentAddressPincode: string,
  status: string;
}

const DriverList: React.FC<any> = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  // const [orderBy, setOrderBy] = useState<keyof Driver>('createdDate');
  const [order, setOrder] = useState('desc');
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>("10");
  const dispatch = useDispatch<AppDispatch>();
  const driverDataState = useSelector((state: RootState) => state.driver);
  const driverAddState = useSelector((state: RootState) => state.driverAdd);
  const driverUpdateState = useSelector((state: RootState) => state.driverUpdate);
  const driverDeleteState = useSelector((state: RootState) => state.driverDelete);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate()
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const driverNameInputRef = useRef(null);
  const mobileNumberInputRef = useRef(null);
  const fromDateInputRef = useRef(null);
  const toDateInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState('');
  const [name, setName] = React.useState<string>('');
  const [number, setNumber] = React.useState<string>('');
  const [isChanged, setIsChanged] = useState<any>(false)
  const totalPage = Math.ceil(driverDataState?.size / limit)

  const driverStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
    {value: 'NOT_VERIFIED', name: 'Not-Verified'},
    {value: 'PENDING', name: 'Pending'}
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]

  //driver add alert and update alert
  useEffect(() => {
    if (driverAddState && driverAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (driverUpdateState && driverUpdateState.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [driverAddState, driverUpdateState]);

  //driver delete alert
  useEffect(() => {
    if (driverDeleteState && driverDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [driverDeleteState]);

  useEffect(() => {
    if (driverDeleteState && driverDeleteState.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [driverDeleteState]);

  const loadDrivers = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: '' };
    if (fromDate) params.fromDate = endOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.status = status ? status : '';
    if (name) params.driverName = name.trim();
    if (number) params.mobileNo = number.trim();
    dispatch(fetchDriver(params));
  }

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setNumber('');
    setName('')
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchDriver({ pageNo: page, size: limit, status: '' }));
  };

  /* this will load driver intially as page value initated
 and also load the driver for page changes */
  useEffect(() => {
    loadDrivers();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadDrivers();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  //row menu dropdown elipsis action
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  // Action Events
  const handleAddOpen = () => {
    navigate('/drivers/add')
  };

  const handleEditOpen = (driver: any) => {
    navigate("/drivers/edit", { state: driver.id })
    // navigate(`/drivers/edit/${driver.id}`)
  };

  const handleViewOpen = (driver: any) => {
    navigate("/drivers/view", { state: driver.id })
  };

  const handleDeleteClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDriver) {
      setIsDeleting(true);
      dispatch(deleteDriverById(selectedDriver.id))
        .then(() => {
          setSelectedId(null);
          setIsDeleting(false);
          setDeleteModal(false);
          setAnchorEl(null);
          refreshTable();
        })
        .catch(() => {
          setSelectedId(null);
          setIsDeleting(false);
          setDeleteModal(false);
          setAnchorEl(null);
        });
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
  };

  useEffect(() => {
    if (driverAddState && driverAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (driverUpdateState && driverUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((driverDeleteState && driverDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [driverAddState, driverUpdateState, driverDeleteState]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleName = (e: any) => {
    setName(e.target.value)
  }

  const handlePhoneNo = (e: any) => {
    setNumber(e.target.value)
  }

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(name) || !_.isEmpty(number) || !_.isEmpty(fromDate) || !_.isEmpty(toDate) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadDrivers('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!driverDataState || !driverDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, driverDataState.size);
  };

  const calculateEndIndex = () => {
    if (!driverDataState || !driverDataState.size) return 0;
    const endIndex = Math.min(page * limit, driverDataState.size);
    return endIndex;
  };


  return (
    <Fragment>
          <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
            <Toolbar className='toolbar-pad'>
              <Grid container rowGap={1} columnGap={1} columns={14} style={{ justifyContent: "space-between" }}>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Driver name"
                    inputRef={driverNameInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={name}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.TEXT;
                      if (!regex.test(e.key) || name.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setName(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Mobile no"
                    inputRef={mobileNumberInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={number}
                    onChange={handlePhoneNo}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const key = e.key;
                      const currentValue = e.target.value;
                      const regex = REGEX.NUMERIC_DIGITS
                      const updatedValue = currentValue + key;

                      if (!regex.test(updatedValue) || updatedValue.length > 10) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setNumber(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2} ref={fromDateInputRef} onKeyDown={handleKeyPress}>
                  <DatePicker label="From Date" className='date-picker'
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    value={fromDate} 
                    onChange={(newValue) => setFromDate(newValue)}
                    sx={{
                      width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                      '& .MuiInputLabel-root': {
                        marginTop: '-7px',
                        marginBottom: '7px',
                      }
                    }} />
                </Grid>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2} ref={toDateInputRef} onKeyDown={handleKeyPress}>
                  <DatePicker label="To Date" className='date-picker'
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    value={toDate} 
                    onChange={(newValue) => setToDate(newValue)}
                    minDate={dayjs(fromDate)}
                    sx={{
                      width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                      '& .MuiInputLabel-root': {
                        marginTop: '-7px',
                        marginBottom: '7px',
                      }
                    }} />
                </Grid>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                  <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {driverStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid mb={0.5} item style={{ display: 'flex', alignItems: 'center' }} xs={6} sm={2.5} md={2.5} lg={2}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadDrivers('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item mb={0.5} style={{ display: 'flex', justifyContent: 'end' }} xs={6} sm={3} md={3} lg={1}>
                  {roleData?.drivers?.add ?
                    <Button variant="contained" className='addButton' onClick={handleAddOpen}>
                      Add
                    </Button> 
                     : null} 
                </Grid>
              </Grid>
            </Toolbar>
          </Box>
        {driverDataState && driverDataState?.loading ? (<Loading />) :
          <>
          <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
            <Table
              sx={{ maxWidth: "auto" }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <TableHead>
                <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                  <TableCell className='list-header' align='center' padding='normal'>#</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Profile</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Driver Name</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Driver Id</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Mobile No</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Location</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                  {roleData?.drivers?.view || roleData?.drivers?.edit || roleData?.drivers?.delete ?
                    <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                    null}
                </TableRow>
              </TableHead>
              <TableBody>
                {!driverDataState.loading && driverDataState.data.map((driver: any, index: any) => {
                  if (driver && driver.status && driver.status !== null) {
                  return (
                    <StyledTableRow
                      key={driver.id}
                    >
                      <TableCell className='list-data' align="center">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className='list-data' align="center">
                        {driver && driver.profile && driver.profile.id !== null ? (
                          <Avatar alt="Img" src={`${process.env.REACT_APP_API_BASE_URL}${driver?.profile?.filePath}`} />
                        ) : driver?.firstName && driver?.lastName ? (
                          <Avatar sx={{ backgroundColor: getRandomColor() }}>
                            {`${driver?.firstName?.charAt(0)?.toUpperCase()}${driver?.lastName?.charAt(0)?.toUpperCase()}`}
                          </Avatar>
                        ) : null}
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{driver && driver.firstName && driver.lastName ? (`${driver.firstName === '' ? '' : driver.firstName}  ${driver.lastName === '' ? '' : driver.lastName}`) : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{driver && driver?.driverId ? driver?.driverId : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{driver && driver?.phoneNumber ? driver?.phoneNumber : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{driver && driver?.currentAddressCityDetails && driver?.currentAddressCityDetails?.cityName ? `${driver?.currentAddressCityDetails?.cityName}` : '--'}</TableCell>
                      <TableCell className='list-data' align="center">
                        {driver && driver.status && driver.status !== null ?
                          <>
                            {driver.status === 'ACTIVE' && (
                              <Chip size='small' label={driver.status} className='status-active-chip' variant="outlined" />
                            )}
                            {driver.status === 'INACTIVE' && (
                              <Chip size='small' label={driver.status} className='status-inactive-chip' variant="outlined" />
                            )}
                            {driver.status === 'DELETED' && (
                              <Chip size='small' label={driver.status} className='status-deleted-chip' variant="outlined" />
                            )}
                            {driver.status === 'NOT_VERIFIED' && (
                              <Chip size='small' label={driver.status} className='order-status od-color' variant="outlined" />
                            )}
                            {driver.status === 'PENDING' && (
                              <Chip size='small' label={driver.status} className='order-status opickup-color' variant="outlined" />
                            )}
                          </> : '--'}
                      </TableCell>
                      {roleData?.drivers?.view || roleData?.drivers?.edit || roleData?.drivers?.delete ?
                        <TableCell className='list-data' align="center">
                          {driver.status !== 'DELETED' ?
                            <>
                              <IconButton onClick={(event) => handleMenuOpen(event, driver.id)}>
                                <MoreHorizIcon fontSize="small" />
                              </IconButton>
                            </> : null}
                          <Menu
                            anchorEl={anchorEl}
                            open={selectedId === driver.id}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{
                              vertical: 'top', horizontal: 'right',
                            }}
                            className='border-radius-mine'
                          >
                            {roleData?.drivers?.view ?
                              <MenuItem onClick={() => handleViewOpen(driver)}>
                                <ListItemIcon>
                                  <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                  <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                                </ListItemIcon>
                              </MenuItem> 
                              : null}
                            {roleData?.drivers?.edit ?
                              <>
                                {driver.status !== 'NOT_VERIFIED' && driver.status !== 'PENDING' ?
                                  <MenuItem onClick={() => handleEditOpen(driver)}>
                                    <ListItemIcon>
                                      <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                      <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                                    </ListItemIcon>
                                  </MenuItem>
                                  : null}
                              </> : null}
                            {roleData?.drivers?.delete ?
                              <MenuItem onClick={() => handleDeleteClick(driver)}
                              // sx={{ display: driver?.status === 'DELETED' ? 'none' : 'block'}}
                              >
                                <ListItemIcon>
                                  <DeleteOutlinedIcon style={{ color: '#FD973B' }} fontSize="small" />
                                  <Typography className='list-data' style={{ paddingLeft: '8px' }}>Delete</Typography>
                                </ListItemIcon>
                              </MenuItem>
                              : null}
                          </Menu>
                        </TableCell> 
                        : null}
                    </StyledTableRow>
                  );
                } else {
                  return null;
                }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>}
      {!driverDataState?.loading && driverDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
          <div style={{ marginTop: '10px' }} className='error-text'>
            <img style={{ width: '15%', height: '15%' }} src={driverImage} alt="delivery" />
          </div>
        </Grid>
      </Grid>}
      {!driverDataState?.loading && driverDataState?.data?.length > 0 ?
        <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', py:3, px: 2.5 }} position={'sticky'} bottom={0}>
          <Box sx={{display: 'flex'}}>
            <Typography mr={1}>Items per page:</Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={rowPerPage}
              disableClearable
              className='page-row'
              sx={{ width: 60, borderRadius: '0px' }}
              onChange={(_, data: any) => {
                setLimit(data?.label)
                setIsChanged(true)
              }}
              value={limit || "10"}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${driverDataState?.size}`}</Typography>
            </Box>
            <Pagination page={page} count={Math.ceil(driverDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#000',
                  background: '#FFFFFF',
                  border: '0.742647px solid #DFE3E8',
                  borderRadius: '2.97059px',
                  margin: '0 2px',
                  '&.Mui-selected': {
                    backgroundColor: '#FFFFFF',
                    color: '#FB3E07',
                    border: '0.742647px solid #FB3E07',
                  },
                },
              }}
            />
          </Box>
        </> : null}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className='signout-list'>
        <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
        <DialogContent>
          Are you sure want to delete this driver?
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={deleteMenuModelClose}>Cancel</Button>
          <Button className='styledButtonSave' variant="contained" type="submit" disabled={isDeleting} onClick={handleConfirmDelete}>
            {
              isDeleting ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> : 'Confirm'
            }
          </Button>
        </DialogActions>
      </Dialog>
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={driverAddState?.message || driverUpdateState?.message || driverDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={driverDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  );
}

export default DriverList;