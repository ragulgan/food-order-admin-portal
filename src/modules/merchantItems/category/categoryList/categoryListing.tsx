import React, { Fragment, useState, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles';
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
import categoriesImage from '../../../../assets/images/categories_empty.webp'
import Category from '../../../../assets/images/Category.svg'
import CategoryAdd from '../categoryAdd/categoryAdding';
import CategoryView from '../categoryView/categoryView';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../reduxState/merchantItemSlice/category/categoryListSlice';
import { deleteCategoryById, clearDeleteState } from '../../../../reduxState/merchantItemSlice/category/categoryDeleteSlice';
import { AppDispatch, RootState } from '../../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import { useTheme } from '@mui/material/styles';
import { clearAddState } from '../../../../reduxState/merchantItemSlice/category/categoryAdding';
import { clearUpdateState } from '../../../../reduxState/merchantItemSlice/category/categoryUpdateSlice';
import { clearState as clearFileUpload } from '../../../../reduxState/fileupload/multipleFileUpload';
import Loading from '../../../commonToast/loader';
import { clearViewState } from '../../../../reduxState/merchantItemSlice/category/categoryViewSlice';
import { REGEX } from '../../../utils/constant';
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


interface CategoryList {
  id: string;
  categoryName: string;
  images: any;
  status: string;
}

const CategoryListItems: React.FC<any> = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof CategoryList>('id');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState<readonly any[]>([]);
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("10");

  const dispatch = useDispatch<AppDispatch>();
  const categoryDataState = useSelector((state: RootState) => state.categoryList);
  const categoryDeleteState = useSelector((state: RootState) => state.categoryDelete);
  const categoryAddState = useSelector((state: RootState) => state.categoryAdding);
  const categoryUpdateState = useSelector((state: RootState) => state.categoryUpdate);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState<any>(false)
  const totalPage = Math.ceil(categoryDataState?.size / limit)
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const categoryNameInputRef = useRef(null);
  const statusInputRef = useRef(null);

  // state for filters
  const [status, setStatus] = React.useState('');
  const [categoryName, setCategoryName] = React.useState<string>('');

  const categoryStatus = [
    { value: 'ALL', name: 'All' },
    { value: 'ACTIVE', name: 'Active' },
    { value: 'INACTIVE', name: 'Inactive' },
  ]

  const rowPerPage = [
    { label: '10'},
    { label: '20'},
    { label: '30'}
  ]

//category add alert and update alert
useEffect(() => {
  if (categoryAddState && categoryAddState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  } else if (categoryUpdateState && categoryUpdateState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  }
}, [categoryAddState, categoryUpdateState, categoryDataState]);

//category delete alert
useEffect(() => {
  if (categoryDeleteState && categoryDeleteState?.status === "succeeded") {
    setIsSnackbarOpen(true);
  }
}, [categoryDeleteState, categoryDataState]);

useEffect(() => {
  if (categoryDeleteState && categoryDeleteState?.error === true) {
    setIsErrorSnackbarOpen(true);
    setTimeout(()=> {
      dispatch(clearDeleteState());
    }, 2000)
  }
}, [categoryDeleteState]);

  const handleReset = () => {
    setStatus('');
    setCategoryName('');
    setPage(1);
    setLimit(limit);
    setIsChanged(false)
    dispatch(fetchCategories({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadCategories = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    if (categoryName) params.categoryName = categoryName.trim();
    dispatch(fetchCategories(params));
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

  // Action Events
  const handleAddModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleAddModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setSelectedCategoryId('')
      setIsModalOpen(false);
      dispatch(clearFileUpload())
      dispatch(clearViewState());
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const handleViewModalOpen = (action: any, id: string) => {
    setSelectedCategoryId(id);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = (event: React.MouseEvent<HTMLButtonElement>, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setSelectedCategoryId('');
      setIsViewModalOpen(false);
      dispatch(clearFileUpload())
      dispatch(clearViewState());
      setSelectedId(null);
      setAnchorEl(null);
      refreshTable();
    }
  }

  const handleDeleteClick = (category: CategoryList) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setIsDeleting(true);
      dispatch(deleteCategoryById(selectedCategory.id))
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
    if (categoryAddState && categoryAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (categoryUpdateState && categoryUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((categoryDeleteState && categoryDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [categoryAddState, categoryUpdateState, categoryDeleteState]);

  const handleName = (e: any) => {
    setCategoryName(e.target.value)
  }

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(categoryName) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadCategories('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!categoryDataState || !categoryDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, categoryDataState.size);
  };

  const calculateEndIndex = () => {
    if (!categoryDataState || !categoryDataState.size) return 0;
    const endIndex = Math.min(page * limit, categoryDataState.size);
    return endIndex;
  };

  return (
    <Fragment>
        <Box sx={{ width: "100%", bgcolor: 'background.paper', py: 3, px: 2.5, zIndex: 2 }} position={'sticky'} top={63}>
          <Toolbar className='toolbar-pad'>
            <Grid container rowGap={1} columnGap={1} columns={8.5} style={{ justifyContent: "space-between" }}>
              <Grid mb={0.5} item xs={8.5} sm={2.5} md={2} lg={2}>
                <TextField
                  className='list-input-field'
                  variant="outlined"
                  label="Category name"
                  inputRef={categoryNameInputRef}
                  sx={{ width: '100%', backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                  size="small"
                  value={categoryName}
                  onChange={handleName}
                  onKeyDown={handleKeyPress}
                  onKeyPress={(e: any) => {
                    const regex = REGEX.TEXT;
                    if (!regex.test(e.key) || categoryName.length >= 30) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text/plain').trim();
                    setCategoryName(pastedText);
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                  }}
                />
              </Grid>
              <Grid mb={0.5} item xs={8.5} sm={2.5} md={2} lg={2} ref={statusInputRef} onKeyDown={handleKeyPress}>
                <FormControl className='list-input-field' size="small" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", border: '0px solid #FFFFFF', borderRadius: '3px' }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {categoryStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid mb={0.5} item style={{ display: 'flex', alignItems: 'center' }} xs={4} sm={1.5} md={2} lg={2}>
                <Tooltip style={{ marginLeft: '0px' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadCategories('search'); }}>
                    <SearchIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { handleReset(); }}>
                    <RefreshIcon style={{ color: "#FB640A" }} />
                  </CustomIconButton>
                </Tooltip>
              </Grid>
              <Grid mb={0.5} item style={{ display: 'flex', justifyContent: 'end' }} xs={4} sm={1.5} md={2} lg={2}>
                {roleData?.category?.add ?
                  <Button variant="contained" className='addButton' onClick={handleAddModalOpen}>
                    Add
                  </Button> : null}
              </Grid>
            </Grid>
          </Toolbar>
        </Box>
        <CategoryAdd categoryId={selectedCategoryId} isOpen={isModalOpen} onClose={handleAddModalClose} handleReset={handleReset} />
        {categoryAddState?.loading && categoryUpdateState?.loading && categoryDeleteState?.loading && categoryDataState?.loading ? (<Loading />) :
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
                <TableCell className='list-header' align='left' padding='normal'>Category Image</TableCell>
                <TableCell className='list-header' align='left' padding='normal'>Category</TableCell>
                <TableCell className='list-header' align='center' padding='normal'>Status</TableCell>
                {roleData?.category?.edit || roleData?.category?.delete ?
                  <TableCell className='list-header' align='center' padding='normal'>Action</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {!categoryDataState?.loading && categoryDataState?.data.map((category: any, index: any) => {
                if (category && category.status && category.status !== null) {
                return (
                  <StyledTableRow
                    key={category?.id}
                  >
                    <StyledTableCell className='list-data' align="left">{(page - 1) * limit + index + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      {category && category.images && category.images.id !== null ? (
                        <Avatar alt="Img" src={`${process.env.REACT_APP_API_BASE_URL}${category?.images?.filePath}`} />
                      ) : (<Avatar alt={`Img`} src={Category} />)}
                    </StyledTableCell>
                    <StyledTableCell className='list-data' align="left">{category && category?.categoryName ? category?.categoryName: '--'}</StyledTableCell>
                    <StyledTableCell className='list-data' align="center">
                    {category && category.status && category.status !== null ?
                      <>
                      {category.status === 'ACTIVE' && (
                        <Chip size='small' label={category?.status} className='status-active-chip' variant="outlined" />
                      )}
                      {category.status === 'INACTIVE' && (
                        <Chip size='small' label={category?.status} className='status-inactive-chip' variant="outlined" />
                      )}
                      {category.status === 'DELETED' && (
                        <Chip size='small' label={category?.status} className='status-deleted-chip' variant="outlined" />
                      )}
                      </> : '--'}
                    </StyledTableCell>
                    {roleData?.category?.edit || roleData?.category?.delete ?
                      <StyledTableCell className='list-data' align="center">
                        {category.status !== 'DELETED' ?
                          <>
                            <IconButton onClick={(event) => handleMenuOpen(event, category?.id)}>
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </> : null}
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedId === category?.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                          }}
                          className='border-radius-mine'
                        >
                          {/* {roleData?.category?.view ?
                            <MenuItem onClick={() => handleViewModalOpen('view', category?.id)}>
                              <ListItemIcon>
                                <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null} */}
                          {roleData?.category?.edit ?
                            <MenuItem onClick={() => handleEditModalOpen(category?.id)}>
                              <ListItemIcon>
                                <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                                <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                              </ListItemIcon>
                            </MenuItem> :
                            null}
                          {roleData?.category?.delete ?
                            <MenuItem onClick={() => handleDeleteClick(category)}
                              // sx={{ display: category?.status === 'DELETED' ? 'none' : 'block' }}
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
        {!categoryDataState?.loading && categoryDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sx={{height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
            <div style={{ marginTop: '10px' }} className='error-text'>
              <img style={{ width: '15%', height: '15%' }} src={categoriesImage} alt="delivery" />
            </div>
          </Grid>
        </Grid>}
        {!categoryDataState?.loading && categoryDataState?.data?.length > 0 ?
          <>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems:'center', bgcolor: 'background.paper', py:3, px: 2.5 }} position={'sticky'} bottom={0}>
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
          <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${categoryDataState?.size}`}</Typography>
          </Box>
          <Pagination page={page} count={Math.ceil(categoryDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
          Are you sure you want to delete this category?
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
          message={categoryAddState?.message || categoryUpdateState?.message || categoryDeleteState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={categoryDeleteState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
      <CategoryView categoryId={selectedCategoryId} isOpen={isViewModalOpen} onClose={handleViewModalClose} />
    </Fragment>
  );
}

export default CategoryListItems;