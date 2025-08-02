import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box, Table, TableBody, TableContainer, TableHead, TableRow, Toolbar, Typography, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Menu, Pagination,
  Chip, Grid, ListItemIcon, Avatar, Autocomplete,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import noProduct from '../../../../assets/images/no_product.webp'
import Food from '../../../../assets/images/Food.svg'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../../reduxState/merchantItemSlice/product/productListSlice';
import { deleteProductById, clearState } from '../../../../reduxState/merchantItemSlice/product/productDeleteSlice';
import { AppDispatch, RootState } from '../../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { startOfDay, endOfDay } from '../../../utils/dateformat'
import Loading from '../../../commonToast/loader';
import { fetchBranch } from '../../../../reduxState/branchSlice/branchListSlice';
import { fetchCategories } from '../../../../reduxState/merchantItemSlice/category/categoryListSlice';
import { REGEX, Role_Types } from '../../../utils/constant';
import _ from 'lodash'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  maxWidth: "150px",
  whiteSpace: "normal",
  padding: '16px',
}));

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


const CustomIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid #FC8019',
  borderRadius: '3px',
  marginLeft: '10px',
}));

interface ProductList {
  id: string;
  productName: string;
  merchantDetails: {
    id: string;
    merchantName: string;
  };
  categoryDetails: {
    id: string;
    categoryName: string;
  };
  branchDetails: {
    id: string;
    branchName: string;
  };
  shiftTimes: [
    {
      id: string;
      name: string;
      fromTime: string;
      toTime: string;
    }
  ];
  description: string;
  images: string[];
  status: string;
  createdDate: string;
}

const ProductList: React.FC<any> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof ProductList>('createdDate');
  const [selected, setSelected] = useState<readonly any[]>([]);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");

  const branchList = useSelector((state: RootState) => state.branchList.data);
  const categoryList = useSelector((state: RootState) => state.categoryList.data);
  const productDataState = useSelector((state: RootState) => state.productList);
  const productAddState = useSelector((state: RootState) => state.productAdd);
  const productUpdateState = useSelector((state: RootState) => state.productUpdate);
  const productDeleteState = useSelector((state: RootState) => state.productDelete);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  // roles
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const branchNameInputRef = useRef(null);
  const categoryNameInputRef = useRef(null);
  const productNameInputRef = useRef(null);
  const fromDateInputRef = useRef(null);
  const toDateInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState('');
  const [branchId, setBranchId] = React.useState<any>('');
  const [categoryId, setCategoryId] = React.useState<any>('');
  const [search, setSearch] = React.useState<string>('');
  const [isChanged, setIsChanged] = React.useState<any>(false)
  const totalPage = Math.ceil(productDataState?.size / limit)

  const productStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10'},
    { label: '20'},
    { label: '30'}
  ]

  React.useEffect(() => {
    const params: any = { status: 'ACTIVE' };
    dispatch(fetchBranch(params))
    dispatch(fetchCategories(params))
  }, [])

  useEffect(() => {
    if (productDeleteState && productDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [productDeleteState]);

  useEffect(() => {
    if (productDeleteState && productDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearState());
      }, 2000)
    }
  }, [productDeleteState]);

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setBranchId('');
    setCategoryId('');
    setSearch('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchProducts({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadProducts = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (fromDate) params.fromDate = startOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.status = status ? status : 'ACTIVE';
    if (branchId) params.branchId = branchId.id;
    if (categoryId) params.categoryId = categoryId.id;
    if (search) params.productName = search.trim();
    dispatch(fetchProducts(params));
  }

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  useEffect(() => {
    loadProducts();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadProducts();
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
    navigate("/merchant-items/product/add")
  };


  const handleEditModalOpen = (product: any) => {
    navigate("/merchant-items/product/edit", { state: product.id })
  };

  const handleViewModalOpen = (product: any) => {
    navigate("/merchant-items/product/view", { state: product.id })
  };

  const handleDeleteClick = (product: ProductList) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setIsDeleting(true);
      dispatch(deleteProductById(selectedProduct.id))
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
    if (productDeleteState && productDeleteState?.status === "succeeded") {
      setTimeout(()=> {
        dispatch(clearState());
      }, 2000)
    }
  }, [productDeleteState]);

  const handleName = (e: any) => {
    setSearch(e.target.value)
  }

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(branchId) || !_.isEmpty(categoryId) || !_.isEmpty(search) || !_.isEmpty(fromDate) || !_.isEmpty(toDate) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadProducts('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!productDataState || !productDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, productDataState.size);
};
  
