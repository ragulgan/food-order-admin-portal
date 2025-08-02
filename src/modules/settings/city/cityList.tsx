import * as React from 'react';
import {
  Typography, Box, Button, Table, TableBody,
  TableContainer, TableHead, TableRow, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  Pagination, FormControl, InputLabel, Select, MenuItem, Tooltip,
  IconButton,
  Autocomplete,
  TextField, Chip,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { fetchCity } from '../../../reduxState/settingSlice/citySlice/materCitySlice';
import { clearAddState } from '../../../reduxState/settingSlice/citySlice/cityAddSlice';
import { clearUpdateState } from '../../../reduxState/settingSlice/citySlice/cityUpdateSlice';
import { clearViewState } from '../../../reduxState/settingSlice/citySlice/cityViewSlice';
import { deleteCityById, clearDeleteState } from '../../../reduxState/settingSlice/citySlice/cityDeleteSlice';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert';
import { RootState, AppDispatch } from '../../../reduxState/store';
import errorImage from '../../../assets/images/Error.png'
import editIcon from '../../../assets/images/editIcon.svg'
import deleteIcon from '../../../assets/images/deleteIcon.svg'
import CityAdd from './cityAdd'
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice';
import { fetchState } from '../../../reduxState/settingSlice/stateSlice/materStateSlice';
import { REGEX } from '../../utils/constant';
import _ from 'lodash'

const StyledTableCellCollapse = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  maxWidth: "100px",
  whiteSpace: "normal",
  padding: '16px',
  borderBottom: '0px'
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid #FC8019',
  borderRadius: '3px',
  marginLeft: '10px',
}));

interface StateList {
  id: string;
  cityName: string,
  state: {
    id: string;
    stateName: string;
  },
  status: string;
}

