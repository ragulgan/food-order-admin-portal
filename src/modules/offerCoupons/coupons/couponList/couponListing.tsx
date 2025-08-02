import React, { Fragment, useState, useEffect } from 'react';
import {
  Box, Table, Grid, TableBody, TableContainer, TableHead, TableRow, Toolbar, Typography, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Menu, Pagination, Chip, Stack, ListItemIcon, Badge, Autocomplete,
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useNavigate } from 'react-router-dom';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import deliveryGif from '../../../../assets/images/delivery-boy.gif'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../reduxState/store';
import { fetchCoupon } from '../../../../reduxState/offerCouponSlice/couponListSlice';
import noCoupon from '../../../../assets/images/no_coupons.webp'
import Loading from '../../../commonToast/loader';
import { useTheme } from '@mui/material/styles';
import { deleteCouponById } from '../../../../reduxState/offerCouponSlice/couponDeleteSlice';
import AppSnackbar from '../../../commonToast/customizeAlert';
import { clearAddState } from '../../../../reduxState/offerCouponSlice/couponAddSlice';
import { clearUpdateState } from '../../../../reduxState/offerCouponSlice/couponUpdateSlice';
import { clearDeleteState } from '../../../../reduxState/offerCouponSlice/couponDeleteSlice';
import { REGEX } from '../../../utils/constant';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  maxWidth: "100px",
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

