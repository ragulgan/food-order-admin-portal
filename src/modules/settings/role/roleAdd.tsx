import * as React from 'react';
import {
  Typography, Box, Button, Table, TableBody,
  TableContainer, TableHead, TableRow, Grid, TextField, Autocomplete, Checkbox, CircularProgress,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchConfig, clearListState as clearState } from '../../../reduxState/settingSlice/roleSlice/roleConfig';
import { addRole, clearAddState } from '../../../reduxState/settingSlice/roleSlice/roleAddSlice';
import { updateRoleById, clearUpdateState } from '../../../reduxState/settingSlice/roleSlice/roleUpdateSlice';
import { fetchRoleById, clearViewState } from '../../../reduxState/settingSlice/roleSlice/roleViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import AppSnackbar, { IAppSnackbar } from '../../commonToast/customizeAlert'
import { Role_Types } from '../../utils/constant';

const StyledTableCellCollapse = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  maxWidth: "100px",
  whiteSpace: "normal",
  padding: '16px',
  borderBottom: '0px'
}));

interface ConfirmationModalProps {
  onBack: () => void;
  roleId: any;
}

const RoleStatus: any = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
]

const RoleType: any = [
  { value: 'ROLE_BRANCH', name: 'Branch' },
  { value: 'ROLE_MERCHANT', name: 'Merchant' },
  { value: 'ROLE_ADMIN', name: 'Admin' },
]

