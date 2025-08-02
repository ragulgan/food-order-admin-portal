import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled, alpha } from '@mui/material/styles';
import {
  Box, Table, TableBody, TableContainer, TableHead, TableRow,  Toolbar, Typography, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Menu, Pagination,
  Chip, Grid, ListItemIcon, Avatar, Autocomplete
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import customerImage from '../../../assets/images/customer_empty.webp'
import CustomerAdd from '../customerAdding/customerAddEdit';
import CustomerView from '../customerView/customerview';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomer } from '../../../reduxState/customerSlice/customerListSlice';
import { clearAddState } from '../../../reduxState/customerSlice/customerAddSlice';
import { clearUpdateState } from '../../../reduxState/customerSlice/customerUpdateSlice';
import { deleteCustomerById, clearDeleteState } from '../../../reduxState/customerSlice/customerDeleteSlice';
import { clearViewState } from '../../../reduxState/customerSlice/customerViewSlice'
import { AppDispatch, RootState } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import Loading from '../../commonToast/loader';
import { REGEX } from '../../utils/constant'
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

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  image: any;
  emailId: string;
  createdDate: string;
  status: string;
}

const CustomerListing: React.FC<any> = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof Customer>('createdDate');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState<readonly any[]>([]);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>("10");

  const dispatch = useDispatch<AppDispatch>();
  const customerDataState = useSelector((state: RootState) => state.customer);
  const customerDeleteState = useSelector((state: RootState) => state.customerDelete);
  const customerAddState = useSelector((state: RootState) => state.customerAdd);
  const customerUpdateState = useSelector((state: RootState) => state.customerUpdate);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [isChanged, setIsChanged] = useState<any>(false)
  const totalPage = Math.ceil(customerDataState?.size / limit)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomerUpdate, setSelectedCustomerUpdate] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const customerNameInputRef = useRef(null);
  const emailIdInputRef = useRef(null);
  const mobileNumnerInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [status, setStatus] = React.useState('');

  const customerStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
    // { value: 'DELETED', name: 'Deleted' }
  ]

  const rowPerPage = [
    { label: '10' },
    { label: '20' },
    { label: '30' }
  ]

 //customer add alert and update alert
 useEffect(() => {
  if (customerAddState && customerAddState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  } else if (customerUpdateState && customerUpdateState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  }
}, [customerAddState, customerUpdateState]);

//customer delete alert
useEffect(() => {
  if (customerDeleteState && customerDeleteState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  }
}, [customerDeleteState]);