const CouponList: React.FC<any> = () => {
  const theme = useTheme();
  const [couponName, setCouponName] = React.useState<string>('');
  const [status, setStatus] = React.useState('');
  const [dense, setDense] = useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const couponDataState = useSelector((state: RootState) => state.coupon);
  const couponAddState = useSelector((state: RootState) => state.couponAdd);
  const couponUpdateState = useSelector((state: RootState) => state.couponUpdate);
  const couponDeleteState = useSelector((state: RootState) => state.couponDelete);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

  const couponStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10'},
    { label: '20'},
    { label: '30'}
  ]

  useEffect(() => {
    loadCoupons();
  }, [page, limit])

  useEffect(() => {
    if (couponAddState && couponAddState?.status === "succeeded" && couponDataState && couponDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    } else if (couponUpdateState && couponUpdateState?.status === "succeeded" && couponDataState && couponDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    }
  }, [couponAddState, couponUpdateState, couponDataState]);

  useEffect(() => {
    if (couponDeleteState && couponDeleteState?.status === "succeeded" && couponDataState && couponDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    }
  }, [couponDeleteState, couponDataState]);

  useEffect(() => {
    if (couponDeleteState && couponDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [couponDeleteState]);


  const loadCoupons = (type?: string) => {
    const params: any = { pageNo: type === 'search' ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    if (couponName) params.coupenName = couponName.trim();
    dispatch(fetchCoupon(params));
  }

  const handleReset = () => {
    setCouponName('');
    setStatus('');
    setPage(1);
    setLimit(limit);
    dispatch(fetchCoupon({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const handleAddOpen = () => {
    navigate('/OffersCoupons/coupons/add')
  };

  const handleEditOpen = (coupon: any) => {
    navigate("/OffersCoupons/coupons/edit", { state: coupon.id })
  };

  const handleDeleteClick = (coupon: any) => {
    setSelectedCoupon(coupon);
    setDeleteModal(true);

  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
    setIsErrorSnackbarOpen(false);
    dispatch(clearAddState());
    dispatch(clearUpdateState());
    dispatch(clearDeleteState());
  };


  const handleConfirmDelete = () => {
    if (selectedCoupon) {
      setIsDeleting(true);
      dispatch(deleteCouponById(selectedCoupon.id))
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

  const refreshTable = () => {
    loadCoupons();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleName = (e: any) => {
    setCouponName(e.target.value)
  }

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  return (
    <Fragment>
      {couponDataState && couponDataState?.loading ? (<Loading />) :
      <>
        <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
          <Toolbar className='toolbar-pad'>
            <Grid container rowGap={1} columnGap={1} columns={8.5} style={{ justifyContent: "space-between" }}>
              <Grid item mb={0.5} xs={8.5} sm={2.5} md={2} lg={2}>
                <TextField
                  className='list-input-field'
                  variant="outlined"
                  label="Coupon Name"
                  sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                  size="small"
                  value={couponName}
                  onChange={handleName}
                  onKeyPress={(e: any) => {
                    const regex = REGEX.ALPHA_NUMERIC;
                    if (!regex.test(e.key) || couponName.length >= 30) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              <Grid item mb={0.5} xs={8.5} sm={2.5} md={2} lg={2}>
                <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {couponStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item mb={0.5} style={{ display: 'flex', alignItems: 'center' }} xs={4} sm={1.5} md={2} lg={2}>
                <Tooltip style={{ marginLeft: '0px' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadCoupons('search'); }}>
                    <SearchIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                    <RefreshIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
              </Grid>
              <Grid item mb={0.5} style={{ display: 'flex', justifyContent: 'end' }} xs={4} sm={1.5} md={2} lg={2}>
                {roleData?.coupon?.add === true ?
                  <Button variant="contained" className='addButton' onClick={handleAddOpen}>
                    Add
                  </Button> :
                  null}
              </Grid>
            </Grid>
          </Toolbar>
        </Box>
        <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
          <Table
            sx={{ maxWidth: "auto" }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
              <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                <TableCell className='list-header' align='left' padding='normal'>#</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Coupon Code</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Coupon Name</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Coupon Percentage</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                {roleData?.coupon?.edit === true || roleData?.coupon?.delete === true ?
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                  null}
              </TableRow>
            </TableHead>
            <TableBody>
              {couponDataState && couponDataState?.data.map((coupon: any, index: any) => {
                if (coupon && coupon.status && coupon.status !== null) {
                return (
                  <StyledTableRow
                    key={coupon?.id}
                  >
                    <StyledTableCell className='list-data' align="left">{page === 1 ? (index + 1) : (index + 1 + page * limit - limit)}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{coupon && coupon?.coupenCode ? coupon?.coupenCode: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{coupon && coupon?.coupenName ? coupon?.coupenName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                      <Stack spacing={4} direction="row" sx={{ color: 'action.active', justifyContent: 'center' }}>
                        <Badge color="warning" badgeContent={`${coupon && coupon?.coupenPerc ? coupon?.coupenPerc: '0'}`}>
                          <LocalOfferOutlinedIcon />
                        </Badge>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                    {coupon && coupon?.status && coupon.status !== null ?
                    <>
                      {coupon.status === 'ACTIVE' && (
                        <Chip size='small' label={coupon.status} className='status-active-chip' variant="outlined" />
                      )}
                      {coupon.status === 'INACTIVE' && (
                        <Chip size='small' label={coupon.status} className='status-inactive-chip' variant="outlined" />
                      )}
                      {coupon.status === 'DELETED' && (
                        <Chip size='small' label={coupon.status} className='status-deleted-chip' variant="outlined" />
                      )}
                      </>: '--'}
                    </StyledTableCell>
                    {roleData?.coupon?.edit === true || roleData?.coupon?.delete === true ?
                      <StyledTableCell className='list-data' align="center">
                        <IconButton onClick={(event) => handleMenuOpen(event, coupon.id)}>
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === coupon.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          {roleData?.coupon?.edit === true ?
                            <MenuItem onClick={() => handleEditOpen(coupon)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.coupon?.delete === true ?
                            <MenuItem onClick={() => handleDeleteClick(coupon)} sx={{
                              display: coupon?.status === 'DELETED' ? 'none' : 'block'
                            }}>
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
        {!couponDataState?.loading && couponDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Grid item xs={12} sx={{height: '70vh', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
            <div style={{ marginTop: '10px' }} className='error-text'>
              <img style={{ width: '15%', height: '15%' }} src={noCoupon} alt="delivery" />
            </div>
          </Grid>
        </Grid>}
        {!couponDataState?.loading && couponDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', p: 4, alignItems:'center', bgcolor: 'background.paper', margin: '0 1px' }} position={'sticky'} bottom={0}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={rowPerPage}
            disableClearable
            className='page-row'
            sx={{ width: 60, borderRadius: '0px' }}
            onChange={(_, data: any) => {
              setLimit(data?.label)
            }}
            value={limit || "10"}
            renderInput={(params) => <TextField {...params} />}
          />
          <Pagination page={page} count={Math.ceil(couponDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          Are you sure want to delete this coupon?
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
          message={couponAddState?.message || couponUpdateState?.message || couponDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={couponDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}


    </Fragment>
  )
}

export default CouponList
