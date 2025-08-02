import * as React from 'react';
import {
  Typography, Box, Button, Table, TableBody,
  TableContainer, TableHead, TableRow, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  Pagination, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip,
  IconButton, Chip, Autocomplete,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { fetchVariants } from '../../../reduxState/settingSlice/variant/variantListSlice';
import { clearAddState } from '../../../reduxState/settingSlice/variant/variantAdd';
import { clearUpdateState } from '../../../reduxState/settingSlice/variant/variantUpdateSlice';
import { clearViewState } from '../../../reduxState/settingSlice/variant/variantViewSlice';
import { deleteVariantById, clearDeleteState } from '../../../reduxState/settingSlice/variant/variantDeleteSlice';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert';
import { RootState, AppDispatch } from '../../../reduxState/store';
import errorImage from '../../../assets/images/Error.png'
import editIcon from '../../../assets/images/editIcon.svg'
import deleteIcon from '../../../assets/images/deleteIcon.svg'
import VariantAdd from './variantAdd';
import { REGEX } from '../../utils/constant';

const StyledTableCellCollapse = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  maxWidth: "150px", overflow: "scroll", textOverflow: "clip", whiteSpace: "nowrap", scrollBar: 'none',
  '&::-webkit-scrollbar': {
    display: 'none !important',
  },
  padding: '16px',
  borderBottom: '0px'
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid #FC8019',
  borderRadius: '3px',
  marginLeft: '10px',
}));

interface VariantList {
  id: string;
  status: string;
  variantName: string;
}

const VariantTabs: React.FC<any> = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>("10");
  const variantDataState = useSelector((state: RootState) => state.variantList);
  const variantAddState = useSelector((state: RootState) => state.variantAdd)
  const variantDeleteState = useSelector((state: RootState) => state.variantDelete)
  const variantUpdateState = useSelector((state: RootState) => state.variantUpdate);

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState<VariantList | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  const [addVariant, setAddVariant] = React.useState<boolean>(false);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>('');

  // state for filters
  const [status, setStatus] = React.useState('');
  const [name, setName] = React.useState<string>('');

  const variantStatus = [
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
    loadVariants();
  }, [page, limit])

  //role add alert and update alert
  React.useEffect(() => {
    if (variantAddState && variantAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (variantUpdateState && variantUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [variantAddState, variantUpdateState]);

  //role delete alert
  React.useEffect(() => {
    if (variantDeleteState && variantDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [variantDeleteState]);

  React.useEffect(() => {
    if (variantDeleteState && variantDeleteState.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [variantDeleteState]);

  const handleReset = () => {
    setStatus('');
    setName('');
    setPage(1);
    setLimit(limit);
    dispatch(fetchVariants({ pageNo: page, size: limit, status: 'ACTIVE' }));
  };

  const loadVariants = (type?: string) => {
    const params: any = { pageNo: type === 'search' ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    if (name) params.variantName = name.trim();
    dispatch(fetchVariants(params));
  }

  const refreshTable = () => {
    loadVariants();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddButtonClick = () => {
    setAddVariant(!addVariant);
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedVariantId(id);
    setAddVariant(!addVariant);
  };

  const handleCancelButtonClick = () => {
    setAddVariant(!addVariant);
    setSelectedVariantId('')
    dispatch(clearViewState())
    refreshTable();
  };

  const handleDeleteClick = (row: VariantList) => {
    setSelectedVariant(row);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVariant) {
      setIsDeleting(true);
      dispatch(deleteVariantById(selectedVariant.id))
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
    if (variantAddState && variantAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (variantUpdateState && variantUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((variantDeleteState && variantDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [variantAddState, variantUpdateState, variantDeleteState]);

  return (
    <React.Fragment>
      {!addVariant ? (
        <Box className='general-box'>
          <Box sx={{ bgcolor: 'background.paper', zIndex: 2 }} position='sticky' top={108}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" className='role-title inter-med' mb={2}>
                  Variant Settings
                </Typography>
                <Typography variant="h6" className='role-text inter-med'>
                  Define Culinary Delights by Variant Type
                </Typography>
              </Box>
              <Button variant="contained" className='addButton' onClick={handleAddButtonClick}>
                Add
              </Button>
            </Box>
            <Box sx={{ width: "100%" }} mt={1}>
              <Grid container className="content-center" rowGap={1} columnGap={1} columns={12} spacing={2} mt={2}>
                <Grid item xs={12} sm={4} md={4} lg={3}>
                  <TextField
                    className='list-input-field'
                    variant="outlined"
                    label="Variant name"
                    sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e: any) => {
                      const regex = REGEX.ALPHA_NUMERIC_CHARS;
                      if (!regex.test(e.key) || name.length >= 30) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={3}>
                  <FormControl className='list-input-field' size="small" variant="outlined" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}>
                      {variantStatus.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid ml={2} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px' }} xs={0.85} sm={0.85} md={0.85} lg={0.85}>
                  <Tooltip style={{ marginLeft: '0px' }} title="Search">
                    <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadVariants('search'); }}>
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
                  <TableCell className='table-header inter-med' align="left">Variant Name</TableCell>
                  <TableCell className='table-header inter-med' align="left">Status</TableCell>
                  <TableCell className='table-header inter-med' align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!variantDataState?.loading && variantDataState?.data?.map((row: any, index: any) => {
                  if (row && row.status && row.status !== null) {
                    return (
                      <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCellCollapse align="center">
                          {page === 1 ? (index + 1) : (index + 1 + page * limit - limit)}
                        </StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">{row && row.variantName ? row.variantName : '--'}</StyledTableCellCollapse>
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
                          <Button onClick={() => handleEditModalOpen(row?.id)}><img src={editIcon} alt='edit' /></Button>
                          <Button onClick={() => handleDeleteClick(row)}><img src={deleteIcon} alt='delete' /></Button>
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
          {!variantDataState?.loading && variantDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Grid item xs={12}>
              <Typography className='error-text' component="h1" variant="h6">
                {variantDataState.message}
              </Typography>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center', bgcolor: 'background.paper' }} position={'sticky'} bottom={0}>
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
            <Pagination page={page} count={Math.ceil(variantDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
              Are you sure want to delete this cuisine?
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
              message={variantAddState?.message || variantUpdateState?.message || variantDeleteState?.message}
              type="success"
              onClose={handleSnackbarClose}
            />
          )}
          {isErrorSnackbarOpen && (
            <AppSnackbar
              showAlert={isErrorSnackbarOpen}
              message={variantDeleteState?.message}
              type="error"
              onClose={handleSnackbarClose}
            />
          )}
        </Box>) :
        (<VariantAdd variantId={selectedVariantId} onBack={handleCancelButtonClick} />)
      }
    </React.Fragment>
  )
}

export default VariantTabs;