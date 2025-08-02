import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Modal, Typography, Table, TableBody, TableRow,
  TableContainer, Chip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import subCategoryDummy from '../../../../assets/images/Category.svg'
import errorImage from '../../../../assets/images/Error.png'
import { fetchSubCategoryById, clearViewState } from '../../../../reduxState/merchantItemSlice/subCategory/subCategoryViewSlice';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { dateStringToObjectDayfirst } from '../../../utils/dateformat'
import Loading from '../../../commonToast/loader';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface ConfirmationModalProps {
  subcategoryId: string;
  isOpen: boolean;
  onClose: any;
}

const SubCategoryView: React.FC<ConfirmationModalProps> = ({ subcategoryId, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [leftTable, setLeftTable] = React.useState<any>([])
  const [rightTable, setRightTable] = React.useState<any>([])
  const subCategory = useSelector((state: RootState) => state?.subcategoryView?.data);
  const error = useSelector((state: RootState) => state?.subcategoryView?.error);

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    adaptiveHeight: true,
    arrow: true,
  };

  useEffect(() => {
    if (subcategoryId) {
      setTimeout(() => {
        dispatch(fetchSubCategoryById(subcategoryId));
      }, 2000);
    }
  }, [subcategoryId, isOpen]);

  useEffect(() => {
    if (subCategory?.id) {
      const temRow = [
        createData('Merchant Name', subCategory && subCategory?.merchantDetails && subCategory?.merchantDetails?.merchantName ? subCategory?.merchantDetails?.merchantName: '--'),
        createData('Branch Name', subCategory && subCategory?.branchDetails && subCategory?.branchDetails?.branchName ? subCategory?.branchDetails?.branchName: '--'),
        createData('Category Name',subCategory && subCategory?.categoryDetails && subCategory?.categoryDetails?.categoryName ?  subCategory?.categoryDetails?.categoryName: '--'),
        createData('Description', subCategory && subCategory?.description ? subCategory?.description: '--'),
      ]
      setLeftTable(temRow)
    }
  }, [subCategory]);

  useEffect(() => {
    if (subCategory?.id) {
      const temRow = [
        createData('Status', subCategory && subCategory?.status ? (subCategory?.status === "ACTIVE" ? (<Chip size='small' label={subCategory?.status} className='status-active-chip' variant="outlined" />) :
          subCategory?.status === "INACTIVE" ? (<Chip size='small' label={subCategory?.status} className='status-inactive-chip' variant="outlined" />) :
            (<Chip size='small' label={subCategory?.status} className='status-deleted-chip' variant="outlined" />)):'--'),
        createData('Created Date', subCategory && subCategory?.createdDate ? dateStringToObjectDayfirst(subCategory?.createdDate): '--'),
      ]
      setRightTable(temRow)
    }
  }, [subCategory]);

  if (!isOpen) {
    return null;
  }

  function createData(name: string, value: any) {
    return { name, value };
  }


  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'scroll', width: '70%', height: 'auto', backgroundColor: '#FFFAF8', boxShadow: 24, borderRadius: '20px' }}>
          {error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }} p={3}>
            <Box textAlign={'center'}>
            <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
            <Typography my={3} color="error">{error}</Typography>
            </Box>
          </Box>
        ) :
        <>
        {subcategoryId !== subCategory?.id ? (<Loading />):
        (
          <Grid container spacing={2}>
            <Grid item xs={12} position={'sticky'} top={0}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>View Sub Category Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2} p={2}>
                  <Grid item xs={12} sm={6} md={5} lg={3}>
                    {subCategory && subCategory?.images?.length > 0 ? (
                      <Box px={2}>
                        <div className="banner-slider-wrapper">
                          <Slider {...settings}>
                            {subCategory?.images.map((imageUrl: any, index: any) => (
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
                    ) :
                      (
                        <img src={subCategoryDummy} style={{ width: '220px', height: '220px' }} alt="Profile picture" />
                      )
                    }
                  </Grid>
                  <Grid item xs={12} sm={6} md={7} lg={9}>
                    <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Grid item lg={6} className='view-details-header'><span style={{ paddingLeft: '10px' }}>{subCategory?.subCategoryName}</span></Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6}>
                        <TableContainer sx={{ maxWidth: "auto" }}>
                          <Table sx={{ borderStyle: 'hidden', maxWidth: "100%" }} aria-label="simple table">
                            <TableBody>
                              {leftTable.map((row: any) => (
                                <TableRow
                                  key={row.name}
                                  sx={{ border: 0, borderStyle: 'hidden' }}
                                >
                                  <TableCell className='merhchat-view-table' style={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                                  <TableCell>
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
                      <Grid item xs={6}>
                        <TableContainer sx={{ maxWidth: "auto" }}>
                          <Table sx={{ borderStyle: 'hidden', maxWidth: "100%" }} aria-label="simple table">
                            <TableBody>
                              {rightTable.map((row: any) => (
                                <TableRow
                                  key={row.name}
                                  sx={{ border: 0, borderStyle: 'hidden' }}
                                >
                                  <TableCell className='merhchat-view-table' style={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                                  <TableCell>
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
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} position={'sticky'} bottom={0}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button className='styledButtonCancel' style={{ marginBottom: '16px' }} variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
              </Box>
            </Grid>
          </Grid>)
        }
        </>
        }
        </Box>
      </Modal>
    </Fragment>
  )
}

export default SubCategoryView;