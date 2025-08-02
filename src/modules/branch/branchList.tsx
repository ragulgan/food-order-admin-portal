import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled, alpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box, Table, TableBody, TableContainer, TableHead, TableRow, Toolbar, Typography, Checkbox, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Menu, Pagination,
  Chip, Grid, Stack, ListItemIcon, Avatar, Autocomplete,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import deliveryGif from '../../assets/images/delivery-boy.gif'
import branchImage from '../../assets/images/branch_empty.webp'
import branchDummy from '../../assets/images/Branch.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { AppDispatch, RootState } from '../../reduxState/store';
import { fetchBranch } from '../../reduxState/branchSlice/branchListSlice';
import { endOfDay, startOfDay } from '../utils/dateformat';
import AppSnackbar from '../commonToast/customizeAlert';
import Loading from '../commonToast/loader';
import { clearDeleteState, deleteBranchById } from '../../reduxState/branchSlice/branchDeleteSlice';
import { clearUpdateState } from '../../reduxState/branchSlice/branchUpdateSlice';
import { clearAddState } from '../../reduxState/branchSlice/branchAddSlice';
import { useNavigate } from 'react-router-dom';
import { clearViewState } from '../../reduxState/branchSlice/branchViewSlice';
import { fetchMerchants } from '../../reduxState/merchantSlice/merchantListSlice';
import { REGEX } from '../utils/constant';
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