const RoleAdd: React.FC<any> = ({ onBack, roleId }: ConfirmationModalProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const configLoadState = useSelector((state: RootState) => roleId ? state.roleView : state.config)
  const configDataState = useSelector((state: RootState) => roleId ? state.roleView.data?.menus : state.config.data);
  const addTaskState = useSelector((state: RootState) => state.roleAdd);
  const updateTaskState = useSelector((state: RootState) => state.roleUpdate);
  const readTaskState = useSelector((state: RootState) => state.roleView);
  const [editValue, setEditValue] = React.useState<any>([]);
  const [formData, setFormData] = React.useState<any>([]);
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState<boolean>(false);
  const [roleName, setRoleName] = React.useState<string>('');

  React.useEffect(() => {
    if (addTaskState?.error === true || updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      },2000)
    }
  }, [addTaskState, updateTaskState]);

  React.useEffect(() => {
    if(roleId.length === 0 ) {
      dispatch(fetchConfig(''));
    }else {

    }
  }, [roleId])

  React.useEffect(() => {
    if (configLoadState && configLoadState?.code === 200)
      setFormData(configDataState)
  }, [configDataState])

  const validationSchema = yup.object().shape({
    menus: yup.array().required(''),
    role: yup.string().required(''),
    status: yup.object().required(''),
    type: yup.object().required('')
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      menus: [''],
      role: '',
      status: '',
      type: ''
    }
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    // const TypePayload = readTaskState?.data && readTaskState?.data?.type === Role_Types.Admin || readTaskState?.data && readTaskState?.data?.type === Role_Types.Merchant || readTaskState?.data && readTaskState?.data?.type === Role_Types.Branch ? readTaskState?.data?.type : Role_Types.Other
    const payload: any = {
      menus: formData,
      role: event.role.trim(),
      status: event.status.value,
      // type: TypePayload,
      type: event.type.value,
    }
    if (roleId) {
      payload.id = roleId;
      dispatch(updateRoleById(payload));
    }
    else {
      dispatch(addRole(payload));
    }
  };

  React.useEffect(() => {
    if (addTaskState?.code === 200 || updateTaskState?.code === 200) {
      reset();
      dispatch(clearViewState())
      onBack();
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearUpdateState());
      }, 3000)
    }
  }, [addTaskState, updateTaskState])

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
  }
  },[])

  React.useEffect(() => {
    if (roleId) {
      dispatch(fetchRoleById(roleId));
    }
  }, [roleId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const setMenus = readTaskState && readTaskState.data && readTaskState.data.menus
      const Status = RoleStatus.find((item: any) => item.value === readTaskState?.data?.status);
      const Type = RoleType.find((item: any) => item.value === readTaskState?.data?.type);
      const RoleName = readTaskState?.data?.type;
      setRoleName(RoleName)
      setEditValue(setMenus)
      reset({
        menus: readTaskState?.data?.menus,
        role: readTaskState?.data?.role,
        status: Status,
        type: Type
      })
    }
  }, [readTaskState])

  const handleCheckBox = (e: any, index: any) => {
    if (e.target.checked === true) {
      setFormData(formData?.map((item: any, i: any) =>
        i === index ? {
            ...item,
            [e.target.name]: "true"
          }
          : item
      ))
    } else if (e.target.checked === false) {
      setFormData(formData?.map((item: any, i: any) =>
        i === index ? {
            ...item,
            [e.target.name]: "false"
          }
          : item
      ))
    }
  }

  const handleOnCloseModal = () => {
    reset({
      menus: [''],
      role: '',
      status: '',
      type: ''
    });
    dispatch(clearViewState())
    onBack();
  }

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  return (
    <React.Fragment>
      <Box className='general-box' mt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item sm={12} md={4} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Role
              </Typography>
              {roleName === 'ROLE_ADMIN' ?
              <Controller
              name="role"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  id="role"
                  label="Type here"
                  name="role"
                  disabled
                  value={value || ''}
                  onChange={onChange}
                  error={!!error}
                  inputProps={{
                    onKeyPress: (event) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(event.key) || value.length >= 30) {
                        event.preventDefault();
                      }
                    }
                  }}
                  InputProps={{
                    autoComplete: 'off',
                    sx: {
                      borderRadius: '8px'
                    }
                  }}
                />
              )}
            /> : <Controller
            name="role"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                margin="normal"
                fullWidth
                id="role"
                label="Type here"
                name="role"
                required
                className='required-asterisk-color'
                autoFocus
                value={value || ''}
                onChange={onChange}
                error={!!error}
                inputProps={{
                  onKeyPress: (event) => {
                    const regex = /^[a-zA-Z\s]+$/;
                    if (!regex.test(event.key) || value.length >= 30) {
                      event.preventDefault();
                    }
                  }
                }}
                InputProps={{
                  autoComplete: 'off',
                  sx: {
                    borderRadius: '8px'
                  }
                }}
              />
            )}
          />}
            </Grid>
            <Grid item sm={12} md={4} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Role Type
              </Typography>
              {roleName === 'ROLE_ADMIN' ?
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, onChange, value } }) => (
                    <Autocomplete
                      sx={{ marginTop: '8px' }}
                      disablePortal
                      disabled
                      fullWidth
                      id="type"
                      className='merchant-border-radius'
                      value={value || null}
                      options={RoleType}
                      getOptionLabel={(option: any) => option.name || ''}
                      onChange={(_, data: any) => { onChange(data) }}
                      renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                      }} label="Role Type" />)}
                      clearOnBlur={value ? true : false}
                    />
                  )}
                /> : <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Type required' }}
                  render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      sx={{ marginTop: '8px' }}
                      disablePortal
                      disabled={editShow ? true : false}
                      fullWidth
                      id="type"
                      className='merchant-border-radius required-asterisk-auto-color'
                      value={value || null}
                      options={RoleType}
                      getOptionLabel={(option: any) => option.name || ''}
                      onChange={(_, data: any) => { onChange(data) }}
                      renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                      }} error={!!error} label="Role Type" InputLabelProps={{ required: true }} />)}
                      clearOnBlur={value ? true : false}
                    />
                  )}
                />}
            </Grid>
            <Grid item sm={12} md={4} lg={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography className='role-add-label'>
                Status
              </Typography>
              {roleName === 'ROLE_ADMIN' ? 
              <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field: { ref, onChange, value } }) => (
                <Autocomplete
                  sx={{ marginTop: '8px' }}
                  disablePortal
                  disabled
                  fullWidth
                  id="status"
                  className='merchant-border-radius'
                  value={value || null}
                  options={RoleStatus}
                  getOptionLabel={(option: any) => option.name || ''}
                  onChange={(_, data: any) => { onChange(data) }}
                  renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                    ...params.inputProps,
                    autoComplete: 'off',
                  }} label="Status" />)}
                  clearOnBlur={value ? true : false}
                />
              )}
            />: <Controller
            name="status"
            control={control}
            defaultValue=""
            rules={{ required: 'status required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                sx={{ marginTop: '8px' }}
                disablePortal
                fullWidth
                id="status"
                className='merchant-border-radius required-asterisk-auto-color'
                value={value || null}
                options={RoleStatus}
                getOptionLabel={(option: any) => option.name || ''}
                onChange={(_, data: any) => { onChange(data) }}
                renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                  ...params.inputProps,
                  autoComplete: 'off',
                }} error={!!error} label="Status" InputLabelProps={{ required: true }} />)}
                clearOnBlur={value ? true : false}
              />
            )}
          />} 
            </Grid>
            <Grid item xs={12}>
              <TableContainer sx={{ mt: 2 }}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className='table-header inter-med' align="left">Module</TableCell>
                      <TableCell className='table-header inter-med' align="center">Add</TableCell>
                      <TableCell className='table-header inter-med' align="center">Edit</TableCell>
                      <TableCell className='table-header inter-med' align="center">View</TableCell>
                      <TableCell className='table-header inter-med' align="center">visible</TableCell>
                      {/* <TableCell className='table-header inter-med' align="center">export</TableCell> */}
                      <TableCell className='table-header inter-med' align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {configLoadState.loading ? (
                      <CircularProgress />
                    ) : configDataState && configDataState?.length > 0 ? (
                      configDataState?.map((menu: any, index: any) => (
                        roleName === 'ROLE_ADMIN' ? (
                          <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <StyledTableCellCollapse align="left">
                            {menu.name.charAt(0).toUpperCase() + menu.name.slice(1)}
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox disabled color='warning' name='add' defaultChecked={menu.add === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox disabled color='warning'name='edit' defaultChecked={menu.edit === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox disabled  color='warning' name='view' defaultChecked={menu.view === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox disabled color='warning' name='visible' defaultChecked={menu.visible === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          {/* <StyledTableCellCollapse align="center">
                            <Checkbox disabled color='warning' name='export' defaultChecked={menu.export === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse> */}
                          <StyledTableCellCollapse align="center">
                            <Checkbox disabled color='warning' name='delete' defaultChecked={menu.delete === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                        </TableRow>
                        ): 
                        (
                          <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <StyledTableCellCollapse align="left">
                            {menu.name.charAt(0).toUpperCase() + menu.name.slice(1)}
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='add' defaultChecked={menu.add === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='edit' defaultChecked={menu.edit === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='view' defaultChecked={menu.view === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='visible' defaultChecked={menu.visible === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                          {/* <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='export' defaultChecked={menu.export === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse> */}
                          <StyledTableCellCollapse align="center">
                            <Checkbox color='warning' name='delete' defaultChecked={menu.delete === true} onChange={(e) => { handleCheckBox(e, index) }} />
                          </StyledTableCellCollapse>
                        </TableRow>
                        )
                      ))
                    ) : (
                      <Typography variant="subtitle1">No configuration data available.</Typography>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                {roleName === 'ROLE_ADMIN' ?
                  <>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Discard</Button>
                  </> :
                  <>
                    <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Discard</Button>
                    <Button className='styledButtonSave' variant="contained" type="submit" disabled={addTaskState?.loading || updateTaskState?.loading} onClick={handleSubmit(onSubmit)}>
                      {
                        addTaskState?.loading || updateTaskState?.loading === true ? <CircularProgress size={24} style={{ color: '#ffffff', marginLeft: '2px' }} /> :
                          !editShow ? 'Save' : 'Update'
                      }
                    </Button>
                  </>}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={addTaskState?.message || updateTaskState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </React.Fragment>
  )
}

export default RoleAdd;