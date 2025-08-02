import * as React from 'react';
import {
  Box, Button, Grid, Typography, TableContainer, Table,
  TableBody, TableRow, Chip, Divider,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, clearViewState } from '../../../reduxState/orderSlice/orderViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import { formatDisplayMonth } from '../../utils/dateformat'
import Loading from '../../commonToast/loader';
import ordercus from '../../../assets/images/ordercus.png'
import orderDummy from '../../../assets/images/Category.svg'
import driver from '../../../assets/images/driverdeliver.png'
import errorImage from '../../../assets/images/Error.png'
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';

const OrderView: React.FC<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [rightTable, setRightTable] = React.useState<any>([])
  const order = useSelector((state: RootState) => state.orderView?.data);
  const error = useSelector((state: RootState) => state.orderView?.error);

  React.useEffect(() => {
    if (location.state) {
      setTimeout(() => {
        dispatch(fetchOrderById(location.state));
      }, 2000);
    }
  }, [location.state]);

  React.useEffect(() => {
    if (order && order?.id) {
      const temRow = [
        createData('Sub Total', order && order?.subTotalAmt ? `${'OMR'} ${order?.subTotalAmt}` : '--'),
        createData('Delivery Charge', order?.dlvCharges ? `${'OMR'} ${order?.dlvCharges}` :
          '--'),
        createData('Offer applied', order && order?.isCoupenApplied ? (`${String.fromCharCode(0x2212)} ${'OMR'} ${order?.coupenAmount}`) :
          order && order?.offerApplied ? (`${String.fromCharCode(0x2212)} ${'OMR'} ${order?.offerAmount}`) :
            '--'),
        createData('Total Amount', order && order?.totAmt ? <Typography className='total-fontsize'>{'OMR'} {order?.totAmt}</Typography> :
          '--'),
      ]
      setRightTable(temRow)
    }
  }, [order]);

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const handleCloseMerchantView = () => {
    navigate('/orders/list');
    dispatch(clearViewState());
  }

  React.useEffect(() => {
    return () => {
    dispatch(clearViewState());
  }
  },[])

  return (
    <React.Fragment>
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
            {location.state !== order?.id ? (<Loading />) :
              (
                <>
                  <Typography className='view-header' textAlign={'center'} py={2}>Order Details</Typography>
                  <Grid container spacing={2} px={{sm: 2, md: 4}}>
                    <Grid item xs={5} sm={4.5} md={5.25} lg={5.5}>
                      <Typography className='user-section' mb={1}>{order && order?.orderId ? order?.orderId : '--'}</Typography>
                      <Typography className='user-section'>{order && order?.createdDate ? formatDisplayMonth(order?.createdDate) : '--'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={7} md={6.75} lg={6.5} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                      {order && order.orderSts && order.orderSts !== null ?
                        <>
                          {order?.orderSts === 'OrderDelivered' && (
                            <Chip size='small' className='order-status od-color' label={'DELIVERED'} />
                          )}
                          {order?.orderSts === 'OrderCancelled' && (
                            <Chip size='small' className='order-status oc-color' label={'CANCELLED'} />
                          )}
                          {order?.orderSts === 'OrderPlaced' && (
                            <Chip size='small' className='order-status op-color' label={'PLACED'} />
                          )}
                          {order?.orderSts === 'OrderConfirmed' && (
                            <Chip size='small' className='order-status ocd-color' label={'CONFIRMED'} />
                          )}
                          {order?.orderSts === 'OrderPicked' && (
                            <Chip size='small' className='order-status opickup-color' label={'PICKED'} />
                          )}
                          {order?.orderSts === 'OrderIsPreparing' && (
                            <Chip size='small' className='order-status oprep-color' label={'PREPARING'} />
                          )}
                          {order?.orderSts === 'OrderOutForDelivery' && (
                            <Chip size='small' className='order-status ood-color' label={'OUT FOR DELIVERY'} />
                          )}
                          {order?.orderSts === 'OrderReady' && (
                            <Chip size='small' className='order-status or-color' label={'READY'} />
                          )}
                          {order?.orderSts === 'OrderReceived' && (
                            <Chip size='small' className='order-status orr-color' label={'RECEIVED'} />
                          )}
                        </> : '--'}
                      <Box display={'flex'} alignItems={'center'}>
                        <Box>
                          {order && order?.customerDetails && order?.customerDetails?.profile && !_.isNull(order?.customerDetails?.profile) || order && order?.customerDetails && order?.customerDetails?.profile && !_.isEmpty(order?.customerDetails?.profile) ? (
                            <img src={`${process.env.REACT_APP_API_BASE_URL}${order?.customerDetails?.profile}`} alt="img" className='order-customer-img' width='60px' height='60px' style={{ borderRadius: '50px', objectFit: 'cover' }} loading='lazy' />
                          ) :
                            (<img src={ordercus} alt="img" width='60px' height='60px' style={{ borderRadius: '50px', objectFit: 'cover' }} loading='lazy' />)
                          }
                        </Box>
                        <Box px={2}>
                          <Typography className='customer-name'>{order && order?.customerDetails && order?.customerDetails?.customerName ? order?.customerDetails?.customerName : '--'}</Typography>
                          <Typography className='customer-profile'>{order && order?.customerDetails && order?.customerDetails?.mobileNumber ? `${'+91'} ${order?.customerDetails?.mobileNumber}` : '--'}</Typography>
                          <Typography className='customer-profile'>{order && order?.customerDetails && order?.customerDetails?.emailId ? order?.customerDetails?.emailId : '--'}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid container columns={15} spacing={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'} px={2}>
                      <Grid item xs={6} sm={6} md={5}>
                        <Box>
                          <Typography className='customer-address-header'>Branch Address</Typography>
                          {
                            order && !_.isEmpty(order?.branchDetails) ?
                              <Box key={order?.branchDetails?.id}>
                                <Typography className='customer-address' py={1}>{order?.branchDetails?.branchName}</Typography>
                                <Typography className='deliver-address'>{order?.branchDetails?.branchAddress}</Typography>
                                <Typography className='deliver-address'>{order?.branchDetails?.branchLocation}</Typography>
                              </Box> : '--'
                          }
                        </Box>
                      </Grid>
                      <Grid item xs={1} sm={2} md={2}>
                        <Box textAlign={'center'}>
                          <Typography>--- <span className='mile-style'>{order && order?.distanceBetweenBranchAndUser ? order?.distanceBetweenBranchAndUser : '0 km'}</span> ---
                          </Typography>
                          <Typography className='order-to-reach' variant="h6" align='center'> To reach
                          </Typography>
                          <Typography><span className='mile-style'>{order && order?.time ? order?.time : '0 min'}</span>
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6} md={5}>
                        <Box>
                          <Typography className='customer-address-header'>Delivery Address</Typography>
                          <Box>
                            <Typography className='customer-address' py={1}>{`${order && order?.dlvAddrs && order?.dlvAddrs?.contactName ? order?.dlvAddrs?.contactName : ''} (${order && order?.dlvAddrs && order?.dlvAddrs?.contactNo ? order?.dlvAddrs?.contactNo : ''})`}</Typography>
                            <Typography className='customer-address'>{order?.dlvAddrs?.addressType}
                            {order && order?.paymentMode === "CashOnDelivery" ? 
                            <>
                            <Chip size='small' className='order-payment-cash-chip order-payment-text' label={'COD'} />
                            </>: order && !_.isEmpty(order?.paymentMode) || order?.paymentMode === "UPI" || order?.paymentMode === "Upi" ? 
                            <>
                            <Chip size='small' className='order-payment-upi-chip order-payment-text' label={'UPI'} /></> : null}
                            </Typography>
                            <Typography className='deliver-address'>{`${order && order?.dlvAddrs && order?.dlvAddrs?.streetAddress ? order?.dlvAddrs?.streetAddress : ''}${','} ${order && order?.dlvAddrs && order?.dlvAddrs?.area ? order?.dlvAddrs?.area : ''}${','} ${order && order?.dlvAddrs && order?.dlvAddrs?.landMark ? order?.dlvAddrs?.landMark : ''} ${'-'} ${order && order?.dlvAddrs && order?.dlvAddrs?.zipCode ? order?.dlvAddrs?.zipCode : ''}`}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3} textAlign={'start'} mt={1}>
                      <Typography className='driver-profile' mb={1} textAlign={'center'}>Driver details</Typography>
                        <Box display={'flex'} alignItems={'center'}>
                          <Box>
                            {order && order?.driverDetails && order?.driverDetails?.profile && !_.isNull(order?.driverDetails?.profile) && !_.isNull(order?.driverDetails?.profile?.id) || order && order?.driverDetails && order?.driverDetails?.profile && !_.isEmpty(order?.driverDetails?.profile) && !_.isEmpty(order?.driverDetails?.profile?.id) ? (
                              <img src={`${process.env.REACT_APP_API_BASE_URL}${order?.driverDetails?.profile?.filePath}`} alt="img" width='40px' height='40px' style={{ borderRadius: '50px', objectFit: 'cover' }} loading='lazy' />
                            ) :
                              (<img src={driver} alt='img' width='40px' height='40px' style={{ borderRadius: '50px', objectFit: 'cover' }} loading='lazy' />)
                            }
                          </Box>
                          {order && !_.isEmpty(order?.driverDetails) && !_.isEmpty(order?.driverDetails?.driverId) ? 
                          <>
                          <Box px={2}>
                          <Typography className='customer-address'>
                            {order && order?.driverDetails && order?.driverDetails?.driverId ? order?.driverDetails?.driverId : null}
                            </Typography>
                            <Typography className='customer-address'>
                            {`${order && order?.driverDetails && order?.driverDetails?.driverName ? order?.driverDetails?.driverName : ''} ${' '}
                            ${order && order?.driverDetails && order?.driverDetails?.phoneNumber ? `${order?.driverDetails?.phoneNumber}` : ''}`}
                            </Typography>
                            <Typography className='customer-profile'>{order && order?.driverDetails && order?.driverDetails?.emailId ? order?.driverDetails?.emailId : null}</Typography>
                          </Box>
                          </> : <span className='driver-hangon'>Waiting for driver to pick up the order.</span>}
                          
                        </Box>
                    </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid container columns={12} spacing={2} height={"auto"} px={2}>
                    <Grid item sm={12} md={5.55}>
                      <Typography className='bill-details-header' py={1.5}>Order Menu</Typography>
                      <Box p={3} height={'50vh'} overflow={'scroll'}>
                        {order && order?.items.map((item: any, index: any) =>
                          <Grid container justifyContent={'space-between'} columns={12} alignItems={'center'} mb={1.5} key={item.id}>
                            <Grid item xs={1}>
                              <Typography textAlign={'center'}>{index + 1}.</Typography>
                            </Grid>
                            <Grid item xs={2.70}>
                              <Box p={0.85}>
                                {item.product.images && item.product.images?.length > 0 ? (
                                  <img src={`${process.env.REACT_APP_API_BASE_URL}${item.product.images[0].filePath}`} alt={'img'} width='80px' height='65px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                                ) : (
                                  <img src={orderDummy} alt={'img'} width='80px' height='65px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={4.80}>
                              <Typography className='product-list-name'>{item && item?.product && item?.product?.productName && item?.prdQty ? `${item?.product?.productName} (X ${item?.prdQty})` : '--'}</Typography>
                              <Typography className='product-list-name'>{item && item?.variant?.variantName && item?.prdPrice ? `${item?.variant?.variantName} ${'OMR'} ${item?.prdPrice}` : '--'}</Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                              <Typography className='bill-price-details' textAlign={'end'}>{item && item?.totPrice ? `${'OMR'} ${item?.totPrice}` : '--'}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    </Grid>
                    <Grid item display={{sm: 'none', md:'flex'}} height={'50vh'} xs={0.15} lg={0.50} my={2}>
                      <Divider orientation='vertical' />
                    </Grid>
                    <Grid item sm={12} md={5.55}>
                      <Typography className='bill-details-header' py={1.5} pl={2}>Bill Details({order && order?.totItems ? order?.totItems : '0'} items)
                      </Typography>
                      <TableContainer sx={{ maxWidth: "auto" }}>
                        <Table sx={{ borderStyle: 'hidden', maxWidth: "100%" }} aria-label="simple table">
                          <TableBody>
                            {rightTable.map((row: any) => (
                              <TableRow
                                key={row.name}
                                sx={{ border: 0, borderStyle: 'hidden' }}
                              >
                                <TableCell className='bill-product-details' style={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                                <TableCell className='bill-price-details' sx={{ color: "#888787", textAlign:'end' }}>{row.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button className='styledButtonCancel' style={{ margin: '16px 0' }} variant="outlined" color="secondary" onClick={handleCloseMerchantView}>Cancel</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </>)
            }
          </>
        }
      </Box>
    </React.Fragment >
  )
}

export default OrderView;