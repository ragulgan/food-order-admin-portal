import React, { Fragment } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import { Role_Types } from '../utils/constant';

interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  name: any;
  image: any
}

const SignOutModal: React.FC<any> = ({ open, onConfirm, onClose, name, image }: ConfirmationModalProps) => {
  const theme = useTheme();
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} className='signout-list'>
        <DialogTitle sx={{ color: theme.palette.info.light, textAlign: 'center' }}>Signout</DialogTitle>
        <Box sx={{display:'flex', justifyContent: 'center'}}>
        {roles_data?.role !== Role_Types.Admin ? image : null
        // <>
        // <Avatar className="logout-img" sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.main }}>
        //   <PersonIcon />
        // </Avatar>
        // </>
        }
        </Box>
        <DialogContent>
          Are you sure want to Signout ?
          <Typography textAlign={'center'} mt={1} sx={{color: theme.palette.warning.main }}>{roles_data?.role !== Role_Types.Admin ? (`${name}`): null}</Typography>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button className='styledButtonSave' variant="contained" onClick={onConfirm}>Signout</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default SignOutModal;