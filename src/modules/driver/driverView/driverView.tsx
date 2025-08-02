import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Typography, Table, TableBody, TableRow, TableContainer, Divider,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverById, clearViewState } from '../../../reduxState/driverSlice/driverViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import avatorEmpty from '../../../assets/images/avatorEmpty.png'
import errorImage from '../../../assets/images/Error.png'
import BasicTabs from './tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../commonToast/loader';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import _ from 'lodash'
import { dateStringToObjectByMonthNumber } from '../../utils/dateformat'

const DriverView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [rows, setRows] = React.useState<any>([])
  const driver = useSelector((state: RootState) => state.driverView.data);
  const error = useSelector((state: RootState) => state.driverView.error);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      dispatch(fetchDriverById(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (driver && driver?.id) {
      const temRow = [
        createData('Name', driver && driver?.firstName ? `${driver?.firstName} ${driver?.lastName}` : '--'),
        createData('Phone Number', driver && driver?.phoneNumber ? driver?.phoneNumber : '--'),
        createData('Email Id', driver && driver?.emailId ? driver?.emailId : '--'),
        createData('Date Of Birth', driver && driver?.dob ? dateStringToObjectByMonthNumber(driver?.dob) : '--'),
      ]
      setRows(temRow)
    }

  }, [driver]);

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const editPageOpen = (driver: any) => {
    dispatch(clearViewState())
    navigate("/drivers/edit", { state: driver.id })
  }

  const closeDriverView = () => {
    dispatch(clearViewState())
    navigate("/drivers/list")
  }

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
  }
  },[])

  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    adaptiveHeight: true,
    arrow: true,
    rtl: false,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      }
    ]
  };

  const driverImg = driver && driver?.profile?.id
  const isDriverImgNotNull = !_.isNull(driverImg);

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
            {location.state !== driver?.id ? (<Loading />) :
              (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box style={{ backgroundColor: '#FFFAF8', borderRadius: '20px' }}>
                      <Grid container spacing={2} p={2}>
                        <Grid item sm={12} md={5} lg={3}>
                          <Box px={2} py={{md:0, lg:3}} textAlign={{sm:'center', md:'start'}}>
                            {isDriverImgNotNull && driver?.profile ? (
                              <img src={`${process.env.REACT_APP_API_BASE_URL}${driver?.profile?.filePath}`} alt={`Profile Img`} style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />
                            ) : (
                              <img src={avatorEmpty} alt="Profile picture" style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />
                            )}
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={7} lg={9}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3 className='merchant-name'
                                style={{
                                  paddingLeft: '10px',
                                  maxWidth: "auto",
                                  whiteSpace: "normal",
                                }}>{`${driver?.firstName} ${driver?.lastName}`}</h3>
                              {driver.status !== 'NOT_VERIFIED' && driver.status !== 'PENDING' ?
                                <>
                                  <Button className='styledButtonSave' onClick={() => editPageOpen(driver)}>Edit</Button>
                                </> : null}
                            </Box>
                            <TableContainer sx={{ maxWidth: "auto" }}>
                              <Table sx={{ borderStyle: 'hidden', maxWidth: "40%" }} aria-label="simple table">
                                <TableBody>
                                  {rows?.map((row: any) => (
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
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item sm={12}>
                    <Box px={4}>
                      <BasicTabs id={location.state} />
                    </Box>
                  </Grid>
                  {driver && driver?.documents?.length > 0 ? (
                  <Grid item sm={12}>
                    <Box px={4}>
                      <h3 className='driver-view-attachment-header'>Attachments</h3>
                      <div className="banner-slider-wrapper">
                        <Slider {...settings}>
                          {driver?.documents.map((imageUrl: any, index: any) => (
                            <div key={index} className="banner-image">
                              <img
                                src={`${process.env.REACT_APP_API_BASE_URL}${imageUrl.filePath}`}
                                alt={`Banner Image ${index}`}
                                className="banner-image-img"
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </Box>
                  </Grid>) : null}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Button className='styledButtonCancel' style={{ marginBottom: '24px' }} variant="outlined" color="secondary" onClick={closeDriverView}>Cancel</Button>
                    </Box>
                  </Grid>
                </Grid>)
            }
          </>
        }
      </Box>
    </Fragment>
  )
}

export default DriverView;
