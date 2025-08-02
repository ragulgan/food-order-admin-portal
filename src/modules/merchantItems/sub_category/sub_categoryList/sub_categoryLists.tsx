import React, { Fragment, useState, useEffect } from 'react'
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
import deliveryGif from '../../../../assets/images/delivery-boy.gif'
import subcategory_empty from '../../../../assets/images/subCategories_empty.webp'
import subCategory from '../../../../assets/images/Category.svg'
import SubCategoryAdd from '../sub_categoryAdd/sub_categoryAdd';
import SubCategoryView from '../sub_categoryView/sub_categoryView';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryListSlice';
import { clearDeleteState, deleteSubCategoryById } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryDeleteSlice';
import { AppDispatch, RootState } from '../../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import { endOfDay, startOfDay } from '../../../utils/dateformat'
import { clearAddState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryAddSlice';
import { clearUpdateState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryUpdateSlice';
import { clearViewState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryViewSlice';
import { clearState as clearFileUpload } from '../../../../reduxState/fileupload/multipleFileUpload';
import Loading from '../../../commonToast/loader';

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

interface SubCategoryList {
  id: string;
  subCategoryName: string;
  categoryDetails: {
    id: string,
    categoryName: string,
  },
  merchantDetails: {
    id: string;
    merchantName: string;
  },
  description: string;
  images: any;
  status: string;
  createdDate: string;
}

const SubCategoryList: React.FC<any> = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof SubCategoryList>('createdDate');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState<readonly any[]>([]);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");

  const dispatch = useDispatch<AppDispatch>();
  const branchList = useSelector((state: RootState) => state.branchList.data);
  const categoryList = useSelector((state: RootState) => state.categoryList.data);
  const subCategoryDataState = useSelector((state: RootState) => state.subcategoryList);
  const subCategoryDeleteState = useSelector((state: RootState) => state.subcategoryDelete);
  const subCategoryAddState = useSelector((state: RootState) => state.subCategoryAdd);
  const subCategoryUpdateState = useSelector((state: RootState) => state.subcategoryUpdate);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategoryUpdate, setSelectedSubCategoryUpdate] = useState<SubCategoryList | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

  // state for filters
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<Dayjs | null>(null);
  const [status, setStatus] = React.useState('');
  const [branchId, setBranchId] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [subCategoryName, setSubCategoryName] = React.useState<string>('');

  const subCategoryStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10'},
    { label: '20'},
    { label: '30'}
  ]

  //merchant add alert and update alert
  useEffect(() => {
    if (subCategoryAddState && subCategoryAddState?.status === "succeeded" && subCategoryDataState && subCategoryDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    } else if (subCategoryUpdateState && subCategoryUpdateState?.status === "succeeded" && subCategoryDataState && subCategoryDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    }
  }, [subCategoryAddState, subCategoryUpdateState, subCategoryDataState]);

  //merchant delete alert
  useEffect(() => {
    if (subCategoryDeleteState && subCategoryDeleteState?.status === "succeeded" && subCategoryDataState && subCategoryDataState?.status === 'succeeded') {
      setIsSnackbarOpen(true);
    }
  }, [subCategoryDeleteState, subCategoryDataState]);

  useEffect(() => {
    if (subCategoryDeleteState && subCategoryDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [subCategoryDeleteState]);

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setStatus('');
    setBranchId('');
    setCategoryId('');
    setSubCategoryName('');
    setPage(1);
    setLimit(limit);
    dispatch(fetchSubCategories({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadSubCategories = (type?: string) => {
    const params: any = { pageNo: type === 'search' ? 1 : page, size: limit, status: 'ACTIVE' };
    if (fromDate) params.fromDate = startOfDay(fromDate);
    if (toDate) params.toDate = endOfDay(toDate);
    if (status) params.status = status ? status : 'ACTIVE';
    if (branchId) params.branchId = branchId;
    if (categoryId) params.categoryId = categoryId;
    if (subCategoryName) params.subCategoryName = subCategoryName.trim();
    dispatch(fetchSubCategories(params));
  }

  /* this will load merchant intially as page value initated
 and also load the merchant for page changes */
  useEffect(() => {
    loadSubCategories();
  }, [page, limit])

  const refreshTable = () => {
    loadSubCategories();
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
      setSelectedSubCategoryId('')
      setIsModalOpen(false);
      dispatch(clearFileUpload())
      dispatch(clearViewState())
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedSubCategoryId(id);
    setIsModalOpen(true);
  };

  const handleViewModalOpen = (action: any, id: string) => {
    setSelectedSubCategoryId(id);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setSelectedSubCategoryId('')
      setIsViewModalOpen(false);
      dispatch(clearFileUpload())
      dispatch(clearViewState())
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  }

  const handleDeleteClick = (subcategory: SubCategoryList) => {
    setSelectedSubCategory(subcategory);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubCategory) {
      setIsDeleting(true);
      dispatch(deleteSubCategoryById(selectedSubCategory.id))
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
    dispatch(clearAddState());
    dispatch(clearUpdateState());
    dispatch(clearDeleteState());
  };

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  return (
    <Fragment>
      {subCategoryDataState && subCategoryDataState?.loading ? (<Loading />) :
      <>
        <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5 }}>
          <Toolbar className='toolbar-pad'>
            <Grid container rowGap={1} columnGap={1} columns={11} style={{ justifyContent: "space-between" }}>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <Autocomplete
                  disablePortal
                  className='list-autocomplete-field'
                  disableClearable
                  sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                  id="combo-box-demo"
                  options={branchList}
                  onChange={(_, data: any) => {
                    setBranchId(data.id)
                  }}
                  getOptionLabel={(option: any) => option.branchName || ''}
                  renderInput={(params) => <TextField {...params} label="Branch name" />}
                />
              </Grid>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <Autocomplete
                  disablePortal
                  className='list-autocomplete-field'
                  disableClearable
                  sx={{ backgroundColor: "#fff", borderRadius: '3px' }}
                  id="combo-box-demo"
                  options={categoryList}
                  onChange={(_, data: any) => {
                    setCategoryId(data.id)
                  }}
                  getOptionLabel={(option: any) => option.categoryName || ''}
                  renderInput={(params) => <TextField {...params} label="Category name" />}
                />
              </Grid>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <TextField
                  className='list-input-field'
                  variant="outlined"
                  label="SubCategory name"
                  sx={{ width: '100%', backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                  size="small"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                />
              </Grid>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <DatePicker label="From Date" className='date-picker'
                  format="DD/MM/YYYY"
                  value={fromDate} onChange={(newValue) => setFromDate(newValue)}
                  sx={{
                    width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                    '& .MuiInputLabel-root': {
                      marginTop: '-7px',
                      marginBottom: '7px',
                    }
                  }} />
              </Grid>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <DatePicker label="To Date" className='date-picker'
                  format="DD/MM/YYYY"
                  value={toDate} onChange={(newValue) => setToDate(newValue)}
                  sx={{
                    width: '100%', backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px',
                    '& .MuiInputLabel-root': {
                      marginTop: '-7px',
                      marginBottom: '7px',
                    }
                  }} />
              </Grid>
              <Grid mb={0.5} item xs={11} sm={5} md={5} lg={2}>
                <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {subCategoryStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid mb={0.5} item style={{ display: 'flex', alignItems: 'center' }} xs={5} sm={2} md={1.5} lg={5}>
                <Tooltip style={{ marginLeft: '0px' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadSubCategories('search'); }}>
                    <SearchIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                    <RefreshIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
              </Grid>
              <Grid mb={0.5} item style={{ display: 'flex', justifyContent: 'end' }} xs={5} sm={2} md={1.5} lg={3.5}>
                {roleData?.subCategory?.add ?
                  <Button variant="contained" className='addButton' onClick={handleAddModalOpen}>
                    Add
                  </Button> :
                  null}
              </Grid>
            </Grid>
          </Toolbar>
        </Box>
        <SubCategoryAdd subcategoryId={selectedSubCategoryId} isOpen={isModalOpen} onClose={handleAddModalClose} handleReset={handleReset} />
        <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
          <Table
            sx={{ maxWidth: "auto" }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
              <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                <TableCell className='list-header' align='left' padding='normal'>#</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Merchant</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Branch</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Category</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>SubCategory</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                {roleData?.subCategory?.view || roleData?.subCategory?.edit || roleData?.subCategory?.delete ?
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> :
                  null}
              </TableRow>
            </TableHead>
            <TableBody>
              {!subCategoryDataState?.loading && subCategoryDataState?.data.map((subcategory: any, index: any) => {
                 if (subcategory && subcategory.status && subcategory.status !== null) {
                return (
                  <StyledTableRow
                    key={subcategory?.id}
                  >
                    <StyledTableCell className='list-data' align="left">{page === 1 ? (index + 1) : (index + 1 + page * limit - limit)}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{subcategory && subcategory?.merchantDetails && subcategory?.merchantDetails?.merchantName ? subcategory?.merchantDetails?.merchantName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{subcategory && subcategory?.branchDetails && subcategory?.branchDetails?.branchName ? subcategory?.branchDetails?.branchName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{subcategory && subcategory?.categoryDetails && subcategory?.categoryDetails?.categoryName ? subcategory?.categoryDetails?.categoryName: '--'}</StyledTableCell>
                    <StyledTableCell align="left">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {subcategory.images && subcategory.images?.length > 0 ? (
                          <Avatar alt={`Img`} src={`${process.env.REACT_APP_API_BASE_URL}${subcategory.images[0].filePath}`} sx={{ marginRight: '10px' }} />
                        ) : (<Avatar alt={`Img`} src={subCategory} sx={{ marginRight: '10px' }} />)}
                        <span className='list-data'>{subcategory && subcategory?.subCategoryName ? subcategory?.subCategoryName: '--'}</span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                    {subcategory && subcategory.status && subcategory.status !== null ?
                      <>
                      {subcategory.status === 'ACTIVE' && (
                        <Chip size='small' label={subcategory?.status} className='status-active-chip' variant="outlined" />
                      )}
                      {subcategory.status === 'INACTIVE' && (
                        <Chip size='small' label={subcategory?.status} className='status-inactive-chip' variant="outlined" />
                      )}
                      {subcategory.status === 'DELETED' && (
                        <Chip size='small' label={subcategory?.status} className='status-deleted-chip' variant="outlined" />
                      )}
                      </> : '--'}
                    </StyledTableCell>
                    {roleData?.subCategory?.view || roleData?.subCategory?.edit || roleData?.subCategory?.delete ?
                      <StyledTableCell className='list-data' align="center">
                        <IconButton onClick={(event) => handleMenuOpen(event, subcategory?.id)}>
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === subcategory?.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          {roleData?.subCategory?.view ?
                            <MenuItem onClick={() => handleViewModalOpen('view', subcategory?.id)}>
                              <ListItemIcon>
                                <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.subCategory?.edit ?
                            <MenuItem onClick={() => handleEditModalOpen(subcategory?.id)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.subCategory?.delete ?
                            <MenuItem onClick={() => handleDeleteClick(subcategory)} sx={{
                              display: subcategory?.status === 'DELETED' ? 'none' : 'block'
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
        {!subCategoryDataState?.loading && subCategoryDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Grid item xs={12} sx={{height: '70vh', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
            <div style={{ marginTop: '10px' }} className='error-text'>
              <img style={{ width: '15%', height: '15%' }} src={subcategory_empty} alt="delivery" />
            </div>
          </Grid>
        </Grid>}
        {!subCategoryDataState?.loading && subCategoryDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', p: 4, alignItems:'center', bgcolor: 'background.paper', margin: '0 1px' }}>
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
          <Pagination page={page} count={Math.ceil(subCategoryDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          Are you sure want to delete this subcategory?
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
          message={subCategoryAddState?.message || subCategoryUpdateState?.message || subCategoryDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={subCategoryDeleteState.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
      <SubCategoryView subcategoryId={selectedSubCategoryId} isOpen={isViewModalOpen} onClose={handleViewModalClose} />
    </Fragment>
  );
}

export default SubCategoryList;