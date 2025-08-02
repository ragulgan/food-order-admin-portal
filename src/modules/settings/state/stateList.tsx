import * as React from 'react';
import {
  Typography, Box, Button, Table, TableBody,
  TableContainer, TableHead, TableRow, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  Pagination, FormControl, InputLabel, Select, MenuItem, Tooltip,
  IconButton,
  TextField,
  Autocomplete, Chip,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { fetchState } from '../../../reduxState/settingSlice/stateSlice/materStateSlice';
import { clearAddState } from '../../../reduxState/settingSlice/stateSlice/stateAddSlice';
import { clearUpdateState } from '../../../reduxState/settingSlice/stateSlice/stateUpdateSlice';
import { clearViewState } from '../../../reduxState/settingSlice/stateSlice/stateViewSlice';
import { deleteStateById, clearDeleteState } from '../../../reduxState/settingSlice/stateSlice/stateDeleteSlice';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert';
import { RootState, AppDispatch } from '../../../reduxState/store';
import errorImage from '../../../assets/images/Error.png'
import editIcon from '../../../assets/images/editIcon.svg'
import deleteIcon from '../../../assets/images/deleteIcon.svg'
import StateAdd from './stateAdd'
import { fetchCountry } from '../../../reduxState/settingSlice/countrySlice/countrySlice';
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
  stateName: string,
  country: {
    id: string;
    countryName: string;
  },
  status: string;
}

const StateTabs: React.FC<any> = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>('10');
  const countryData = useSelector((state: RootState) => state.countryDropdown.data);
  const stateDataState = useSelector((state: RootState) => state.stateList);
  const regionAddState = useSelector((state: RootState) => state.stateAdd)
  const regionDeleteState = useSelector((state: RootState) => state.stateDelete)
  const regionUpdateState = useSelector((state: RootState) => state.stateUpdate);

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState<StateList | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  const [addState, setAddState] = React.useState<boolean>(false);
  const [selectedStateId, setSelectedStateId] = React.useState<string>('');

  const [isChanged, setIsChanged] = React.useState<any>(false)
  const totalPage = Math.ceil(stateDataState?.size / limit)

  // state for filters
  const [status, setStatus] = React.useState<any>('');
  const [countryId, setCountryId] = React.useState<any>('');
  const [state, setState] = React.useState<string>('');
  const countryInputRef = React.useRef(null);
  const stateInputRef = React.useRef(null);
  const statusInputRef = React.useRef(null);

  const stateStatus = [
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
  }, [page, limit])

  React.useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  //role add alert and update alert
  React.useEffect(() => {
    if (regionAddState && regionAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (regionUpdateState && regionUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [regionAddState, regionUpdateState]);

  //role delete alert
  React.useEffect(() => {
    if (regionDeleteState && regionDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [regionDeleteState]);

  React.useEffect(() => {
    if (regionDeleteState && regionDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [regionDeleteState]);

  const handleReset = () => {
    setStatus('');
    setState('');
    setCountryId('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchState({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadStates = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    if (countryId) params.countryId = countryId.id;
    if (state) params.stateName = state;
    dispatch(fetchState(params));
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
    setSelectedStateId(id);
    setAddState(!addState);
  };

  const handleCancelButtonClick = () => {
    setSelectedStateId('')
    dispatch(clearViewState())
    setAddState(!addState);
    refreshTable();
  };

  const handleDeleteClick = (row: StateList) => {
    setSelectedState(row);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedState) {
      setIsDeleting(true);
      dispatch(deleteStateById(selectedState.id))
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
    if (regionAddState && regionAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (regionUpdateState && regionUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((regionDeleteState && regionDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [regionAddState, regionUpdateState, regionDeleteState]);

  const handleName = (e: any) => {
    setState(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(countryId) || !_.isEmpty(state) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadStates('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!stateDataState || !stateDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, stateDataState.size);
  };

  const calculateEndIndex = () => {
    if (!stateDataState || !stateDataState.size) return 0;
    const endIndex = Math.min(page * limit, stateDataState.size);
    return endIndex;
  };

  return (
    <React.Fragment>
      {!addState ? (
        <Box className='general-box'>
          <Box sx={{ bgcolor: 'background.paper', position:'sticky', top: "18.7%", zIndex: 2  }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" className='role-title inter-med' mb={2}>
                  State Settings
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
              <Grid container className="content-center" rowGap={1} columnGap={1} columns={12} spacing={2}>
                <Grid item xs={12} sm={5} md={3} lg={2.5} ref={countryInputRef}>
                  <Autocomplete
                    disablePortal
                    className='list-autocomplete-field'
                    disableClearable
                    sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                    id="combo-box-demo"
                    options={countryData}
                    value={countryId}
                    onChange={(_, data: any) => {
                      setCountryId(data)
                    }}
                    getOptionLabel={(option: any) => option.countryName || ''}
                    renderInput={(params) => <TextField {...params} label="Country name" onKeyDown={handleKeyPress} 
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      const matchingOption = countryData.find((option: any) =>
                        option.countryName.trim() === pastedText
                      );
                      if (matchingOption) {
                        setCountryId(matchingOption);
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
                    label="State name"
                    inputRef={stateInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={state}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.TEXT;
                      if (!regex.test(e.key) || state.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setState(pastedText);
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
                      {stateStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
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
                  <TableCell className='table-header inter-med' align="left">Country</TableCell>
                  <TableCell className='table-header inter-med' align="left">State</TableCell>
                  <TableCell className='table-header inter-med' align="left">Status</TableCell>
                  <TableCell className='table-header inter-med' align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!stateDataState?.loading && stateDataState?.data?.map((row: any, index: any) => {
                  if (row && row.status && row.status !== null) {
                    return (
                      <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCellCollapse align="center">
                          {(page - 1) * limit + index + 1}
                        </StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">{row && row.country && row.country.countryName ? row.country.countryName : '--'}</StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">{row && row.stateName ? row.stateName : '--'}</StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">
                          {row && row.status && row.status !== null ?
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
          {!stateDataState?.loading && stateDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Grid item xs={12}>
              <Typography className='error-text' component="h1" variant="h6">
                {stateDataState.message}
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
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${stateDataState?.size}`}</Typography>
          </Box>
            <Pagination page={page} count={Math.ceil(stateDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
              Are you sure want to delete this state?
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
              message={regionAddState?.message || regionUpdateState?.message || regionDeleteState?.message}
              type="success"
              onClose={handleSnackbarClose}
            />
          )}
          {isErrorSnackbarOpen && (
            <AppSnackbar
              showAlert={isErrorSnackbarOpen}
              message={regionDeleteState?.message}
              type="error"
              onClose={handleSnackbarClose}
            />
          )}
        </Box>) :
        (<StateAdd stateId={selectedStateId} onBack={handleCancelButtonClick} />)
      }
    </React.Fragment>
  )
}

export default StateTabs;