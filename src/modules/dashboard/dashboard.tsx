import React from 'react'
import { Grid, Paper, Typography, Box, Button, Divider } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import merchant from '../../assets/images/dashMerchant.png'
import customer from '../../assets/images/dashCustomer.png'
import driver from '../../assets/images/dashDriver.png'
import login from '../../assets/images/dashLogin.png'
import register from '../../assets/images/dashRegister.png'
import coupons from '../../assets/images/coupons.png'
import offers from '../../assets/images/offers.png'
import { fetchDashboardCard } from '../../reduxState/dashboardSlice/dashboardCardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxState/store';
import Register from "./adminDashboard/registerCharts";
import Sales from "./adminDashboard/saleCharts";
import Orders from "./adminDashboard/drivers";
import Cuisines from "./adminDashboard/cuisineCharts"
import Order from './merchantDashboard/orderCharts';
import PopularCuisines from './merchantDashboard/popularCuisineOrders';
import Revenue from './merchantDashboard/revenueCategory';
import OrderStatus from './merchantDashboard/orderStatusChart';
import { Role_Types } from '../utils/constant';
import BranchMyOrder from './branchMyorder';
import _ from 'lodash'
import { formattedYesterday } from '../utils/dateformat'

const DashboardContent: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardCardData = useSelector((state: RootState) => state.dashboardCard);
  const [selectedRange, setSelectedRange] = React.useState<string>('MONTHLY');
  const [selectedSaleType, setSelectedSaleType] = React.useState<string>('MONTHLY');
  const [selectedSalePer, setSelectedSalePer] = React.useState<string>('TOP');
  //merchant chart filter
  const [selectedOrder, setSelectedOrder] = React.useState<string>('MONTHLY');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('MONTHLY');
  const [selectedCuisine, setSelectedCuisine] = React.useState<string>('MONTHLY');
  // roles
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

  const chooseRegister = (selectedRange: any) => {
    setSelectedRange(selectedRange);
  };

  const chooseSales = (selectedSaleType: any) => {
    setSelectedSaleType(selectedSaleType)
  };

  const chooseSalesPercent = (selectedSalePer: any) => {
    setSelectedSalePer(selectedSalePer)
  };

  const chooseOrder = (selectedOrder: any) => {
    setSelectedOrder(selectedOrder);
  };

  const chooseSalesCategory = (selectedCategory: any) => {
    setSelectedCategory(selectedCategory);
  }

  const chooseCuisine = (selectedCuisine: any) => {
    setSelectedCuisine(selectedCuisine);
  };

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Admin) {
      dispatch(fetchDashboardCard({ range: selectedRange, saleType: selectedSaleType, salePercent: selectedSalePer }));
    }
  }, [selectedRange, selectedSaleType, selectedSalePer]);

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Merchant) {
      dispatch(fetchDashboardCard({ range: selectedOrder, revenueType:selectedCategory, cuisineRange: selectedCuisine }));
    }
  }, [selectedOrder, selectedCategory, selectedCuisine]);

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Branch) {
      dispatch(fetchDashboardCard(''));
    }
  }, []);

  return (
    <>
      {roles_data?.role === Role_Types.Admin ?
        <Grid container justifyContent={'space-between'}>
          <Grid item xs={2.25}>
            <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
              <Box className='img-box'>
                <img src={merchant} alt='Img' width={'35px'} height={'35px'} />
              </Box>
              <Box px={2} className='content-box'>
                <Typography className='card-header'>Merchants</Typography>
                <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.merchants ? dashboardCardData?.data?.merchants : '0'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2.25}>
            <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
              <Box className='img-box'>
                <img src={customer} alt='Img' width={'35px'} height={'35px'} />
              </Box>
              <Box px={2} className='content-box'>
                <Typography className='card-header'>Customers</Typography>
                <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.customers ? dashboardCardData?.data?.customers : '0'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2.25}>
            <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
              <Box className='img-box'>
                <img src={driver} alt='Img' width={'35px'} height={'35px'} />
              </Box>
              <Box px={2} className='content-box'>
                <Typography className='card-header'>Drivers</Typography>
                <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.drivers ? dashboardCardData?.data?.drivers : '0'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2.25}>
            <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
              <Box className='img-box'>
                <img src={login} alt='Img' width={'35px'} height={'35px'} />
              </Box>
              <Box px={2} className='content-box'>
                <Typography className='card-header'>Logins</Typography>
                <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.registerLogin ? dashboardCardData?.data?.registerLogin : '0'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2.25}>
            <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
              <Box className='img-box'>
                <img src={register} alt='Img' width={'35px'} height={'35px'} />
              </Box>
              <Box px={2} className='content-box'>
                <Typography className='card-header'>Register</Typography>
                <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.Register ? dashboardCardData?.data?.Register : '0'}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '15px',
              }}
            >
              <Register chooseRegister={chooseRegister} />
            </Paper>
          </Grid>
          <Grid className='spacing-table' item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '15px',
              }}
            >
              <Sales chooseSales={chooseSales} chooseSalesPercent={chooseSalesPercent} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '15px',
              }}
            >
              <Orders />
            </Paper>
          </Grid>
          <Grid className='spacing-table' item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '15px',
              }}
            >
              <Cuisines />
            </Paper>
          </Grid>
        </Grid> :
        roles_data?.role === Role_Types.Merchant && roleData?.dashboard?.visible ?
          <Grid container justifyContent={'space-between'}>
            <Grid item xs={2.25}>
              <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
                <Box className='img-box'>
                  <img src={merchant} alt='Img' width={'35px'} height={'35px'} />
                </Box>
                <Box px={2} className='content-box'>
                  <Typography className='card-header'>Branch</Typography>
                  <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.branch ? dashboardCardData?.data?.branch : '0'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2.25}>
              <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
                <Box className='img-box'>
                  <img src={driver} alt='Img' width={'35px'} height={'35px'} />
                </Box>
                <Box px={2} className='content-box'>
                  <Typography className='card-header'>Orders</Typography>
                  <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.orders ? dashboardCardData?.data?.orders : '0'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2.25}>
              <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
                <Box className='img-box'>
                  <img src={customer} alt='Img' width={'35px'} height={'35px'} />
                </Box>
                <Box px={2} className='content-box'>
                  <Typography className='card-header'>Customers</Typography>
                  <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.customers ? dashboardCardData?.data?.customers : '0'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2.25}>
              <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
                <Box className='img-box'>
                  <img src={offers} alt='Img' width={'35px'} height={'35px'} />
                </Box>
                <Box px={2} className='content-box'>
                  <Typography className='card-header'>Offers</Typography>
                  <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.offers ? dashboardCardData?.data?.offers : '0'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={2.25}>
              <Box className='dash-card' display={'flex'} alignItems={'center'} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: '15px' }}>
                <Box className='img-box'>
                  <img src={coupons} alt='Img' width={'35px'} height={'35px'} />
                </Box>
                <Box px={2} className='content-box'>
                  <Typography className='card-header'>Coupons</Typography>
                  <Typography className='card-count'>{dashboardCardData && dashboardCardData?.data && dashboardCardData?.data?.coupens ? dashboardCardData?.data?.coupens : '0'}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '15px',
                }}
              >
                <Order chooseOrder={chooseOrder} />
              </Paper>
            </Grid>
            <Grid className='spacing-table' item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '15px',
                }}
              >
                <OrderStatus />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '15px',
                }}
              >
                <Revenue chooseSalesCategory = {chooseSalesCategory} />
              </Paper>
            </Grid>
            <Grid className='spacing-table' item xs={12} md={6} lg={5.75} style={{ marginTop: "24px", padding: '0' }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '15px',
                }}
              >
                <PopularCuisines chooseCuisine={chooseCuisine} />
              </Paper>
            </Grid>
          </Grid> : roles_data?.role === Role_Types.Branch && roleData?.dashboard?.visible ? 
          <>
          <Typography className='branch-dashboard-title' py={4}>
            Dashboard
          </Typography>
              <Grid spacing={2} container justifyContent={'space-between'} columns={13} alignItems={'center'} px={2}>
                <Grid item xs={13}>
                  <Grid container spacing={2} justifyContent={'space-between'} columns={13} alignItems={'center'} width={{ lg: '100%', xl: '80%' }}>
                    <Grid item xs={12} sm={12} md={6} lg={3} className='branch-dashboard-card' px={2}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ p: 2 }}>
                        <Typography>Today Order</Typography>
                        {dashboardCardData && dashboardCardData?.data && dashboardCardData.data.dailyCount >= dashboardCardData.data.previousCount ?
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-uparrow' variant="outlined" size="small" startIcon={<ArrowUpwardIcon />} />
                          </> :
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-downarrow' variant="outlined" size="small" startIcon={<ArrowDownwardIcon />} />
                          </>}
                      </Box>
                      <Divider />
                      <Typography className='branch-card-count' sx={{ px: 2, pt: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.dailyCount) ||
                        _.isString(dashboardCardData.data.dailyCount)) ? dashboardCardData?.data?.dailyCount : '--'}</Typography>
                      <Typography className='branch-card-count-text' sx={{ px: 2, py: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) &&
                        (_.isNumber(dashboardCardData?.data?.previousCount) || _.isString(dashboardCardData.data.previousCount)) ? dashboardCardData?.data?.previousCount : '--'} Orders {formattedYesterday}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} className='branch-dashboard-card' px={2}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ p: 2 }}>
                        <Typography>Delivered</Typography>
                        {dashboardCardData && dashboardCardData?.data && dashboardCardData.data.todayDeliveredCount >= dashboardCardData.data.previousDeliveredCount ?
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-uparrow' variant="outlined" size="small" startIcon={<ArrowUpwardIcon />} />
                          </> :
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-downarrow' variant="outlined" size="small" startIcon={<ArrowDownwardIcon />} />
                          </>}
                      </Box>
                      <Divider />
                      <Typography className='branch-card-count' sx={{ px: 2, pt: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.todayDeliveredCount) ||
                        _.isString(dashboardCardData.data.todayDeliveredCount)) ? dashboardCardData?.data?.todayDeliveredCount : '--'}</Typography>
                      <Typography className='branch-card-count-text' sx={{ px: 2, py: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) &&
                        (_.isNumber(dashboardCardData?.data?.previousDeliveredCount) || _.isString(dashboardCardData.data.previousDeliveredCount)) ? dashboardCardData?.data?.previousDeliveredCount : '--'} Orders {formattedYesterday}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} className='branch-dashboard-card' px={2}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ p: 2 }}>
                        <Typography>Cancelled</Typography>
                        {dashboardCardData && dashboardCardData?.data && dashboardCardData.data.todayCancelledCount >= dashboardCardData.data.previousCancelledCount ?
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-uparrow' variant="outlined" size="small" startIcon={<ArrowUpwardIcon />} />
                          </> :
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-downarrow' variant="outlined" size="small" startIcon={<ArrowDownwardIcon />} />
                          </>}
                      </Box>
                      <Divider />
                      <Typography className='branch-card-count' sx={{ px: 2, pt: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.todayCancelledCount) ||
                        _.isString(dashboardCardData.data.todayCancelledCount)) ? dashboardCardData?.data?.todayCancelledCount : '--'}</Typography>
                      <Typography className='branch-card-count-text' sx={{ px: 2, py: 2 }}>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.previousCancelledCount) ||
                        _.isString(dashboardCardData.data.previousCancelledCount)) ? dashboardCardData?.data?.previousCancelledCount : '--'} Orders {formattedYesterday}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} className='branch-dashboard-card' px={2}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ p: 2 }}>
                        <Typography>Sales</Typography>
                        {dashboardCardData && dashboardCardData?.data && Number(dashboardCardData.data.todaySale) >= Number(dashboardCardData.data.previousSale) ?
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-uparrow' variant="outlined" size="small" startIcon={<ArrowUpwardIcon />} />
                          </> :
                          <>
                            <Button sx={{ pl: 2 }} className='branch-dash-downarrow' variant="outlined" size="small" startIcon={<ArrowDownwardIcon />} />
                          </>}
                      </Box>
                      <Divider />
                      <Typography className='branch-card-count card-sale-count' display={'flex'} alignItems={'center'} sx={{ px: 2, pt: 2 }}><span className='OMR-sign'>OMR</span>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.todaySale) ||
                        _.isString(dashboardCardData.data.todaySale)) ? dashboardCardData?.data?.todaySale : '--'}</Typography>
                      <Typography className='branch-card-count-sale' display={'flex'} alignItems={'center'} sx={{ px: 2, py: 2 }}><span className='OMR-sign-second'>OMR</span>{dashboardCardData && !_.isEmpty(dashboardCardData?.data) && (_.isNumber(dashboardCardData.data.previousSale) ||
                        _.isString(dashboardCardData.data.previousSale)) ? dashboardCardData?.data?.previousSale : '--'} Orders {formattedYesterday}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
          <Typography className='branch-dashboard-title' py={4}>
            My Orders
          </Typography>
          <BranchMyOrder />
          </> :
          <Typography textAlign={'center'}>Something went wrong</Typography>
      }
    </>
  )
}

export default DashboardContent;