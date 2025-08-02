import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Typography, Table, TableBody, TableRow, TableContainer, Chip, Rating,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranchById, clearViewState } from '../../reduxState/branchSlice/branchViewSlice';
import { RootState, AppDispatch } from '../../reduxState/store';
import branchDummy from '../../assets/images/Branch.svg'
import veg from '../../assets/images/veg.png'
import nonveg from '../../assets/images/non-veg.png'
import both from '../../assets/images/bothfoodType.png'
import errorImage from '../../assets/images/Error.png'
import BasicTabs from './tabs';
import DescriptionTabs from './descriptionTab';
import { dateStringToObjectDayfirst } from '../utils/dateformat'
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../commonToast/loader';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import _ from 'lodash'

const BranchView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [rows, setRows] = React.useState<any>([])
  const [leftrows, setLeftRows] = React.useState<any>([])
  const branch = useSelector((state: RootState) => state.branchView.data);
  const error = useSelector((state: RootState) => state.branchView.error);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      dispatch(fetchBranchById(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (branch && branch?.id) {
      const temRow = [
        createData('Merchant Name', branch && branch?.merchantDetails?.merchantName ? branch?.merchantDetails?.merchantName : '--'),
        createData('Branch Manager', branch && branch?.branchManager ? branch?.branchManager : '--'),
        // createData('Contact Name', branch && branch?.contactName ? branch?.contactName : '--'),
        createData('Email', branch && branch?.contactEmail ? branch?.contactEmail : '--'),
        createData('Branch Address', branch && branch?.branchAddress ? branch?.branchAddress : '--'),
      ]
      setRows(temRow)
    }

  }, [branch]);

  useEffect(() => {
    if (branch && branch?.id) {
      const temRow = [
        createData('GST', branch && branch?.gst ? `${branch?.gst} ${String.fromCharCode(0x0025)}` : '--'),
        createData('Telephone Number', branch && branch?.branchTelephoneNumber ? branch?.branchTelephoneNumber : '--'),
        createData('Mobile Number', branch && branch?.contactNo ? branch?.contactNo : '--'),
        createData('Registration Date', branch && branch?.createdDate ? dateStringToObjectDayfirst(branch?.createdDate) : '--'),
        createData('Status', branch && branch?.status ? (branch?.status === "ACTIVE" ? (<Chip size='small' label={branch?.status} className='status-active-chip' variant="outlined" />) :
          branch?.status === "INACTIVE" ? (<Chip size='small' label={branch?.status} className='status-inactive-chip' variant="outlined" />) :
            (<Chip size='small' label={branch?.status} className='status-deleted-chip' variant="outlined" />)) : '--'),
      ]
      setLeftRows(temRow)
    }

  }, [branch]);

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const editPageOpen = (branch: any) => {
    dispatch(clearViewState())
    navigate("/branch/edit", { state: branch.id })
  }

  const closeDriverView = () => {
    dispatch(clearViewState())
    navigate("/branch/list")
  }

  React.useEffect(() => {
    return () => {
    dispatch(clearViewState());
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
            {location.state !== branch?.id ? (<Loading />) :
              (<Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box style={{ backgroundColor: '#FFFAF8', borderRadius: '20px' }}>
                    <Grid container spacing={2} p={2}>
                      <Grid item sm={12} md={5} lg={3}>
                        <Box px={2} py={{md: 0, lg: 3}} textAlign={{sm:'center', md:'start'}}>
                          {branch && branch?.image?.length > 0 ? (
                            <img src={`${process.env.REACT_APP_API_BASE_URL}${branch?.image[0]?.filePath}`} alt={`Branch Img`}  style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy'/>
                          ) : (
                            <img src={branchDummy} alt="Branch Img" style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />
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
                            }}>{`${branch && branch?.branchName ? branch?.branchName : '--'}`}</h3>
                            <Box pl={1.5}>
                              {branch?.isVeg === "Veg" ? (
                                <img
                                  src={veg}
                                  alt="veglogo"
                                  style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', width: '25px', height: '25px' }}
                                />
                              ) : branch?.isVeg === "NonVeg" ? (
                                <img
                                  src={nonveg}
                                  alt="non-veglogo"
                                  style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', width: '25px', height: '25px' }}
                                />
                              ) : branch?.isVeg === "Both" ? (
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
                          <Grid item lg={4.75}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                              <h2 className='merchant-rate-star' style={{ paddingRight: '16px' }}>{branch && branch?.rating ? branch.rating : 0}/5</h2>
                              <Rating
                                name="text-feedback"
                                value={branch && branch.rating ? branch.rating : 0}
                                precision={0.5}
                                readOnly
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                              />
                              <Typography className='review-count'>
                                {branch && branch?.review >= 500 ?
                                  ((branch && branch?.review / 1000).toFixed(1) + 'K') :
                                  (branch && branch?.review.toString())} (Reviews)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item lg={2.75} display='flex' justifyContent='flex-end' px={{md:0, lg:2}}>
                            <Button className='styledButtonSave' onClick={() => editPageOpen(branch)}>Edit</Button>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent={'space-between'} spacing={2} columns={14}>
                          <Grid item sm={12} md={12} lg={8}>
                            <TableContainer sx={{ maxWidth: "auto" }}>
                              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
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
                          </Grid>
                          <Grid item sm={12} md={12} lg={6}>
                            <TableContainer sx={{ maxWidth: "auto" }}>
                              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                                <TableBody>
                                  {leftrows?.map((row: any) => (
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
                    <BasicTabs id={location.state} />
                  </Box>
                </Grid>
                {branch && branch?.image?.length > 1 ? (
                <Grid item xs={12}>
                  <Box px={4}>
                    <h3 className='branch-banner-text'>Banner Images</h3>
                    <div className="banner-slider-wrapper">
                      <Slider {...settings}>
                        {branch?.image.map((imageUrl: any, index: any) => (
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
                </Grid>
                 ) : null }
                <Grid item xs={12}>
                  <DescriptionTabs id={branch?.id} />
                </Grid>
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

export default BranchView;
