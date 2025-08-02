import * as React from 'react';
import {
  Typography, Box, Button, Table, TableBody,
  TableContainer, TableHead, TableRow, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  Pagination, IconButton, FormControl, InputLabel, Select, MenuItem, Tooltip, TextField, Chip, Autocomplete,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { fetchRoles } from '../../../reduxState/settingSlice/roleSlice/roleSlice';
import { deleteRoleById, clearDeleteState } from '../../../reduxState/settingSlice/roleSlice/roleDeleteSlice';
import { clearAddState } from '../../../reduxState/settingSlice/roleSlice/roleAddSlice';
import { clearUpdateState } from '../../../reduxState/settingSlice/roleSlice/roleUpdateSlice';
import { clearViewState } from '../../../reduxState/settingSlice/roleSlice/roleViewSlice';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert';
import { RootState, AppDispatch } from '../../../reduxState/store';
import errorImage from '../../../assets/images/Error.png'
import editIcon from '../../../assets/images/editIcon.svg'
import deleteIcon from '../../../assets/images/deleteIcon.svg'
import RoleAdd from './roleAdd'
import { REGEX } from '../../utils/constant';
import _ from 'lodash'

const StyledTableCellCollapse = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  maxWidth: "100px",
  whiteSpace: "normal",
  padding: '16px',
  borderBottom: '0px'
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid #FC8019',
  borderRadius: '3px',
  marginLeft: '10px',
}));

interface RoleList {
  id: string;
  role: string;
  status: string;
  createdDate: string;
}