const CityTabs: React.FC<any> = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>('10');
  // const countryData = useSelector((state: RootState) => state.countryDropdown.data);
  const stateData = useSelector((state: RootState) => state.stateList.data);
  const cityDataState = useSelector((state: RootState) => state.cityList);
  const cityAddState = useSelector((state: RootState) => state.cityAdd)
  const cityDeleteState = useSelector((state: RootState) => state.cityDelete)
  const cityUpdateState = useSelector((state: RootState) => state.cityUpdate);

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<StateList | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  const [addState, setAddState] = React.useState<boolean>(false);
  const [selectedCityId, setSelectedCityId] = React.useState<string>('');

  const [isChanged, setIsChanged] = React.useState<any>(false)
  const totalPage = Math.ceil(cityDataState?.size / limit)

  // state for filters
  const [status, setStatus] = React.useState<any>('');
  // const [countryId, setCountryId] = React.useState<any>('');
  const [stateId, setStateId] = React.useState<any>('');
  const [city, setCity] = React.useState<string>('');
  const countryInputRef = React.useRef(null);
  const stateInputRef = React.useRef(null);
  const cityInputRef = React.useRef(null);
  const statusInputRef = React.useRef(null);

  const cityStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  React.useEffect(() => {
    const params: any = { status: 'ACTIVE', sort: 'asc' };
    loadStates();
    dispatch(fetchCountry(params))
    dispatch(fetchState(params))
  }, [page, limit])

  React.useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  //role add alert and update alert
  React.useEffect(() => {
    if (cityAddState && cityAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (cityUpdateState && cityUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [cityAddState, cityUpdateState]);

  //role delete alert
  React.useEffect(() => {
    if (cityDeleteState.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [cityDeleteState]);

  React.useEffect(() => {
    if (cityDeleteState && cityDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [cityDeleteState]);

  const handleReset = () => {
    setStatus('');
    setCity('');
    setStateId('');
    // setCountryId('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchCity({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadStates = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    // if (countryId) params.countryId = countryId.id;
    if (stateId) params.stateId = stateId.id;
    if (city) params.cityName = city;
    dispatch(fetchCity(params));
  }

  const refreshTable = () => {
    loadStates();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddButtonClick = () => {
    setAddState(!addState);
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedCityId(id);
    setAddState(!addState);
  };

  const handleCancelButtonClick = () => {
    setSelectedCityId('')
    dispatch(clearViewState())
    setAddState(!addState);
    refreshTable();
  };

  const handleDeleteClick = (row: StateList) => {
    setSelectedCity(row);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCity) {
      setIsDeleting(true);
      dispatch(deleteCityById(selectedCity.id))
        .then(() => {
          setIsDeleting(false);
          setDeleteModal(false);
          refreshTable();
        })
        .catch(() => {
          setIsDeleting(false);
          setDeleteModal(false);
        });
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
  };

  React.useEffect(() => {
    if (cityAddState && cityAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (cityUpdateState && cityUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((cityDeleteState && cityDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [cityAddState, cityUpdateState, cityDeleteState]);

  const handleName = (e: any) => {
    setCity(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(stateId) || !_.isEmpty(status) || !_.isEmpty(city)) {
      if (event.key === 'Enter') {
        loadStates('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!cityDataState || !cityDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, cityDataState.size);
  };

  const calculateEndIndex = () => {
    if (!cityDataState || !cityDataState.size) return 0;
    const endIndex = Math.min(page * limit, cityDataState.size);
    return endIndex;
  };

  return (
    <React.Fragment>
      {!addState ? (
        <Box className='general-box'>
          <Box sx={{ bgcolor: 'background.paper', position:'sticky', top: "18.7%", zIndex: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" className='role-title inter-med' mb={2}>
                  City Settings
                </Typography>
                <Typography variant="h6" className='role-text inter-med'>
                  Customize Restaurant Availability by Location
                </Typography>
              </Box>
              <Button variant="contained" className='addButton' onClick={handleAddButtonClick}>
                Add
              </Button>
            </Box>
            <Box sx={{ width: "100%" }} mt={1}>
              <Grid container className="content-center" rowGap={1} columnGap={1} columns={12} spacing={2} >
                {/* <Grid item xs={12} sm={5} md={3} lg={2.5} ref={countryInputRef}>
                <Autocomplete
                  disablePortal
                  className='list-autocomplete-field'
                  disableClearable
                  sx={{ backgroundColor: "#fff", borderRadius: '15px' }}
                  id="combo-box-demo"
                  options={countryData}
                  value={countryId}
                  onChange={(_, data: any) => {
                    setCountryId(data)
                  }}
                  getOptionLabel={(option: any) => option.countryName || ''}
                  renderInput={(params) => <TextField {...params} label="Country name" onKeyDown={handleKeyPress} />}
                />
              </Grid> */}
                <Grid item xs={12} sm={5} md={3} lg={2.5} ref={stateInputRef}>
                  <Autocomplete
                    disablePortal
                    className='list-autocomplete-field'
                    disableClearable
                    sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                    id="combo-box-demo"
                    options={stateData}
                    value={stateId}
                    onChange={(_, data: any) => {
                      setStateId(data)
                    }}
                    getOptionLabel={(option: any) => option.stateName || ''}
                    renderInput={(params) => <TextField {...params} label="State name" onKeyDown={handleKeyPress}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      const matchingOption = stateData.find((option: any) =>
                        option.stateName.trim() === pastedText
                      );
                      if (matchingOption) {
                        setStateId(matchingOption);
                      }
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                     />}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={3} lg={2.5}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="City name"
                    inputRef={cityInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={city}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.TEXT;
                      if (!regex.test(e.key) || city.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setCity(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={3} lg={2.5} ref={statusInputRef} onKeyDown={handleKeyPress}>
                  <FormControl className='list-input-field' size="small" variant="outlined" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {cityStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid ml={2} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px' }} xs={0.85} sm={2} md={0.85} lg={0.85}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadStates('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </CustomIconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset() }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </CustomIconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <TableContainer sx={{ mt: 2, borderRadius: '3px' }}>
            <Table sx={{ width: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className='table-header inter-med' align="center">#</TableCell>
                  {/* <TableCell className='table-header inter-med' align="left">Country</TableCell> */}
                  <TableCell className='table-header inter-med' align="left">State</TableCell>
                  <TableCell className='table-header inter-med' align="left">City</TableCell>
                  <TableCell className='table-header inter-med' align="left">Status</TableCell>
                  <TableCell className='table-header inter-med' align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!cityDataState?.loading && cityDataState?.data?.map((row: any, index: any) => {
                  if (row && row.status && row.status !== null) {
                    return (
                      <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCellCollapse align="center">
                          {(page - 1) * limit + index + 1}
                        </StyledTableCellCollapse>
                        {/* <StyledTableCellCollapse align="left">{row.state.country.countryName}</StyledTableCellCollapse> */}
                        <StyledTableCellCollapse align="left">{row && row.state && row.state.stateName ? row.state.stateName : '--'}</StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">{row && row.cityName ? row.cityName : '--'}</StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">
                          {row && row?.status && row.status !== null ?
                            <>
                              {row.status === 'ACTIVE' && (
                                <Chip size='small' label={row.status} className='status-active-chip' variant="outlined" />
                              )}
                              {row.status === 'INACTIVE' && (
                                <Chip size='small' label={row.status} className='status-inactive-chip' variant="outlined" />
                              )}
                              {row.status === 'DELETED' && (
                                <Chip size='small' label={row.status} className='status-deleted-chip' variant="outlined" />
                              )}
                            </> : '--'}
                        </StyledTableCellCollapse>
                        <StyledTableCellCollapse align="center">
                        {row.status !== 'DELETED' ?
                          <>
                          <Button onClick={() => handleEditModalOpen(row?.id)}><img src={editIcon} alt='edit' /></Button>
                          <Button onClick={() => handleDeleteClick(row)}><img src={deleteIcon} alt='delete' /></Button>
                          </> : null}
                        </StyledTableCellCollapse>
                      </TableRow>
                    );
                  } else {
                    return null;
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {!cityDataState?.loading && cityDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Grid item xs={12}>
              <Typography className='error-text' component="h1" variant="h6">
                {cityDataState.message}
              </Typography>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center', bgcolor: 'background.paper' }} position={'sticky'} bottom={0}>
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
              value={limit || '10'}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${cityDataState?.size}`}</Typography>
          </Box>
            <Pagination page={page} count={Math.ceil(cityDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className='signout-list'>
            <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
            <DialogContent>
              Are you sure want to delete this city?
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
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
              message={cityAddState?.message || cityUpdateState?.message || cityDeleteState?.message}
              type="success"
              onClose={handleSnackbarClose}
            />
          )}
          {isErrorSnackbarOpen && (
            <AppSnackbar
              showAlert={isErrorSnackbarOpen}
              message={cityDeleteState?.message}
              type="error"
              onClose={handleSnackbarClose}
            />
          )}
        </Box>) :
        (<CityAdd cityId={selectedCityId} onBack={handleCancelButtonClick} />)
      }
    </React.Fragment>
  )
}

export default CityTabs;