useEffect(() => {
  if (customerDeleteState && customerDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
  }
}, [customerDeleteState]);

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setStatus('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchCustomer({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadCustomers = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (name) params.name = name.trim();
    if (email) params.emailId = email.trim();
    if (phone) params.phone = phone.trim();
    if (status) params.status = status ? status : 'ACTIVE';
    dispatch(fetchCustomer(params));
  }

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  useEffect(() => {
    loadCustomers();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadCustomers();
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
  const handleAddModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleAddModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setIsModalOpen(false);
      setSelectedCustomerId('')
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  const handleViewModalOpen = (id: string) => {
    setSelectedCustomerId(id);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setSelectedCustomerId('');
      setIsViewModalOpen(false);
      dispatch(clearViewState())
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  }

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      setIsDeleting(true);
      dispatch(deleteCustomerById(selectedCustomer.id))
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
    if (customerAddState && customerAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (customerUpdateState && customerUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((customerDeleteState && customerDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [customerAddState, customerUpdateState, customerDeleteState]);

  const handleName = (e: any) => {
    setName(e.target.value)
  }
  const handleEmailId = (e: any) => {
    setEmail(e.target.value)
  }
  const handlePhoneNo = (e: any) => {
    setPhone(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(name) || !_.isEmpty(email) || !_.isEmpty(phone) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadCustomers('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!customerDataState || !customerDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, customerDataState.size);
  };

  const calculateEndIndex = () => {
    if (!customerDataState || !customerDataState.size) return 0;
    const endIndex = Math.min(page * limit, customerDataState.size);
    return endIndex;
  };


  return (
    <Fragment>
          <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
            <Toolbar className='toolbar-pad'>
              <Grid container rowGap={1} columnGap={1} columns={12} style={{ justifyContent: "space-between" }}>
                <Grid item mb={0.5} xs={12} sm={5.5} md={5.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Customer Name"
                    inputRef={customerNameInputRef}
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
                <Grid item mb={0.5} xs={12} sm={5.5} md={5.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Email"
                    inputRef={emailIdInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={email}
                    onChange={handleEmailId}
                    onKeyDown={handleKeyPress}
                    onKeyPress={(e: any) => {
                      if (email.length >= 50) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain').trim();
                      setEmail(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item mb={0.5} xs={12} sm={5.5} md={5.5} lg={2}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Phone No"
                    inputRef={mobileNumnerInputRef}
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={phone}
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
                      setPhone(pastedText);
                    }}
                    onDrop={(e: any) => {
                      e.preventDefault();
                    }}
                  />
                </Grid>
                <Grid item mb={0.5} xs={12} sm={5.5} md={5.5} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                  <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {customerStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item mb={0.5} style={{ display: 'flex', alignItems: 'center' }} xs={5.5} sm={5} md={5} lg={2}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadCustomers('search'); }}>
                      <SearchIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton className='custom-icon-button' size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                      <RefreshIcon style={{ color: "#FB640A" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                {/* <Grid item mb={0.5} style={{ display: 'flex', justifyContent: 'end' }} xs={5.5} sm={5} md={5} lg={1}>
                  {roleData?.customers?.add === true ?
                    <Button variant="contained" className='addButton' onClick={handleAddModalOpen}>
                      Add
                    </Button> :
                    null}
                </Grid> */}
              </Grid>
            </Toolbar>
          </Box>
          <CustomerAdd customerId={selectedCustomerId} isOpen={isModalOpen} onClose={handleAddModalClose} handleReset={handleReset}  />
          {customerDataState?.loading ? (<Loading />) :
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
                  <TableCell className='list-header' align='left' padding='normal'>Customer Name</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>PhoneNumber</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Email</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                  {roleData?.customers?.view || roleData?.customers?.edit || roleData?.customers?.delete ?
                    <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                    null}
                </TableRow>
              </TableHead>
              <TableBody>
                {!customerDataState.loading && customerDataState.data.map((customer: any, index: any) => {
                   if (customer && customer.status && customer.status !== null) {
                  return (
                    <StyledTableRow
                      key={customer.id}
                    >
                      <TableCell className='list-data' align="center">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell align="center">
                        {customer && customer.image && customer.image.id !== null ? (
                          <Avatar alt="Img" src={`${process.env.REACT_APP_API_BASE_URL}${customer?.image?.filePath}`} />
                        ) : (
                          <Avatar />
                        )}
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{customer && customer.firstName ? customer.firstName : '--'}</TableCell>

                      <TableCell className='list-data list-table-cell' align="left">{customer && customer.mobileNumber ? customer.mobileNumber.replace(/[^\d]/g, '').replace(/^91/, '') : '--'}</TableCell>

                      <TableCell className='list-data list-table-cell' align="left">{customer && customer.emailId && customer.emailId !== null ? customer.emailId : '--'}</TableCell>

                      <TableCell className='list-data' align="center">
                        {customer && customer.status && customer.status !== null ?
                          <>
                            {customer.status === 'ACTIVE' && (
                              <Chip size='small' label={customer?.status} className='status-active-chip' variant="outlined" />
                            )}
                            {customer.status === 'INACTIVE' && (
                              <Chip size='small' label={customer?.status} className='status-inactive-chip' variant="outlined" />
                            )}
                            {customer.status === 'DELETED' && (
                              <Chip size='small' label={customer?.status} className='status-deleted-chip' variant="outlined" />
                            )}
                          </> : '--'}
                      </TableCell>
                      {roleData?.customers?.view || roleData?.customers?.edit || roleData?.customers?.delete ?
                        <TableCell className='list-data' align="center">
                          <IconButton onClick={(event) => handleMenuOpen(event, customer.id)}>
                            <MoreHorizIcon fontSize="small" />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={selectedId === customer.id}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{
                              vertical: 'top', horizontal: 'right',
                            }}
                            className='border-radius-mine'
                          >
                            {roleData?.customers?.view ?
                              <MenuItem onClick={() => handleViewModalOpen(customer.id)}>
                                <ListItemIcon>
                                  <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                  <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                                </ListItemIcon>
                              </MenuItem> :
                              null}
                            {/* {roleData?.customers?.edit ?
                              <MenuItem onClick={() => handleEditModalOpen(customer?.id)}>
                                <ListItemIcon>
                                  <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                  <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                                </ListItemIcon>
                              </MenuItem> :
                              null} */}
                            {/* {roleData?.customers?.delete ?
                              <MenuItem onClick={() => handleDeleteClick(customer)} sx={{
                                display: customer.status === 'DELETED' ? 'none' : 'block'
                              }}>
                                <ListItemIcon>
                                  <DeleteOutlinedIcon style={{ color: '#FD973B' }} fontSize="small" />
                                  <Typography className='list-data' style={{ paddingLeft: '8px' }}>Delete</Typography>
                                </ListItemIcon>
                              </MenuItem> :
                              null} */}
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
          {!customerDataState?.loading && customerDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '15%', height: '15%' }} src={customerImage} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          {!customerDataState?.loading && customerDataState?.data?.length > 0 ?
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
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${customerDataState?.size}`}</Typography>
            </Box>
            <Pagination page={page} count={Math.ceil(customerDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          Are you sure want to delete this customer?
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
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
          message={customerAddState?.message || customerUpdateState?.message || customerDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={customerDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
      <CustomerView customerId={selectedCustomerId ?? "0"} isOpen={isViewModalOpen} onClose={handleViewModalClose} />
    </Fragment>
  );
}

export default CustomerListing;