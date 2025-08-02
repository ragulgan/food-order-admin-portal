import React, { Fragment, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import {
  Grid, TableContainer, Table, Chip, TableBody, TableHead, TableRow,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import noOrder from '../../assets/images/no_order.webp'
import { dateStringToObjectByMonthNumber } from '../utils/dateformat';
import { fetchOrders } from '../../reduxState/orderSlice/orderListSlice';
import Loading from '../commonToast/loader';
import _ from 'lodash'

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

const MyOrder: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<any>("4");
  const dispatch = useDispatch<AppDispatch>();
  const orderDataState = useSelector((state: RootState) => state.orders);

  /* this will load merchant intially as page value initated
  and also load the merchant for page changes */
  useEffect(() => {
    dispatch(fetchOrders({ pageNo: page, size: limit }));
  }, [])

  return (
    <Fragment>
      {orderDataState && orderDataState?.loading ? (<Loading />) :
        <>
          <TableContainer sx={{ borderRadius: "3px", maxWidth: "auto" }}>
            <Table
              sx={{ maxWidth: "auto" }}
              aria-labelledby="tableTitle"
            >
              <TableHead>
                <TableRow sx={{ background: "#F9F9F9", border: "1px solid #FFFFFF", borderRadius: "20px" }}>
                  <TableCell className='list-header' align='center' padding='normal'>#</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Booking ID</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Customer Name</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>No of Items</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Final Amount</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Order Date</TableCell>
                  <TableCell className='list-header' align='center' padding='normal'>Order Status</TableCell>
                  <TableCell className='list-header' align='left' padding='normal'>Picked by</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!orderDataState?.loading && orderDataState?.data.map((order: any, index: any) => {
                  return (
                    <StyledTableRow
                      key={order.id}
                    >
                      <TableCell className='list-data' align="center">{page === 1 ? (index + 1) : (index + 1 + page * limit - limit)}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{order && order?.orderId ? order?.orderId : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">
                        {order && order?.customerDetails && order?.customerDetails?.customerName ? order?.customerDetails?.customerName : '--'}
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="center">{order && order?.totItems ? order?.totItems: '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="center">{order && order?.totAmt ? `${'OMR'} ${order?.totAmt}` : '--'}</TableCell>
                      <TableCell className='list-data list-table-cell' align="left">{order && order?.createdDate ? dateStringToObjectByMonthNumber(order?.createdDate) : '--'}</TableCell>
                      <TableCell className='list-data' align="center">
                        {order && order?.orderSts && order?.orderSts !== null ?
                          <>
                            {order?.orderSts === 'OrderDelivered' && (
                              <Chip size='small' label={'DELIVERED'} className='od-color' />
                            )}
                            {order?.orderSts === 'OrderCancelled' && (
                              <Chip size='small' label={'CANCELLED'} className='oc-color' />
                            )}
                            {order?.orderSts === 'OrderPlaced' && (
                              <Chip size='small' label={'PLACED'} className='op-color' />
                            )}
                            {order?.orderSts === 'OrderPicked' && (
                              <Chip size='small' label={'PICKED'} className='opickup-color' />
                            )}
                            {order?.orderSts === 'OrderConfirmed' && (
                              <Chip size='small' label={'CONFIRMED'} className='ocd-color' />
                            )}
                            {order?.orderSts === 'OrderIsPreparing' && (
                              <Chip size='small' label={'PREPARING'} className='oprep-color' />
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
                      </TableCell>
                      <TableCell className='list-data list-table-cell' align="left">
                        {order && order?.driverDetails && order?.driverDetails?.driverName ? order?.driverDetails?.driverName : '--'}
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>}
          {!orderDataState?.loading && orderDataState?.data?.length === 0 && <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ height: '100%', bgcolor: 'background.paper', ml: 2, mt: 1.75}}>
              <div style={{ marginTop: '10px' }} className='error-text'>
                <img style={{ width: '15%', height: '15%' }} src={noOrder} alt="delivery" />
              </div>
            </Grid>
          </Grid>}
    </Fragment>
  );
}

export default MyOrder;