const BranchList: React.FC<any> = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>('10');

  const dispatch = useDispatch<AppDispatch>();
  const branchList = useSelector((state: RootState) => state.branchList);
  const merchantList = useSelector((state: RootState) => state.merchants.data);
  const branchDeleteState = useSelector((state: RootState) => state.branchDelete);
  const branchAddState = useSelector((state: RootState) => state.branchAdding);
  const branchUpdateState = useSelector((state: RootState) => state.branchUpdate);
  const branchViewState = useSelector((state: RootState) => state.branchView);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setCategoryDriver] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [isChanged, setIsChanged] = useState<any>(false)
  const totalPage = Math.ceil(branchList?.size / limit)
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const branchNameInputRef = useRef(null);
  const autocompleteInputRef = useRef(null);
  const fromDateInputRef = useRef(null);
  const toDateInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState('');
  const [merchantIdSelect, setMerchantIdSelect] = React.useState<any>('');
  const [branchName, setBranchName] = React.useState<string>('');

  const branchStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE' };
    dispatch(fetchMerchants(params))
  }, [])

  //branch add alert and update alert
  useEffect(() => {
    if (branchAddState && branchAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (branchUpdateState && branchUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [branchAddState, branchUpdateState]);

  //branch delete alert
  useEffect(() => {
    if (branchDeleteState && branchDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [branchDeleteState]);

  useEffect(() => {
    if (branchDeleteState && branchDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [branchDeleteState]);

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setMerchantIdSelect('');
    setBranchName('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchBranch({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadCategories = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (fromDate) params.fromDate = startOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.status = status ? status : 'ACTIVE';
    if (merchantIdSelect) params.merchantId = merchantIdSelect.id;
    if (branchName) params.branchName = branchName.trim();
    dispatch(fetchBranch(params));
  }

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  useEffect(() => {
    loadCategories();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadCategories();
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

  // action center
  const handleAddPage = () => {
    dispatch(clearAddState())
    dispatch(clearUpdateState())
    dispatch(clearViewState())
    navigate("/branch/add")
  }

  const handleEditPage = (branch: any) => {
    navigate("/branch/edit", { state: branch.id })
  }

  const handleViewPage = (branch: any) => {
    navigate("/branch/view", { state: branch })
  }

  const handleDeletePage = (branch: any) => {
    setCategoryDriver(branch.id)
    setDeleteModal(true);
  }

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setIsDeleting(true);
      dispatch(deleteBranchById(selectedCategory))
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
    if (branchAddState && branchAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (branchUpdateState && branchUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((branchDeleteState && branchDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [branchAddState, branchUpdateState, branchDeleteState]);

  const handleName = (e: any) => {
    setBranchName(e.target.value)
  }

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(merchantIdSelect) || !_.isEmpty(branchName) || !_.isEmpty(fromDate) || !_.isEmpty(toDate) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadCategories('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!branchList || !branchList.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, branchList.size);
  };

  const calculateEndIndex = () => {
    if (!branchList || !branchList.size) return 0;
    const endIndex = Math.min(page * limit, branchList.size);
    return endIndex;
  };

  return (
    <Fragment>
          <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
            <Toolbar className='toolbar-pad'>
              <Grid container rowGap={1} columnGap={1} columns={14} style={{ justifyContent: "space-between" }}>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2} ref={autocompleteInputRef}>
                  <Autocomplete
                    disablePortal
                    className='list-autocomplete-field'
                    disableClearable
                    sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                    id="combo-box-demo"
                    options={merchantList}
                    value={merchantIdSelect}
                    onChange={(_, data: any) => {
                      setMerchantIdSelect(data);
                    }}
                    getOptionLabel={(option: any) => option.restaurantName || ''}
                    renderInput={(params) => <TextField {...params} label="Merchant name" onKeyDown={handleKeyPress}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      const matchingOption = merchantList.find((option: any) =>
                        option.restaurantName.trim() === pastedText
                      );
                      if (matchingOption) {
                        setMerchantIdSelect(matchingOption);
                      }
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                    />}
                  />
                </Grid>
                <Grid mb={0.5} item xs={14} sm={6.5} md={6.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Branch name"
                    inputRef={branchNameInputRef}
                    sx={{ width: '100%', backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={branchName}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    inputProps={{
                      onKeyPress: (e: any) => {
                        const regex = REGEX.ALPHA_NUMERIC_CHARS;
                        if (!regex.test(e.key) || branchName.length >= 30) {
                          e.preventDefault();
                        }
                      },
                      onPaste: (e: any) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text/plain').trim();
                        setBranchName(pastedText);
                      },
                      onDrop: (e: any) => {
                        e.preventDefault();
                      },
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
                    minDate={dayjs(fromDate)}
                    onChange={(newValue) => setToDate(newValue)}
                    sx={{
                      width: '100%', backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
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
                      {branchStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid mb={0.5} item style={{ display: 'flex', alignItems: 'center' }} xs={6} sm={2.5} md={2.5} lg={2}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadCategories('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid mb={0.5} item style={{ display: 'flex', justifyContent: 'end' }} xs={6} sm={3} md={3} lg={1}>
                  {roleData?.branch?.add ?
                    <Button variant="contained" className='addButton' onClick={handleAddPage}>
                      Add
                    </Button> : null}
                </Grid>
              </Grid>
            </Toolbar>
          </Box>
      {branchList && branchList?.loading ? (<Loading />) :
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
                  <TableCell className='list-header' align='left' padding='normal'>Merchant</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Branch</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Branch location</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Minimum amount</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                  {roleData?.branch?.view || roleData?.branch?.edit || roleData?.branch?.delete ?
                    <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                    null}
                </TableRow>
              </TableHead>
              <TableBody>
                {!branchList?.loading && branchList?.data.map((branch: any, index: any) => {
                  if (branch && branch.status && branch.status !== null) {
                    return (
                      <StyledTableRow
                        key={index}
                      >
                        <TableCell className='list-data' align="center">{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell className='list-data list-table-cell' align="left">{branch && branch?.merchantDetails?.merchantName ? branch?.merchantDetails?.merchantName : '--'}</TableCell>
                        <TableCell className='list-data list-table-cell' align="left">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {branch.image && branch.image?.length > 0 ? (
                              <Avatar alt={`Img`} src={`${process.env.REACT_APP_API_BASE_URL}${branch.image[0].filePath}`} sx={{ marginRight: '10px' }} />
                            ) : (<Avatar alt={`Img`} src={branchDummy} sx={{ marginRight: '10px' }} />)}
                            {branch && branch?.branchName && branch?.branchType ?
                              <>
                                <span>{branch?.branchType === 'MainBranch' ? (<>{branch?.branchName}<span style={{ color: '#FB640A', paddingLeft: '10px' }}>(M)</span></>) :
                                  (branch?.branchName)}</span>
                              </> : '--'
                            }
                          </div>
                        </TableCell>
                        <TableCell className='list-data list-table-cell' align="left">{branch && branch?.branchLocation ? branch?.branchLocation : '--'}</TableCell>
                        <TableCell className='list-data list-table-cell' align="center">{branch && branch?.branchMinAmount ? <>{`${'OMR'} ${branch?.branchMinAmount}`}</> : '--'}</TableCell>
                        <TableCell className='list-data' align="center">
                          {branch && branch.status && branch.status !== null ?
                            <>
                              {branch.status === 'ACTIVE' && (
                                <Chip size='small' label={branch?.status} className='status-active-chip' variant="outlined" />
                              )}
                              {branch.status === 'INACTIVE' && (
                                <Chip size='small' label={branch?.status} className='status-inactive-chip' variant="outlined" />
                              )}
                              {branch.status === 'DELETED' && (
                                <Chip size='small' label={branch?.status} className='status-deleted-chip' variant="outlined" />
                              )}
                            </> : '--'}
                        </TableCell>
                        {roleData?.branch?.view || roleData?.branch?.edit || roleData?.branch?.delete ?
                          <TableCell className='list-data' align="center">
                            {branch.status !== 'DELETED' ?
                              <>
                                <IconButton onClick={(event) => handleMenuOpen(event, branch?.id)}>
                                  <MoreHorizIcon fontSize="small" />
                                </IconButton>
                              </> : null}
                            <Menu
                              anchorEl={anchorEl}
                              open={selectedId === branch?.id}
                              onClose={handleMenuClose}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              transformOrigin={{
                                vertical: 'top', horizontal: 'right',
                              }}
                              className='border-radius-mine'
                            >
                              {roleData?.branch?.view ?
                                <MenuItem onClick={() => handleViewPage(branch?.id)}>
                                  <ListItemIcon>
                                    <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                                  </ListItemIcon>
                                </MenuItem> :
                                null}
                              {roleData?.branch?.edit ?
                                <MenuItem onClick={() => handleEditPage(branch)}>
                                  <ListItemIcon>
                                    <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                                  </ListItemIcon>
                                </MenuItem> :
                                null}
                              {roleData?.branch?.delete ?
                                <MenuItem onClick={() => handleDeletePage(branch)}
                                  // sx={{ display: branch.status === 'DELETED' ? 'none' : 'block' }}
                                >
                                  <ListItemIcon>
                                    <DeleteOutlinedIcon style={{ color: '#FD973B' }} fontSize="small" />
                                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>Delete</Typography>
                                  </ListItemIcon>
                                </MenuItem> :
                                null}
                            </Menu>
                          </TableCell> :
                          null}
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
          {!branchList?.loading && branchList?.data?.length === 0 && 
          <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '15%', height: '15%' }} src={branchImage} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          {!branchList?.loading && branchList?.data?.length > 0 ?
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
              value={limit || '10'}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${branchList?.size}`}</Typography>
            </Box>
            <Pagination page={page} count={Math.ceil(branchList?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          </>: null}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className='signout-list'>
        <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
        <DialogContent>
          Are you sure want to delete this Branch?
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={deleteMenuModelClose}>Cancel</Button>
          <Button className='styledButtonSave' type="submit" disabled={isDeleting} onClick={handleConfirmDelete}>
            {
              isDeleting ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> : 'Confirm'
            }
          </Button>
        </DialogActions>
      </Dialog>
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={branchAddState?.message || branchUpdateState?.message || branchDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={branchDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  );
}

export default BranchList;

