import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Modal, Typography, Table, TableBody, TableRow,
  TableContainer, CircularProgress, Avatar, Chip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import avatorEmpty from '../../../assets/images/avatorEmpty.png'
import errorImage from '../../../assets/images/Error.png'
import { clearViewState } from '../../../reduxState/customerSlice/customerViewSlice';
import { RootState } from '../../../reduxState/store';
import { dateStringToObjectDayfirst } from '../../utils/dateformat'
import Loading from '../../commonToast/loader';
import _ from 'lodash'

interface ConfirmationModalProps {
  customerId: string;
  isOpen: boolean;
  onClose: any;
}

const CustomerView: React.FC<ConfirmationModalProps> = ({ customerId, isOpen, onClose }) => {
  const [rows, setRows] = React.useState<any>([])
  const customer = useSelector((state: RootState) => state.customerView.data);
  const error = useSelector((state: RootState) => state.customerView.error);

  useEffect(() => {
    if (customer && customer?.id) {
      const temRow = [
        createData('Phone Number', customer?.mobileNumber ? customer?.mobileNumber : '--'),
        createData('Email', customer?.emailId ? customer?.emailId : '--'),
        createData('Created Date', customer && customer?.createdDate ? dateStringToObjectDayfirst(customer?.createdDate) : '--'),
        createData('Status', customer && customer?.status ? (customer?.status === "ACTIVE" ? (<Chip size='small' label={customer?.status} className='status-active-chip' variant="outlined" />) : customer?.status === "INACTIVE" ? (<Chip size='small' label={customer?.status} className='status-inactive-chip' variant="outlined" />) : (<Chip size='small' label={customer?.status} className='status-deleted-chip' variant="outlined" />)) : '--'),
      ]
      setRows(temRow)
    }
  }, [customer]);

  if (!isOpen) {
    return null;
  }

  function createData(name: string, value: any) {
    return { name, value };
  }

  const customerImg = customer && customer?.image?.id
  const isCustomerImgNotNull = !_.isNull(customerImg);

  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'scroll', width: '70%', height: '380px', backgroundColor: '#FFFAF8', boxShadow: 24, borderRadius: '20px' }}>
          {error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }} p={3}>
              <Box textAlign={'center'}>
                <img style={{ width: '10%', height: '10%' }} src={errorImage} alt="delivery" />
                <Typography my={3} color="error">{error}</Typography>
              </Box>
            </Box>
          ) :
            <>
              {customerId !== customer?.id ? (<Loading />) :
                (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ width: "100%", bgcolor: '#FFFAF8', zIndex: 2}} position={'sticky'} top={0}>
                      <Typography className='view-details-header' variant="h5" align="center" mb={2}>View Customer Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2} p={2}>
                          <Grid item xs={12} sm={12} md={5} lg={3} textAlign={{sm: "center", md: 'start'}}>
                            <Box px={2}>
                              {isCustomerImgNotNull && customer?.image ? (
                                <img src={`${process.env.REACT_APP_API_BASE_URL}${customer?.image?.filePath}`} alt={`Profile Img`} width='184px' height='180px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                              ) : (
                                <img src={avatorEmpty} alt="Profile picture" width='184px' height='180px' style={{ borderRadius: '18px', objectFit: 'cover' }} loading='lazy' />
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={12} md={7} lg={9}>
                            <Grid container display='flex' justifyContent={{sm:'center', md:'space-between'}} alignItems={'center'}>
                              {customer && customer?.firstName && customer?.lastName ?
                                <Grid item lg={8} className='view-details-header'><span style={{ paddingLeft: '10px' }}>{`${customer?.firstName} ${customer?.lastName}`}</span></Grid> : '--'}
                            </Grid>
                            <Grid container display='flex' justifyContent={{sm:'center', md:'space-between'}} alignItems={'center'}>
                            <Grid item lg={8}>
                              <TableContainer sx={{ maxWidth: "auto" }}>
                                <Table sx={{ borderStyle: 'hidden', maxWidth: "100%" }} aria-label="simple table">
                                  <TableBody>
                                    {rows.map((row: any) => (
                                      <TableRow
                                        key={row.name}
                                        sx={{ border: 0, borderStyle: 'hidden' }}
                                      >
                                        <TableCell className='merhchat-view-table'>{row?.name}</TableCell>
                                        <TableCell className='customer-second-table'>
                                          <Typography className='view-details-row-data'>
                                            {row?.value}
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
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", bgcolor: '#FFFAF8', zIndex: 2, position:'sticky', bottom:-1}}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button className='styledButtonCancel ' style={{ marginBottom: '16px' }} variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
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

export default CustomerView;