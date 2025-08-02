import * as React from 'react';
import {
  Box, Button, Grid, Typography, TableContainer, Table,
  TableBody, TableRow, Chip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchantById, clearViewState } from '../../../reduxState/merchantSlice/merchantsViewSlice';
import { RootState, AppDispatch } from '../../../reduxState/store';
import { dateStringToObjectDayfirst } from '../../utils/dateformat'
import Loading from '../../commonToast/loader';
import merchantImg from '../../../assets/images/merchantEmpImage.svg'
import { useLocation, useNavigate } from 'react-router-dom';
import DescriptionTabs from './descriptionTab';
import errorImage from '../../../assets/images/Error.png'
import './merchantView.scss';

const MerchantView: React.FC<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [rows, setRows] = React.useState<any>([])
  const [newrows, setNewRows] = React.useState<any>([])
  const merchant = useSelector((state: RootState) => state.merchantView.data);
  const error = useSelector((state: RootState) => state.merchantView.error);

  React.useEffect(() => {
    if (location.state) {
      setTimeout(() => {
        dispatch(fetchMerchantById(location.state));
      }, 2000);
    }
  }, [location.state]);

  React.useEffect(() => {
    if (merchant && merchant?.id) {
      const temRow = [
        createData('Contact Name', merchant && merchant?.contactName ? merchant?.contactName : '--'),
        createData('Phone Number', merchant && merchant?.contactNo ? merchant?.contactNo : '--'),
        createData('Email Id', merchant && merchant?.contactEmail ? merchant?.contactEmail : '--'),
        createData('Website', merchant && merchant?.website ? merchant?.website : '--'),
        createData('Contact Address', merchant && merchant?.contactAddress && merchant?.city?.cityName && merchant?.state?.stateName && merchant?.country?.countryName ? `${merchant?.contactAddress}, ${merchant?.city?.cityName}, ${merchant?.state?.stateName}, ${merchant?.country?.countryName}` : '--'),
      ]
      setRows(temRow)
    }
  }, [merchant]);

  React.useEffect(() => {
    if (merchant && merchant?.id) {
      const temRow = [
        createData('Merchant Id', merchant && merchant?.merchantId ? merchant?.merchantId : '--'),
        createData('Registration Date', merchant && merchant?.createdDate ? dateStringToObjectDayfirst(merchant?.createdDate) : '--'),
        createData('Status', merchant && merchant?.status ? (merchant?.status === "ACTIVE" ? (<Chip size='small' label={merchant?.status} className='status-active-chip' variant="outlined" />) :
          merchant?.status === "INACTIVE" ? (<Chip size='small' label={merchant?.status} className='status-inactive-chip' variant="outlined" />) :
            (<Chip size='small' label={merchant?.status} className='status-deleted-chip' variant="outlined" />)) : '--'),
      ]
      setNewRows(temRow)
    }
  }, [merchant]);

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const handleEditClick = (merchant: any) => {
    navigate("/merchants/edit", { state: merchant.id })
  }

  const handleCloseMerchantView = () => {
    navigate('/merchants/list');
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
            {location.state !== merchant?.id ? (<Loading />) :
              (<Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ backgroundColor: '#FFFAF8', borderRadius: '20px' }}>
                    <Grid container spacing={2} p={2}>
                      <Grid item xs={12} sm={12} md={5} lg={3}>
                        <Box p={2} py={{md: 0, lg: 1.5}} textAlign={{ sm: 'center', md: 'start' }}>
                          {merchant && merchant.image && merchant.image.id !== null ? (<img src={`${process.env.REACT_APP_API_BASE_URL}${merchant?.image?.filePath}`} alt={`Logo`} style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', background: '#FFFFFF', overflow: 'hidden' }} loading="lazy" />) :
                            (<img src={merchantImg} alt={`Logo`} style={{ width: '184px', height: '180px', borderRadius: '16px', objectFit: 'cover', overflow: 'hidden', background: '#FFFFFF' }} loading='lazy' />)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={7} lg={9}>
                        <Box>
                        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Grid item lg={3}><h3 className='merchant-name' style={{
                            paddingLeft: '10px',
                            maxWidth: "auto",
                            whiteSpace: "normal",
                          }}>{`${merchant && merchant?.restaurantName ? merchant?.restaurantName : '--'}`}</h3></Grid>
                          <Grid item lg={4} display='flex' justifyContent='flex-end' px={{md:0, lg:2}}>
                            <Button className='styledButtonSave' onClick={() => handleEditClick(merchant)}>Edit</Button>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent={'space-between'} spacing={2} columns={14}>
                          <Grid item sm={14} md={14} lg={8}>
                            <TableContainer sx={{ maxWidth: "auto" }}>
                              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                                <TableBody>
                                  {rows.map((row: any) => (
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
                          <Grid item sm={14} md={14} lg={6}>
                            <TableContainer sx={{ maxWidth: "auto" }}>
                              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                                <TableBody>
                                  {newrows.map((row: any) => (
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
                  <DescriptionTabs id={merchant?.id} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button className='styledButtonCancel' style={{ marginBottom: '24px' }} variant="outlined" color="secondary" onClick={handleCloseMerchantView}>Cancel</Button>
                  </Box>
                </Grid>
              </Grid>)
            }
          </>
        }
      </Box>
    </React.Fragment >
  )
}

export default MerchantView;