import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles';
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton,
  TableContainer, Table, Chip, ListItemIcon, Menu, TableBody, TableHead, TableRow,
  Typography, Box, Toolbar, Pagination, Autocomplete
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import noOrder from '../../../assets/images/no_order.webp'
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { dateStringToObjectByMonthNumber, endOfDay, startOfDay } from '../../utils/dateformat';
import dayjs, { Dayjs } from 'dayjs';
import { fetchOrders } from '../../../reduxState/orderSlice/orderListSlice';
import { clearViewState } from '../../../reduxState/orderSlice/orderViewSlice';
import { clearUpdateState } from '../../../reduxState/orderSlice/orderUpdateSlice';
import OrderEdit from '../orderUpdate/orderUpdate';
import Loading from '../../commonToast/loader';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import { useNavigate } from 'react-router-dom';
import _ from 'lodash'
import { REGEX, Role_Types } from '../../utils/constant'
import { IMaskInput } from 'react-imask';
import { onMessageListener } from '../../../firebase/firebaseConfig';

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

const MerchantOrder: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const orderDataState = useSelector((state: RootState) => state.orders);
  const orderUpdateState = useSelector((state: RootState) => state.orderUpdate);
  const [proId, setProId] = useState<any>(false)
  const [isChanged, setIsChanged] = useState<any>(false)

  // roles admin
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState<string>('');
  const [bookId, setBookId] = React.useState<string>('')
  const [customerName, setCustomerName] = React.useState<string>('')
  const orderIdInputRef = useRef(null);
  const customerNameInputRef = useRef(null);
  const fromDateInputRef = useRef(null);
  const toDateInputRef = useRef(null);
  const statusInputRef = useRef(null);

  const totalPage = Math.ceil(orderDataState?.size / limit)

  const orderStatus = [
    { value: 'OrderPlaced', name: 'Placed' },
    { value: 'OrderConfirmed', name: 'Confirmed' },
    { value: 'OrderPickedUp', name: 'PickedUp' },
    { value: 'OrderDelivered', name: 'Delivered' },
    { value: 'OrderReceived', name: 'Received' },
    { value: 'OrderCancelled', name: 'Cancelled' },
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]

   //order update alert
   useEffect(() => {
    if (orderUpdateState && orderUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [orderUpdateState]);

  //order update alert
  useEffect(() => {
    if (orderUpdateState && orderUpdateState?.error === true) {
      setIsSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearUpdateState());
      }, 2000)
    }
  }, [orderUpdateState]);

  /* this will load merchant intially as page value initated
  and also load the merchant for page changes */
  useEffect(() => {
    loadMerchants();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  useEffect(() => {
    const listenForMessages = async () => {
      await onMessageListener()
        .then((payload: any) => {
          console.log('Received payload:', payload);
          const relevantStatuses = ['ACCEPTED'];
          if (relevantStatuses.includes(payload && payload?.data && payload?.data?.orderStatus)) {
            window.location.reload();
          }
        })
        .catch((err) => console.log('Failed to receive message ', err));
    };

    listenForMessages();
  }, []);

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const loadMerchants = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit };
    if (bookId) params.orderId =  proId && bookId && !_.isEmpty(bookId) ? '#ORD' + bookId.trim() : '';
    if (customerName) params.customerName = customerName.trim();
    if (fromDate) params.fromDate = startOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.orderSts = status;
    dispatch(fetchOrders(params));
  }

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setCustomerName('');
    setBookId('');
    setPage(1);
    setLimit(limit);
    setProId(false)
    setIsChanged(false)
    dispatch(fetchOrders({ pageNo: page, size: limit }));
  };

  const refreshTable = () => {
    loadMerchants();
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

  const handleEditModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsModalOpen(false);
      setSelectedOrderId('')
      dispatch(clearViewState());
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const handleViewModalOpen = (order: any) => {
    navigate("/orders/view", { state: order.id })
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    if (orderUpdateState && orderUpdateState?.status === "succeeded") {
      setTimeout(()=> {
        dispatch(clearUpdateState());
      }, 2000)
    }
  }, [orderUpdateState]);

  const handleChangeBookId = (e: any) => {
    setBookId(e.target.value)
  }

  const handleName = (e: any) => {
    setCustomerName(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(bookId) || !_.isEmpty(customerName) || !_.isEmpty(fromDate) || !_.isEmpty(toDate) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadMerchants('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!orderDataState || !orderDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, orderDataState.size);
  };

  const calculateEndIndex = () => {
    if (!orderDataState || !orderDataState.size) return 0;
    const endIndex = Math.min(page * limit, orderDataState.size);
    return endIndex;
  };

  return (
    <Fragment>
          <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
            <Toolbar className='toolbar-pad'>
              <Grid container rowGap={1} columnGap={1} columns={12} style={{ justifyContent: "space-between" }}>
                <Grid item xs={12} sm={5.5} md={5.5} lg={2} mb={0.5} className='order-id-relative'>
                  {proId ?
                    <span className='order-id-absolute'>#ORD
                    </span> : null}
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="BookId"
                    inputRef={orderIdInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={bookId}
                    onChange={handleChangeBookId}
                    onKeyDown={handleKeyPress}
                    onClick={() => setProId(true)}
                    onBlur={bookId && !_.isEmpty(bookId) ? () => setProId(true) : () => setProId(false)}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setBookId(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                    InputProps={{
                      autoComplete: 'off',
                      inputComponent: IMaskInput as any,
                      inputProps: {
                        mask: '        0000',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.5} md={5.5} lg={2} mb={0.5}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Customer name"
                    inputRef={customerNameInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={customerName}
                    onChange={handleName}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.TEXT;
                      if (!regex.test(e.key) || customerName.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setCustomerName(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.5} md={5.5} lg={2} mb={0.5} ref={fromDateInputRef} onKeyDown={handleKeyPress}>
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
                <Grid item xs={12} sm={5.5} md={5.5} lg={2} mb={0.5} ref={toDateInputRef} onKeyDown={handleKeyPress}>
                  <DatePicker label="To Date" className='date-picker'
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
                    value={toDate || null} 
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
                <Grid item xs={12} sm={5.5} md={5.5} lg={2} mb={0.5} ref={statusInputRef} onKeyDown={handleKeyPress}>
                  <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                    <InputLabel>Order Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {orderStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5.5} md={5.5} lg={1} mb={0.5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadMerchants('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </Box>
          <OrderEdit orderId={selectedOrderId} isOpen={isModalOpen} onClose={handleEditModalClose} />
         {orderDataState && orderDataState?.loading ? (<Loading />) :
          <>
          <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
            <Table
              sx={{ maxWidth: "auto" }}
              aria-labelledby="tableTitle"
            >
              <TableHead>
                <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                  <TableCell className='list-header' align='center' padding='normal'>#</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Booking ID</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Customer Name</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>No of Items</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Final Amount</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Order Date</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Order Status</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Picked by</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!orderDataState.loading && orderDataState.data.map((order: any, index: any) => {
                  return (
                    <StyledTableRow
                      key={order.id}
                    >
                      <TableCell className='list-data' align="center">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{order && order?.orderId ? order?.orderId : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">
                        {order && order.customerDetails && order.customerDetails.customerName ? order.customerDetails.customerName : '--'}
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="center">{order && order?.totItems ? order?.totItems: '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="center">{order && order.totAmt ? `${'OMR'} ${order.totAmt}` : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{order && order.createdDate ? dateStringToObjectByMonthNumber(order.createdDate) : '--'}</TableCell>
                      <TableCell className='list-data' align="center">
                        {order && order.orderSts && order.orderSts !== null ?
                          <>
                            {order.orderSts === 'OrderDelivered' && (
                              <Chip size='small' label={'DELIVERED'} className='od-color' />
                            )}
                            {order.orderSts === 'OrderCancelled' && (
                              <Chip size='small' label={'CANCELLED'} className='oc-color' />
                            )}
                            {order.orderSts === 'OrderPlaced' && (
                              <Chip size='small' label={'PLACED'} className='op-color' />
                            )}
                            {order.orderSts === 'OrderPicked' && (
                              <Chip size='small' label={'PICKED'} className='opickup-color' />
                            )}
                            {order.orderSts === 'OrderConfirmed' && (
                              <Chip size='small' label={'CONFIRMED'} className='ocd-color' />
                            )}
                            {order.orderSts === 'OrderIsPreparing' && (
                              <Chip size='small' label={'PREPARING'} className='oprep-color' />
                            )}
                            {order?.orderSts === 'OrderOutForDelivery' && (
                              <Chip size='small' className='order-status ood-color' label={'OUT FOR DELIVERY'} />
                            )}
                            {order?.orderSts === 'OrderReady' && (
                              <Chip size='small' className='order-status or-color' label={'READY'} />
                            )}
                            {order?.orderSts === 'OrderReceived' && (
                              <Chip size='small' className='order-status orr-color' label={'RECEIVED'} />
                            )}
                          </> : '--'}
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="left">
                        {order && order.driverDetails && order.driverDetails.driverName ? order.driverDetails.driverName : '--'}
                      </TableCell>
                      <TableCell className='list-data' align="center">
                        <IconButton onClick={(event) => handleMenuOpen(event, order?.id)}>
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === order?.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          <MenuItem onClick={() => handleViewModalOpen(order)}>
                            <ListItemIcon>
                              <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                              <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                            </ListItemIcon>
                          </MenuItem>
                          {roles_data?.role !== Role_Types.Admin && roles_data?.role !== Role_Types.Merchant && order.orderSts !== 'OrderDelivered' && order.orderSts !== 'OrderPicked' && order.orderSts !== 'OrderCancelled' && order.orderSts !== 'OrderConfirmed' && order.orderSts !== 'OrderReceived' ?
                            <MenuItem onClick={() => handleEditModalOpen(order?.id)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> : null}
                        </Menu>
                      </TableCell> 
                    </StyledTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>}
          {!orderDataState?.loading && orderDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '15%', height: '15%' }} src={noOrder} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          {!orderDataState?.loading && orderDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', py:3, px: 2.5, }} position={'sticky'} bottom={0}>
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
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${orderDataState?.size}`}</Typography>
          </Box>
            <Pagination page={page} count={Math.ceil(orderDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          </>:null}
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={orderUpdateState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  );
}

export default MerchantOrder;