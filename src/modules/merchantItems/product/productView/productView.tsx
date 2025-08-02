import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Typography, Table, TableBody, TableRow, TableContainer, Chip, FormControlLabel, 
  Stack, Switch
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductById, clearState as clearProductState } from '../../../../reduxState/merchantItemSlice/product/productUpdateSlice';
import { fetchProductViewDetailById, clearState } from '../../../../reduxState/merchantItemSlice/product/productViewSlice';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import Food from '../../../../assets/images/Food.svg'
import veg from '../../../../assets/images/veg.png'
import nonveg from '../../../../assets/images/non-veg.png'
import both from '../../../../assets/images/bothfoodType.png'
import errorImage from '../../../../assets/images/Error.png'
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../../commonToast/loader';
import { dateStringToObjectDayfirst } from '../../../utils/dateformat';
import VariantDetails from './variantTabView';
import { Role_Types } from '../../../utils/constant';
import { useForm, Controller } from 'react-hook-form';
import AppSnackbar, { IAppSnackbar } from '../../../commonToast/customizeAlert';
import _ from 'lodash'

const ProductVarientView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [leftTable, setLeftTable] = React.useState<any>([])
  const [rightTable, setRightTable] = React.useState<any>([])
  const productDetailState = useSelector((state: RootState) => state.productView.data);
  const updateTaskState = useSelector((state: RootState) => state.productUpdate)
  const error = useSelector((state: RootState) => state.productView.error);
  const navigate = useNavigate()
  const location = useLocation();
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [number, setNumber] = React.useState<any>('')

  useEffect(() => {
    if (location.state) {
      dispatch(fetchProductViewDetailById(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (productDetailState && productDetailState?.id) {
      const temRow = [
        createData('Product Price', productDetailState && productDetailState?.price ? `${'OMR'} ${productDetailState?.price}`: '--'),
        createData('Merchant Name', productDetailState && productDetailState?.merchantDetails && productDetailState?.merchantDetails?.merchantName ? productDetailState?.merchantDetails?.merchantName: '--'),
        createData('Branch Name', productDetailState && productDetailState?.branchDetails && productDetailState?.branchDetails?.branchName ? productDetailState?.branchDetails?.branchName: '--'),
        createData('Category Name', productDetailState && productDetailState?.categoryDetails && productDetailState?.categoryDetails?.categoryName ? productDetailState?.categoryDetails?.categoryName: '--'),
        createData('Shift Type', productDetailState && !_.isEmpty(productDetailState?.shiftTime) ?
          (productDetailState?.shiftTime.map((item: any) => `${item.name} (${item.fromTime} - ${item.toTime})`).join(', ')) : '--'),
      ]
      setLeftTable(temRow)
    }

  }, [productDetailState]);

  useEffect(() => {
    if (productDetailState && productDetailState?.id) {
      setNumber(productDetailState.status === "ACTIVE"? true : false)
      const temRow = [
        createData('Description', productDetailState && productDetailState?.description ? productDetailState?.description: '--'),
        createData('Created Date', productDetailState && productDetailState?.createdDate ? dateStringToObjectDayfirst(productDetailState?.createdDate): '--'),
        createData('Status', productDetailState && productDetailState?.status ? (productDetailState?.status === "ACTIVE" ? (<Chip size='small' label={productDetailState?.status} className='status-active-chip' variant="outlined" />) :
          productDetailState?.status === "INACTIVE" ? (<Chip size='small' label={productDetailState?.status} className='status-inactive-chip' variant="outlined" />) :
            (<Chip size='small' label={productDetailState?.status} className='status-deleted-chip' variant="outlined" />)): '--'),
        createData('Cuisine Type', productDetailState && productDetailState?.categoryTypeDetails && productDetailState?.categoryTypeDetails?.name ? (
              <Typography className='cuisine-type-chip cuisine-type-text'>{productDetailState?.categoryTypeDetails?.name}</Typography>
            ) : '--'),
      ]
      setRightTable(temRow)
    }

  }, [productDetailState]);

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const handleEditClick = (productDetailState: any) => {
    navigate("/merchant-items/product/edit", { state: productDetailState.id })
  }

  const handleCloseProductView = () => {
    dispatch(clearState());
    navigate('/merchant-items/product');
  }

  React.useEffect(() => {
    return () => {
    dispatch(clearState());
  }
  },[])
  
  const onSubmit = () => {
      const params = {
        ...productDetailState, 
        status: number === true ? 'ACTIVE' : 'INACTIVE',
        id: productDetailState?.id
      }
      dispatch(updateProductById(params));
  }

  React.useEffect(() => {
    if (updateTaskState?.status === "succeeded") {
      setIsSnackbarOpen(true);
    }
  }, [updateTaskState]);

  React.useEffect(() => {
    if (updateTaskState?.error === true) {
      setIsErrorSnackbarOpen(true);
    }
  }, [updateTaskState]);

  React.useEffect(() => {
    if (updateTaskState?.code === 200) {
      navigate('/merchant-items/product');
      setTimeout(() => {
        dispatch(clearProductState())
      }, 2000)
    }
  }, [updateTaskState])

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false)
    setIsErrorSnackbarOpen(false);
    dispatch(clearProductState());
  };

  return (
    <Fragment>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '18px', width: '100%' }}>
        {error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh' }}>
            <Box textAlign={'center'}>
              <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
              <Typography my={3} color="error">{error}</Typography>
            </Box>
          </Box>
        ) :
          <>
            {location.state !== productDetailState?.id ? (<Loading />) :
              (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box style={{ backgroundColor: '#FFFAF8', borderRadius: '20px' }}>
                      <Grid container spacing={2} p={2}>
                        <Grid item sm={12} md={5} lg={3}>
                          <Box px={2} py={{md: 0, lg: 3}}  textAlign={{sm:'center', md:'start'}}>
                            {productDetailState && productDetailState?.images?.length > 0 ? (
                              <img src={`${process.env.REACT_APP_API_BASE_URL}${productDetailState?.images[0]?.filePath}`} alt={`Branch Img`} style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />
                            ) : (
                              <img src={Food} alt="Branch Img" style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />
                            )}
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={7} lg={9}>
                          <Box>
                            <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Grid item lg={4} display='flex' alignItems={'center'} justifyContent={'space-between'}>
                                <h3 className='merchant-name' style={{
                                  paddingLeft: '10px',
                                  maxWidth: "auto",
                                  whiteSpace: "normal",
                                }}>{productDetailState?.productName}</h3>
                                <Box pl={1.5}>
                                  {productDetailState?.isVeg === "Veg" ? (
                                    <img
                                      src={veg}
                                      alt="veglogo"
                                      style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', width: '25px', height: '25px' }}
                                    />
                                  ) : productDetailState?.isVeg === "NonVeg" ? (
                                    <img
                                      src={nonveg}
                                      alt="non-veglogo"
                                      style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', width: '25px', height: '25px' }}
                                    />
                                  ) : productDetailState?.isVeg === "Both" ? (
                                    <>
                                      <img
                                        src={both}
                                        alt="bothlogo"
                                        style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', width: '60px', height: '35px' }}
                                      />
                                    </>
                                  ) : null}
                                </Box>
                              </Grid>
                              <Grid item lg={4.75}></Grid>
                              {roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant ?
                                <>
                                  <Grid item lg={2.75} display='flex' justifyContent='flex-end' px={{md:0, lg:2}}>
                                    <Button className='styledButtonSave' onClick={() => handleEditClick(productDetailState)}>Edit</Button>
                                  </Grid>
                                </> : roles_data?.role === Role_Types.Branch ?
                                  <>
                                    <Grid item lg={2.75} display='flex' justifyContent='flex-end' px={{md:0, lg:2}}>

                                      <Stack direction="row" alignItems="center">
                                        <Switch
                                          checked={number}
                                          onChange={(e) => setNumber(e.target.checked)}
                                          color={number ? 'warning' : 'default'}
                                        />
                                        <Typography className={number === true ? 'branch-status-active' : 'branch-status-inactive'}>{number === true ? 'Active' : 'Inactive'}</Typography>
                                      </Stack>

                                    </Grid>
                                  </> : null}
                            </Grid>
                            <Grid container justifyContent={'space-between'} spacing={2} columns={15}>
                              <Grid item sm={12} md={12} lg={8}>
                                <TableContainer sx={{ maxWidth: "auto" }}>
                                  <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                                    <TableBody>
                                      {leftTable.map((row: any) => (
                                        <TableRow
                                          key={row.name}
                                          sx={{ border: 0, borderStyle: 'hidden' }}
                                        >
                                          <TableCell className='merhchat-view-table'>{row.name}</TableCell>
                                          <TableCell className='customer-second-table'>  
                                          <Typography className='view-details-row-data'>
                                            {row.value}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                              <Grid item sm={12} md={12} lg={6}>
                                <TableContainer sx={{ maxWidth: "auto" }}>
                                  <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                                    <TableBody>
                                      {rightTable.map((row: any) => (
                                        <TableRow
                                          key={row.name}
                                          sx={{ border: 0, borderStyle: 'hidden' }}
                                        >
                                          <TableCell className='merhchat-view-table'>{row.name}</TableCell>
                                          <TableCell className='customer-second-table'>
                                            <Typography className='view-details-row-data'>
                                            {row.value}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box px={4}>
                      <VariantDetails id={location.state} />
                    </Box>
                  </Grid>
                  {roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant ?
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Button className='styledButtonCancel' style={{ marginBottom: '24px' }} variant="outlined" color="secondary" onClick={handleCloseProductView}>Cancel</Button>
                        </Box>
                      </Grid>
                    </>:
                    roles_data?.role === Role_Types.Branch ? 
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                          <Button className='styledButtonCancel' variant="outlined" color="secondary" type="submit" onClick={handleCloseProductView}>Cancel</Button>
                          <Button className='styledButtonSave' variant="contained" type="submit" onClick={onSubmit} style={{ marginLeft: '2px' }}>
                            Update
                          </Button>
                        </Box>
                      </Grid>
                    </> : null}
                </Grid>)
            }
          </>
        }
      </Box>
      {isSnackbarOpen && (
        <AppSnackbar
          showAlert={isSnackbarOpen}
          message={updateTaskState?.message}
          type="success"
          onClose={handleSnackbarClose}
        />
      )}
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={updateTaskState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment>
  )
}

export default ProductVarientView;
