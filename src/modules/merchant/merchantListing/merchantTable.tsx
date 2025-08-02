import * as React from 'react';
import {
  Box, Collapse, Table, IconButton, TableBody, TableHead, TableRow, Typography, DialogActions,
  Avatar, Chip, Menu, MenuItem, ListItemIcon, Dialog, CircularProgress, DialogTitle, DialogContent, Button
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import merchantImg from '../../../assets/images/merchantEmpImage.svg'
import dropDown from '../../../assets/images/dropDown.png'
import dropUp from '../../../assets/images/dropUp.png'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../reduxState/store';
import { deleteMerchantById } from '../../../reduxState/merchantSlice/merchantDeleteSlice';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash'

const StyledTableCellCollapse = styled(TableCell)(({ theme }) => ({
  maxWidth: "150px", overflow: "scroll", textOverflow: "clip", whiteSpace: "nowrap", scrollBar: 'none',
  '&::-webkit-scrollbar': {
    display: 'none !important',
  },
  padding: '16px',
  borderBottom: '0px'
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

interface Merchant {
  id: string;
  image: string;
  merchantId: string;
  restaurantName: string;
  contactName: string;
  contactNo: string;
  contactEmail: string;
  branchCount: string;
  branches: [
    {
      id: string;
      branchName: string;
      contactName: string;
      status: string;
    }
  ];
  status: string;
  businessDescription: string;
  createdDate: string;
}

const Row = (props: { merchant: any, refreshTable: any, index: any, page: any, limit: any }) => {
  const { merchant, refreshTable, index, page, limit } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMerchant, setSelectedMerchant] = React.useState<Merchant | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();
  // roles
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

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

  const handleEditModalOpen = (merchant: any) => {
    navigate("/merchants/edit", { state: merchant.id })
  };

  const handleViewModalOpen = (merchant: any) => {
    navigate("/merchants/view", { state: merchant.id })
  };

  const handleDeleteClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMerchant) {
      setIsDeleting(true);
      dispatch(deleteMerchantById(selectedMerchant.id))
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

  const deleteMenuModelClose = () => {
    handleMenuClose()
    setDeleteModal(false)
  }

  if (merchant && merchant.status && merchant.status !== null) {
  return (
    <React.Fragment>
      <StyledTableRow
        key={merchant.id}
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell className='list-data list-table-cell' align="center">{(page - 1) * limit + index + 1}</TableCell>
        <TableCell className='list-data list-table-cell' align="left">{merchant && merchant.merchantId ? merchant.merchantId : '--'}</TableCell>
        <TableCell className='list-data list-table-cell' align="left">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {merchant && merchant.image && merchant.image.id !== null ? (
              <Avatar alt={`Img`} src={`${process.env.REACT_APP_API_BASE_URL}${merchant?.image?.filePath}`} sx={{ marginRight: '10px' }} />
            ) : (<Avatar alt={`Img`} src={merchantImg} sx={{ marginRight: '10px' }} />)}
            <span className='list-data'>{merchant && merchant?.restaurantName ? merchant?.restaurantName : '--'}</span>
          </div>
        </TableCell>
        <TableCell className='list-data list-table-cell' align="left">{merchant && merchant.contactName ? merchant.contactName : '--'}</TableCell>
        <TableCell className='list-data list-table-cell' align="left">{merchant && merchant.contactNo ? merchant.contactNo.replace(/[^\d]/g, '').replace(/^91/, '') : '--'}</TableCell>
        <TableCell className='list-data' align="center">
          {merchant && merchant.status && merchant.status !== null ?
            <>
              {merchant.status === 'ACTIVE' && (
                <Chip size='small' label={merchant.status} className='status-active-chip' variant="outlined" />
              )}
              {merchant.status === 'INACTIVE' && (
                <Chip size='small' label={merchant.status} className='status-inactive-chip' variant="outlined" />
              )}
              {merchant.status === 'DELETED' && (
                <Chip size='small' label={merchant.status} className='status-deleted-chip' variant="outlined" />
              )}
            </> : '--'}
        </TableCell>
        {roleData?.merchants?.view || roleData?.merchants?.edit || roleData?.merchants?.delete ?
          <TableCell className='list-data' align="center">
            {merchant.status !== 'DELETED' ?
              <>
                <IconButton onClick={(event) => handleMenuOpen(event, merchant.id)}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </> : null}
            <Menu
              anchorEl={anchorEl}
              open={selectedId === merchant.id}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{
                vertical: 'top', horizontal: 'right',
              }}
              className='border-radius-mine'
            >
              {roleData?.merchants?.view ?
                <MenuItem onClick={() => handleViewModalOpen(merchant)}>
                  <ListItemIcon>
                    <VisibilityIcon style={{ color: '#FD973B' }} fontSize="small" />
                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>View</Typography>
                  </ListItemIcon>
                </MenuItem> :
                null}
              {roleData?.merchants?.edit ?
                <MenuItem onClick={() => handleEditModalOpen(merchant)}>
                  <ListItemIcon>
                    <EditIcon style={{ color: '#FD973B' }} fontSize="small" />
                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>Edit</Typography>
                  </ListItemIcon>
                </MenuItem> :
                null}
              {roleData?.merchants?.delete ?
                <MenuItem onClick={() => handleDeleteClick(merchant)}
                // sx={{ display: merchant.status === 'DELETED' ? 'none' : 'block'}}
                >
                  <ListItemIcon>
                    <DeleteOutlinedIcon style={{ color: '#FD973B' }} fontSize="small" />
                    <Typography className='list-data' style={{ paddingLeft: '8px' }}>Delete</Typography>
                  </ListItemIcon>
                </MenuItem> :
                null}
            </Menu>
          </TableCell> :
          null}
        {/* <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <img src={dropDown} alt="ArrowDown" /> : <img src={dropUp} alt="ArrowUp" />}
          </IconButton>
        </TableCell> */}
      </StyledTableRow>
      <StyledTableRow style={{ paddingLeft: '10px' }}>
        <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0, borderLeft: '3px solid #FB640A' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {merchant && !_.isEmpty(merchant.branchCount) ?  
            <>
            <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow sx={{ border: "1px solid #FFFFFF" }}>
                      <TableCell className='list-header'>#</TableCell>
                      <TableCell className='list-header'>Branch</TableCell>
                      <TableCell className='list-header'>Contact Name</TableCell>
                      <TableCell className='list-header'>Phone Number</TableCell>
                      <TableCell className='list-header'>Email</TableCell>
                      <TableCell className='list-header'>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {merchant && !_.isEmpty(merchant.branchCount) ?
                      (merchant.branches.map((branch: any, index: any) => (
                        <StyledTableRow key={branch.id} sx={{ border: '0px' }}>
                          <StyledTableCellCollapse>{index + 1}</StyledTableCellCollapse>
                          <StyledTableCellCollapse>{branch.branchType === 'MainBranch' ? (<>{branch.branchName}<span style={{ color: '#FB640A', paddingLeft: '10px' }}>(Main)</span></>) :
                            (branch.branchName)}
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse>{branch.contactName}</StyledTableCellCollapse>
                          <StyledTableCellCollapse>{branch.contactNo}</StyledTableCellCollapse>
                          <StyledTableCellCollapse>{branch.contactEmail}</StyledTableCellCollapse>
                          <StyledTableCellCollapse>
                            {branch.status === 'ACTIVE' && (
                              <Typography sx={{ color: '#2e7d32' }}>{branch.status}</Typography>
                            )}
                            {branch.status === 'INACTIVE' && (
                              <Typography sx={{ color: '#ed6c02' }}>{branch.status}</Typography>
                            )}
                            {branch.status === 'DELETED' && (
                              <Typography sx={{ color: '#d32f2f' }}>{branch.status}</Typography>
                            )}
                          </StyledTableCellCollapse>
                        </StyledTableRow>
                      ))) : null}
                  </TableBody>
                </Table>
              </Box>
            </>: 
            (<p style={{ textAlign: 'center', color: 'red' }}>No branches under this merchant</p>) 
            }
          </Collapse>
        </TableCell>
      </StyledTableRow>
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className='signout-list'>
        <DialogTitle sx={{ color: theme.palette.error.light }}>Warning!</DialogTitle>
        <DialogContent>
          Are you sure want to delete this Merchant?
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
    </React.Fragment>
  );
} else {
  return null;
}
}

export default Row
