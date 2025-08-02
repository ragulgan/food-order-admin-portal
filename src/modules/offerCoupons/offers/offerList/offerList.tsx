import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles';
import {
  Box, Table, TableBody, TableContainer, TableHead, TableRow, Toolbar, Typography, IconButton,
  Tooltip, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Menu, Pagination,
  Chip, Grid, Stack, ListItemIcon, Avatar, Badge, Autocomplete,
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { useNavigate } from 'react-router-dom';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import noOffer from '../../../../assets/images/no_offers.webp'
import Food from '../../../../assets/images/Food.svg'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffer } from '../../../../reduxState/offerCouponSlice/offerListSlice';
import { deleteOfferById, clearDeleteState } from '../../../../reduxState/offerCouponSlice/offerDeleteSlice';
import { AppDispatch, RootState } from '../../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import { clearAddState } from '../../../../reduxState/offerCouponSlice/offerAddSlice'
import { clearUpdateState } from '../../../../reduxState/offerCouponSlice/offerEditSlice';
import Loading from '../../../commonToast/loader';
import { fetchBranch } from '../../../../reduxState/branchSlice/branchListSlice';
import _ from 'lodash'

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

interface OfferList {
  id: string;
  branchDetails: {
    id: string,
    branchName: string,
  };
  offerName: string;
  offerImage: any;
  offerPerc: string;
  offerDesc: string;
  offerColor: string;
  isApplied: boolean;
  status: string;
  createdDate: string;
}

