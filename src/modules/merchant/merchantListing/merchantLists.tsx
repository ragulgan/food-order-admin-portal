import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box, Grid, Toolbar, IconButton, Tooltip, Button, TextField, TableContainer, Table, TableHead,
  Select, MenuItem, InputLabel, FormControl, Pagination, TableRow, TableBody, Autocomplete, Typography
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import noMerchant from '../../../assets/images/no_merchants.webp'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchants } from '../../../reduxState/merchantSlice/merchantListSlice';
import { clearAddState } from '../../../reduxState/merchantSlice/merchantAddSlice';
import { clearUpdateState } from '../../../reduxState/merchantSlice/merchantUpdateSlice';
import { clearDeleteState } from '../../../reduxState/merchantSlice/merchantDeleteSlice';
import { AppDispatch, RootState } from '../../../reduxState/store';
import AppSnackbar from '../../commonToast/customizeAlert';
import dayjs, { Dayjs } from 'dayjs';
import { endOfDay, startOfDay } from "../../utils/dateformat"
import { useNavigate } from 'react-router-dom';
import Loading from '../../commonToast/loader';
import Row from './merchantTable';
import { REGEX, Role_Types } from '../../utils/constant'
import _ from 'lodash'

const MerchantList: React.FC<any> = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const merchantDataState = useSelector((state: RootState) => state.merchants);
  const merchantDeleteState = useSelector((state: RootState) => state.merchantDelete);
  const merchantAddState = useSelector((state: RootState) => state.merchantAdd);
  const merchantUpdateState = useSelector((state: RootState) => state.merchantUpdate);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

  // roles admin
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const merchantNameInputRef = React.useRef(null);
  const founderNameInputRef = React.useRef(null);
  const fromDateInputRef = React.useRef(null);
  const toDateInputRef = React.useRef(null);
  const statusInputRef = React.useRef(null);

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState('');
  const [merchantName, setMerchantName] = React.useState<string>('');
  const [founderName, setFounderName] = React.useState<string>('');
  const [isChanged, setIsChanged] = React.useState<any>(false)
  const totalPage = Math.ceil(merchantDataState?.size / limit)

  const merchantStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]
  //merchant add alert and update alert
  React.useEffect(() => {
    if (merchantAddState && merchantAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (merchantUpdateState && merchantUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [merchantAddState, merchantUpdateState, merchantDataState]);

  //merchant delete alert
  React.useEffect(() => {
    if (merchantDeleteState && merchantDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [merchantDeleteState, merchantDataState]);

  React.useEffect(() => {
    if (merchantDeleteState && merchantDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [merchantDeleteState]);

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setMerchantName('');
    setFounderName('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchMerchants({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadMerchants = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (merchantName) params.merchantName = merchantName.trim();
    if (founderName) params.contactName = founderName.trim();
    if (fromDate) params.fromDate = startOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.status = status ? status : 'ACTIVE';
    dispatch(fetchMerchants(params));
  }

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  React.useEffect(() => {
    loadMerchants();
  }, [page, limit])

  React.useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadMerchants();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Action Events
  const handleAddModalOpen = () => {
    navigate("/merchants/add")
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
  };

  React.useEffect(() => {
    if (merchantAddState && merchantAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (merchantUpdateState && merchantUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((merchantDeleteState && merchantDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [merchantAddState, merchantUpdateState, merchantDeleteState]);

  const handleName = (e: any) => {
    setMerchantName(e.target.value)
  }

  const handleFounderName = (e: any) => {
    setFounderName(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(merchantName) || !_.isEmpty(founderName) || !_.isEmpty(fromDate) || !_.isEmpty(toDate) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadMerchants('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!merchantDataState || !merchantDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, merchantDataState.size);
  };

  const calculateEndIndex = () => {
    if (!merchantDataState || !merchantDataState.size) return 0;
    const endIndex = Math.min(page * limit, merchantDataState.size);
    return endIndex;
  };

  return (
    <React.Fragment>
          <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
            <Toolbar className='toolbar-pad'>
              <Grid container rowGap={1} columnGap={1} columns={14} style={{ justifyContent: "space-between" }}>
                <Grid item mb={0.5} xs={14} sm={6.5} md={6.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Merchant name"
                    inputRef={merchantNameInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={merchantName}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.ALPHA_NUMERIC;
                      if (!regex.test(e.key) || merchantName.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setMerchantName(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item mb={0.5} xs={14} sm={6.5} md={6.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Founder name"
                    inputRef={founderNameInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={founderName}
                    onChange={handleFounderName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.ALPHA_SOME_CHARS_SPACE;
                      if (!regex.test(e.key) || founderName.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setFounderName(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item mb={0.5} xs={14} sm={6.5} md={6.5} lg={2} ref={fromDateInputRef} onKeyDown={handleKeyPress}>
                  <DatePicker label="From Date" className='date-picker'
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    value={fromDate || null} 
                    onChange={(newValue) => setFromDate(newValue)}
                    sx={{
                      width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                      '& .MuiInputLabel-root': {
                        marginTop: '-7px',
                        marginBottom: '7px',
                      }
                    }} />
                </Grid>
                <Grid item mb={0.5} xs={14} sm={6.5} md={6.5} lg={2} ref={toDateInputRef} onKeyDown={handleKeyPress}>
                  <DatePicker label="To Date" className='date-picker'
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    value={toDate || null} 
                    minDate={dayjs(fromDate)}
                    onChange={(newValue) => setToDate(newValue)}
                    sx={{
                      width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                      '& .MuiInputLabel-root': {
                        marginTop: '-7px',
                        marginBottom: '7px',
                      }
                    }} />
                </Grid>
                <Grid item mb={0.5} xs={14} sm={6.5} md={6.5} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                  <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {merchantStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item mb={0.5} style={{ display: 'flex', alignItems: 'center' }} xs={6} sm={2.5} md={2.5} lg={2}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadMerchants('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset() }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item mb={0.5} style={{ display: 'flex', justifyContent: 'end' }} xs={6} sm={3} md={3} lg={1}>
                  {roles_data?.role === Role_Types.Admin ?
                    <Button variant="contained" className='addButton' onClick={handleAddModalOpen}>
                      Add
                    </Button> :
                    null}
                </Grid>
              </Grid>
            </Toolbar>
          </Box>
          {merchantDataState && merchantDataState?.loading ? (<Loading />) :
          <>
          <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
            <Table aria-label="collapsible table" sx={{ maxWidth: "auto" }}>
              <TableHead>
                <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                <TableCell className='list-header' align='center' padding='normal'>#</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Merchant ID</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Merchant Name</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Founder Name</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Contact No</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                  {roleData?.merchants?.view || roleData?.merchants?.edit || roleData?.merchants?.delete ?
                    <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                    null}
                  {/* <TableCell /> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {!merchantDataState?.loading && merchantDataState?.data?.map((row: any, index: any) => (
                  <Row key={row.id} merchant={row} page={page} index={index} limit={limit} refreshTable={refreshTable} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </>}
          {!merchantDataState?.loading && merchantDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '15%', height: '15%' }} src={noMerchant} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          {!merchantDataState?.loading && merchantDataState?.data?.length > 0 ?
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
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${merchantDataState?.size}`}</Typography>
            </Box>
            <Pagination page={page} count={Math.ceil(merchantDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={merchantAddState?.message || merchantUpdateState?.message || merchantDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={merchantDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment>
  );
}

export default MerchantList;