const RoleTabs: React.FC<any> = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>('10');
  const roleDataState = useSelector((state: RootState) => state.role);
  const roleDeleteState = useSelector((state: RootState) => state.roleDelete)
  const roleAddState = useSelector((state: RootState) => state.roleAdd)
  const roleUpdateState = useSelector((state: RootState) => state.roleUpdate);

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleList | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  const [addRole, setAddRole] = React.useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('');

  const [isChanged, setIsChanged] = React.useState<any>(false)
  const totalPage = Math.ceil(roleDataState?.size / limit)
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)
  const roleInputRef = React.useRef(null);
  const statusInputRef = React.useRef(null);

  // state for filters
  const [status, setStatus] = React.useState('');
  const [role, setRole] = React.useState<string>('');

  const roleStatus = [
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
    loadRoles();
  }, [page, limit])

  React.useEffect(() => {
    if(totalPage && isChanged){
      setPage(1)
    }
  },[totalPage, isChanged])

  //role add alert and update alert
  React.useEffect(() => {
    if (roleAddState && roleAddState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    } else if (roleUpdateState && roleUpdateState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [roleAddState, roleUpdateState]);

  //role delete alert
  React.useEffect(() => {
    if (roleDeleteState && roleDeleteState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [roleDeleteState]);

  React.useEffect(() => {
    if (roleDeleteState && roleDeleteState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=> {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [roleDeleteState]);

  const handleReset = () => {
    setStatus('');
    setRole('');
    setLimit(limit)
    setIsChanged(false)
    dispatch(fetchRoles({ pageNo: 1, size: limit, status: 'ACTIVE' }));
  };

  const loadRoles = (type?: string) => {
    const params: any = { pageNo: type === 'search' || totalPage && isChanged && totalPage !== page ? 1 : page, size: limit, status: 'ACTIVE' };
    if (status) params.status = status ? status : 'ACTIVE';
    if (role) params.role = role.trim();
    dispatch(fetchRoles(params));
  }

  const refreshTable = () => {
    loadRoles();
  };

  //pagination event
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddButtonClick = () => {
    setAddRole(!addRole);
  };

  const handleEditModalOpen = (id: string) => {
    setSelectedRoleId(id);
    setAddRole(!addRole);
  };

  const handleCancelButtonClick = () => {
    setAddRole(!addRole);
    setSelectedRoleId('')
    dispatch(clearViewState())
    refreshTable();
  };

  const handleDeleteClick = (row: RoleList) => {
    setSelectedRole(row);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      setIsDeleting(true);
      dispatch(deleteRoleById(selectedRole.id))
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
    if (roleAddState && roleAddState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearAddState());
      }, 2000)
    } else if (roleUpdateState && roleUpdateState?.status === "succeeded") {
      setTimeout(() => {
        dispatch(clearUpdateState());
      }, 2000)  
    } else if ((roleDeleteState && roleDeleteState?.status === "succeeded")) {
      setTimeout(() => {
        dispatch(clearDeleteState());
      }, 2000)
    }
  }, [roleAddState, roleUpdateState, roleDeleteState]);

  const handleName = (e: any) => {
    setRole(e.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (!_.isEmpty(role) || !_.isEmpty(status)) {
      if (event.key === 'Enter') {
        loadRoles('search');
      }
    }
  }

  const calculateStartIndex = () => {
    if (!roleDataState || !roleDataState.size) return 0;
    const startIndex = (page - 1) * limit + 1;
    return Math.min(startIndex, roleDataState.size);
  };

  const calculateEndIndex = () => {
    if (!roleDataState || !roleDataState.size) return 0;
    const endIndex = Math.min(page * limit, roleDataState.size);
    return endIndex;
  };

  return (
    <React.Fragment>
      {!addRole ? (
        <Box className='general-box'>
          <Box sx={{ bgcolor: 'background.paper', position:'sticky', top: "18.7%", zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" className='role-title inter-med' mb={2}>
                Administrators account
              </Typography>
              <Typography variant="h6" className='role-text inter-med'>
                Find all of your company's administrator account and their associate roles.
              </Typography>
            </Box>
            {roleData?.roles?.add ?
              <Button variant="contained" className='addButton' onClick={handleAddButtonClick}>
                Add
              </Button> :
              null}
          </Box>
          <Box sx={{ width: "100%" }} mt={1}>
            <Grid container className="content-center" rowGap={1} columnGap={1} columns={12} spacing={2} mt={2}>
              <Grid item xs={12} sm={4} md={4} lg={3}>
                <TextField
                  className='list-input-field'
                  variant="outlined"
                  label="Role name"
                  inputRef={roleInputRef}
                  sx={{ width: "100%", backgroundColor: "#FFFFFF", border: '0px solid #FFFFFF', borderRadius: '3px' }}
                  size="small"
                  value={role}
                  onChange={handleName}
                  onKeyDown={handleKeyPress}
                  onKeyPress={(e: any) => {
                    const regex = REGEX.TEXT;
                    if (!regex.test(e.key) || role.length >= 30) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text/plain').trim();
                    setRole(pastedText);
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={3} ref={statusInputRef} onKeyDown={handleKeyPress}>
                <FormControl className='list-input-field' size="small" variant="outlined" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    {roleStatus?.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid ml={2} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px' }} xs={0.85} sm={0.85} md={0.85} lg={0.85}>
                <Tooltip style={{ marginLeft: '0px' }} title="Search">
                  <CustomIconButton size="small" sx={{ backgroundColor: "#fff" }} onClick={() => { loadRoles('search'); }}>
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
                  <TableCell className='table-header inter-med' align="left">Role</TableCell>
                  <TableCell className='table-header inter-med' align="left">Status</TableCell>
                  {roleData?.roles?.edit || roleData?.roles?.delete ?
                    <TableCell align='center' padding='normal'>Action</TableCell> :
                    null}
                </TableRow>
              </TableHead>
              <TableBody>
                {roleDataState && roleDataState?.data?.map((row: any, index: any) => {
                  if (row && row.status && row.status !== null) {
                    return (
                      <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCellCollapse align="center">
                          {(page - 1) * limit + index + 1}
                        </StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">{row && row.role ? row.role : '--'}</StyledTableCellCollapse>
                        <StyledTableCellCollapse align="left">
                          {row && row?.status && row.status !== null ?
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
                          {row.status !== 'DELETED' ?
                            <>
                              {roleData?.roles?.edit ?
                                <Button onClick={() => handleEditModalOpen(row?.id)}><img src={editIcon} alt='edit' /></Button> :
                                null}
                              {roleData?.roles?.delete ?
                                <Button onClick={() => handleDeleteClick(row)}><img src={deleteIcon} alt='delete' /></Button> :
                                null}
                            </> : null}
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
          {!roleDataState?.loading && roleDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Grid item xs={12}>
              <Typography className='error-text' component="h1" variant="h6">
                {roleDataState.message}
              </Typography>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center', bgcolor: 'background.paper' }} position={'sticky'} bottom={0}>
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
            <Typography ml={1.5}>{`${calculateStartIndex()} - ${calculateEndIndex()} of ${roleDataState?.size}`}</Typography>
          </Box>
            <Pagination page={page} count={Math.ceil(roleDataState?.size / limit)} size="small" onChange={handleChangePage} showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
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
              Are you sure want to delete this role?
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
              message={roleAddState?.message || roleUpdateState?.message || roleDeleteState?.message}
              type="success"
              onClose={handleSnackbarClose}
            />
          )}
          {isErrorSnackbarOpen && (
            <AppSnackbar
              showAlert={isErrorSnackbarOpen}
              message={roleDeleteState?.message}
              type="error"
              onClose={handleSnackbarClose}
            />
          )}
        </Box>) :
        (
          <RoleAdd roleId={selectedRoleId} onBack={handleCancelButtonClick} />
        )
      }
    </React.Fragment>
  )
}

export default RoleTabs;