const OfferList: React.FC<any> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof OfferList>('createdDate');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState<any>([]);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");

  const dispatch = useDispatch<AppDispatch>();
  const branchList = useSelector((state: RootState) => state.branchList.data);
  const offerDataState = useSelector((state: RootState) => state.offerList);
  const offerDeleteState = useSelector((state: RootState) => state.offerDelete);
  const offerAddState = useSelector((state: RootState) => state.offerAdd);
  const offerUpdateState = useSelector((state: RootState) => state.offerUpdate);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [isChanged, setIsChanged] = useState<any>(false)
  const totalPage = Math.ceil(offerDataState?.size / limit)

  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const branchNameInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [branchId, setBranchId] = React.useState<any>('');
  const [status, setStatus] = React.useState('');

  const offerStatus = [
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
  }, [])

  //offer add alert and update alert
  useEffect(() => {
    if (offerAddState && offerAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (offerUpdateState && offerUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [offerAddState, offerUpdateState]);

  //offer delete alert
  useEffect(() => {
    if (offerDeleteState && offerDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [offerDeleteState]);

  useEffect(() => {
    if (offerDeleteState && offerDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [offerDeleteState]);

  const handleReset = () => {
    setBranchId('');
    setStatus('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchOffer({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadVariants = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (branchId) params.branchId = branchId.id;
    if (status) params.status = status ? status : 'ACTIVE';
    dispatch(fetchOffer(params));
  }

  /* this will load merchant intially as page value initated
and also load the merchant for page changes */
  useEffect(() => {
    loadVariants();
  }, [page, limit])

  useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  const refreshTable = () => {
    loadVariants();
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

  const handleAddOpen = () => {
    navigate('/OffersCoupons/offers/add')
  };

  const handleEditOpen = (offer: any) => {
    navigate("/OffersCoupons/offers/edit", { state: offer.id })
  };

  const handleDeleteClick = (offer: OfferList) => {
    setSelectedOffer(offer);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOffer) {
      setIsDeleting(true);
      dispatch(deleteOfferById(selectedOffer.id))
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

  React.useEffect(() => {
    if (offerAddState && offerAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (offerUpdateState && offerUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((offerDeleteState && offerDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [offerAddState, offerUpdateState, offerDeleteState]);

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(branchId) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadVariants('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!offerDataState || !offerDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, offerDataState.size);
  };

  const calculateEndIndex = () => {
    if (!offerDataState || !offerDataState.size) return 0;
    const endIndex = Math.min(page * limit, offerDataState.size);
    return endIndex;
  };

  return (
    <Fragment>
        <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
          <Toolbar className='toolbar-pad'>
            <Grid container rowGap={1} columnGap={1} columns={8.5} style={{ justifyContent: "space-between" }}>
              <Grid item mb={0.5} xs={8.5} sm={2.5} md={2} lg={2} ref={branchNameInputRef}>
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
              </Grid>
              <Grid item mb={0.5} xs={8.5} sm={2.5} md={2} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {offerStatus.map((item: any) => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item mb={0.5} style={{ display: 'flex', alignItems: 'center' }} xs={4} sm={1.5} md={2} lg={2}>
                <Tooltip style={{ marginLeft: '0px' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadVariants('search'); }}>
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
                {roleData?.offers?.add ?
                  <Button variant="contained" className='addButton' onClick={handleAddOpen}>
                    Add
                  </Button> :
                  null}
              </Grid>
            </Grid>
          </Toolbar>
        </Box>
        {offerDataState && offerDataState?.loading ? (<Loading />) : 
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
                <TableCell className='list-header' align='left' padding='normal'>Branch Name</TableCell>
                {/* <TableCell className='list-header' align='center' padding='normal'>Offer Applied</TableCell> */}
                <TableCell className='list-header' align='left' padding='normal'>Offer Name</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Offer Percentage</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Offer Image</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                {roleData?.offers?.edit || roleData?.offers?.delete ?
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                  null}
              </TableRow>
            </TableHead>
            <TableBody>
              {!offerDataState?.loading && offerDataState?.data.map((offer: any, index: any) => {
                if (offer && offer.status && offer.status !== null) {
                return (
                  <StyledTableRow
                    key={offer.id}
                  >
                    <StyledTableCell className='list-data' align="left">{(page - 1) * limit + index + 1}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{offer && offer?.branchDetails && offer?.branchDetails?.branchName ? offer?.branchDetails?.branchName: '--'}</StyledTableCell>
                    {/* <StyledTableCell className='list-data' align="center">{offer?.isApplied === true ? (<Typography sx={{ color: '#2e7d32' }}>Yes</Typography>) : (<Typography sx={{ color: '#ed6c02' }}>No</Typography>)}</StyledTableCell> */}
                    <StyledTableCell className='list-data' align="left">{offer && offer?.offerName ? offer?.offerName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                      <Stack spacing={4} direction="row" sx={{ color: 'action.active', justifyContent: 'center' }}>
                        <Badge color="warning" badgeContent={`${offer && offer.offerPerc ? `${offer.offerPerc}${'%'}`: '--'}`}>
                          <LocalOfferOutlinedIcon />
                        </Badge>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {offer && offer.offerImage && offer.offerImage.id !== null ? (
                          <Avatar alt="Img" src={`${process.env.REACT_APP_API_BASE_URL}${offer?.offerImage?.filePath}`} />
                        ) : (
                          <Avatar alt={`Img`} src={Food} />
                        )}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                    {offer && offer?.status && offer.status !== null ?
                    <>
                      {offer.status === 'ACTIVE' && (
                        <Chip size='small' label={offer?.status} className='status-active-chip' variant="outlined" />
                      )}
                      {offer.status === 'INACTIVE' && (
                        <Chip size='small' label={offer?.status} className='status-inactive-chip' variant="outlined" />
                      )}
                      {offer.status === 'DELETED' && (
                        <Chip size='small' label={offer?.status} className='status-deleted-chip' variant="outlined" />
                      )}
                      </>: '--'}
                    </StyledTableCell>
                    {roleData?.offers?.edit || roleData?.offers?.delete ?
                      <StyledTableCell className='list-data' align="center">
                        {offer.status !== 'DELETED' ?
                          <>
                            <IconButton onClick={(event) => handleMenuOpen(event, offer.id)}>
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </> : null}
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === offer.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          {roleData?.offers?.edit ?
                            <MenuItem onClick={() => handleEditOpen(offer)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.offers?.delete ?
                            <MenuItem onClick={() => handleDeleteClick(offer)}
                            // sx={{ display: offer?.status === 'DELETED' ? 'none' : 'block'}}
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
        {!offerDataState?.loading && offerDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
            <div style={{ marginTop: '10px' }} className='error-text'>
              <img style={{ width: '15%', height: '15%' }} src={noOffer} alt="delivery" />
            </div>
          </Grid>
        </Grid>}
        {!offerDataState?.loading && offerDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems:'center', bgcolor: 'background.paper', py:3, px: 2.5, zIndex: '1' }} position={'sticky'} bottom={0}>
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
          <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${offerDataState?.size}`}</Typography>
          </Box>
          <Pagination page={page} count={Math.ceil(offerDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          Are you sure want to delete this offer?
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
          message={offerAddState?.message || offerUpdateState?.message || offerDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={offerDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  );
}

export default OfferList;