const calculateEndIndex = () => {
    if (!productDataState || !productDataState.size) return 0;
    const endIndex = Math.min(page * limit, productDataState.size);
    return endIndex;
};

  
  return (
    <Fragment>
        <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
          <Toolbar className='toolbar-pad'>
            <Grid container rowGap={1} columnGap={1} columns={11} style={{ justifyContent: "space-between" }}>
            {roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant  ? 
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2} ref={branchNameInputRef}>
                <Autocomplete
                  disablePortal
                  className='list-autocomplete-field'
                  disableClearable
                  sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                  id="combo-box-demo"
                  options={branchList}
                  value={branchId}
                  onChange={(_, data: any) => {
                    setBranchId(data)
                  }}
                  getOptionLabel={(option: any) => option.branchName || ''}
                  renderInput={(params) => <TextField {...params} label="Branch name" onKeyDown={handleKeyPress} 
                  onPaste={(e: any) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text/plain').trim();
                    const matchingOption = branchList.find((option: any) =>
                      option.branchName.trim() === pastedText
                    );
                    if (matchingOption) {
                      setBranchId(matchingOption);
                    }
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                  }}
                  />}
                />
              </Grid>: null}
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2} ref={categoryNameInputRef}>
                <Autocomplete
                  disablePortal
                  className='list-autocomplete-field'
                  disableClearable
                  sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                  id="combo-box-demo"
                  options={categoryList}
                  value={categoryId}
                  onChange={(_, data: any) => {
                    setCategoryId(data)
                  }}
                  getOptionLabel={(option: any) => option.categoryName || ''}
                  renderInput={(params) => <TextField {...params} label="Category name" onKeyDown={handleKeyPress} 
                  onPaste={(e: any) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text/plain').trim();
                    const matchingOption = categoryList.find((option: any) =>
                      option.categoryName.trim() === pastedText
                    );
                    if (matchingOption) {
                      setCategoryId(matchingOption);
                    }
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                  }}
                  />}
                />
              </Grid>
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2}>
                <TextField
                  className='list-input-field'
                  variant="outlined"
                  label="Product name"
                  inputRef={productNameInputRef}
                  sx={{ width: '100%', backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                  size="small"
                  value={search}
                  onChange={handleName}
                  onKeyDown={handleKeyPress}
                  onKeyPress={(e: any) => {
                    const regex = REGEX.ALPHA_NUMERIC;
                    if (!regex.test(e.key) || search.length >= 30) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text/plain').trim();
                    setSearch(pastedText);
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                  }}
                />
              </Grid>
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2} ref={fromDateInputRef} onKeyDown={handleKeyPress}>
                <DatePicker label="From Date" className='date-picker'
                  format="DD/MM/YYYY"
                  value={fromDate} 
                  onChange={(newValue) => setFromDate(newValue)}
                  views={['year', 'month', 'day']}
                  sx={{
                    width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                    '& .MuiInputLabel-root': {
                      marginTop: '-7px',
                      marginBottom: '7px',
                    }
                  }} />
              </Grid>
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2} ref={toDateInputRef} onKeyDown={handleKeyPress}>
                <DatePicker label="To Date" className='date-picker'
                  format="DD/MM/YYYY"
                  value={toDate} 
                  onChange={(newValue) => setToDate(newValue)}
                  minDate={dayjs(fromDate)}
                  views={['year', 'month', 'day']}
                  sx={{
                    width: '100%', backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                    '& .MuiInputLabel-root': {
                      marginTop: '-7px',
                      marginBottom: '7px',
                    }
                  }} />
              </Grid>
              <Grid item mb={0.5} xs={11} sm={5} md={5} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {productStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item mb={0.5} style={{ display: 'flex', alignItems: 'center' }} xs={6} sm={2} md={2} lg={4}>
                <Tooltip style={{ marginLeft: '0' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadProducts('search'); }}>
                    <SearchIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                    <RefreshIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
              </Grid>
              <Grid item mb={0.5} style={{ display: 'flex', justifyContent: 'end' }} xs={4} sm={2} md={2} lg={4.5}>
                {roleData?.product?.add === true ?
                  <Button variant="contained" className='addButton' onClick={handleAddModalOpen}>
                    Add
                  </Button> :
                  null}
              </Grid>
            </Grid>
          </Toolbar>
        </Box>
        {productDataState && productDataState?.loading ? (<Loading />) :
        <>
        <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
          <Table
            sx={{ maxWidth: "auto" }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
              <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                <TableCell className='list-header' align='left' padding='normal'>#</TableCell>
                {roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant  ?  
                <>
                <TableCell className='list-header' align='left' padding='normal'>Merchant</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Branch</TableCell>
                </> : null}
                <TableCell className='list-header' align='left' padding='normal'>Category</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Product</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Price</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                {roleData?.product?.view || roleData?.product?.edit || roleData?.product?.delete ?
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                  null}
              </TableRow>
            </TableHead>
            <TableBody>
              {!productAddState.loading && !productUpdateState.loading && !productDataState.loading && productDataState.data.map((product: any, index: any) => {
                if (product && product.status && product.status !== null) {
                return (
                  <StyledTableRow
                    key={product.id}
                  >
                    <StyledTableCell className='list-data' align="left">{(page - 1) * limit + index + 1}</StyledTableCell>
                    {roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant  ? 
                    <>
                    <StyledTableCell className='list-data' align="left">{product && product?.merchantDetails && product?.merchantDetails?.merchantName ? product?.merchantDetails?.merchantName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{product && product?.branchDetails && product?.branchDetails?.branchName ? product?.branchDetails?.branchName: '--'}</StyledTableCell>
                    </> : null}
                    <StyledTableCell className='list-data' align="left">{product && product?.categoryDetails && product?.categoryDetails?.categoryName ? product?.categoryDetails?.categoryName: '--'}</StyledTableCell>
                    <StyledTableCell align="left">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {product.images && product.images?.length > 0 ? (
                          <Avatar alt={`Img`} src={`${process.env.REACT_APP_API_BASE_URL}${product.images[0].filePath}`} sx={{ marginRight: '10px' }} />
                        ) : (<Avatar alt={`Img`} src={Food} sx={{ marginRight: '10px' }} />)}
                        <span className='list-data'>{product && product?.productName ? product?.productName: '--'}</span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{product && product?.price ? `${'OMR'} ${product?.price}`: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                    {product && product.status && product.status !== null ?
                      <>
                      {product.status === 'ACTIVE' && (
                        <Chip size='small' label={product?.status} className='status-active-chip' variant="outlined" />
                      )}
                      {product.status === 'INACTIVE' && (
                        <Chip size='small' label={product?.status} className='status-inactive-chip' variant="outlined" />
                      )}
                      {product.status === 'DELETED' && (
                        <Chip size='small' label={product?.status} className='status-deleted-chip' variant="outlined" />
                      )}
                      </> : '--'}
                    </StyledTableCell>
                    {roleData?.product?.view || roleData?.product?.edit || roleData?.product?.delete ?
                      <StyledTableCell className='list-data' align="center">
                        {product.status !== 'DELETED' ?
                          <>
                            <IconButton onClick={(event) => handleMenuOpen(event, product?.id)}>
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </> : null}
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === product.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          {roleData?.product?.view ?
                            <MenuItem onClick={() => handleViewModalOpen(product)}>
                              <ListItemIcon>
                                <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.product?.edit ?
                            <MenuItem onClick={() => handleEditModalOpen(product)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.product?.delete ?
                            <MenuItem onClick={() => handleDeleteClick(product)}
                              // sx={{ display: product?.status === 'DELETED' ? 'none' : 'block' }}
                            >
                              <ListItemIcon>
                                <DeleteOutlinedIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Delete</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                        </Menu>
                      </StyledTableCell> :
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
        {!productDataState?.loading && productDataState?.data?.length === 0 && (<Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
            <div style={{ marginTop: '10px' }} className='error-text'>
              <img style={{ width: '15%', height: '15%' }} src={noProduct} alt="delivery" />
            </div>
          </Grid>
        </Grid>)}
        {!productDataState?.loading && productDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', py:3, px: 2.5 }} position={'sticky'} bottom={0}>
            <Box sx={{ display: 'flex' }}>
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
              <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${productDataState?.size}`}</Typography>
            </Box>
            <Pagination
              page={page}
              count={Math.ceil(productDataState?.size / limit)}
              size="small"
              onChange={handleChangePage}
              showFirstButton
              showLastButton
              defaultPage={1}
              siblingCount={0}
              boundaryCount={1}
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
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className='signout-list'>
        <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
        <DialogContent>
          Are you sure want to delete this product?
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
          message={productAddState?.message || productUpdateState?.message || productDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={productDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  );
}

export default ProductList;