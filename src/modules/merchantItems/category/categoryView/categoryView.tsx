import React, { Fragment, useEffect } from 'react'
import {
  Box, Button, Grid, Modal, Typography, Table, TableBody, TableRow,
  TableContainer, Chip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Category from '../../../../assets/images/Category.svg'
import errorImage from '../../../../assets/images/Error.png'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryById, clearViewState } from '../../../../reduxState/merchantItemSlice/category/categoryViewSlice';
import { RootState, AppDispatch } from '../../../../reduxState/store';
import { dateStringToObjectDayfirst } from '../../../utils/dateformat'
import Loading from '../../../commonToast/loader';
import _ from 'lodash'

interface ConfirmationModalProps {
  categoryId: string;
  isOpen: boolean;
  onClose: any;
}

const CategoryView: React.FC<ConfirmationModalProps> = ({ categoryId, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rightTable, setRightTable] = React.useState<any>([])
  const category = useSelector((state: RootState) => state.categoryView.data);
  const error = useSelector((state: RootState) => state.categoryView.error);

  useEffect(() => {
    if (categoryId) {
      setTimeout(() => {
        dispatch(fetchCategoryById(categoryId));
      }, 2000);
    }
  }, [categoryId, isOpen]);

  useEffect(() => {
    if (category && category?.id) {
      const temRow = [
        createData('Status', category?.status === "ACTIVE" ? (<Chip size='small' label={category?.status} className='status-active-chip' variant="outlined" />) :
          category?.status === "INACTIVE" ? (<Chip size='small' label={category?.status} className='status-inactive-chip' variant="outlined" />) :
            (<Chip size='small' label={category?.status} className='status-deleted-chip' variant="outlined" />)),
        createData('Created Date', dateStringToObjectDayfirst(category?.createdDate)),
      ]
      setRightTable(temRow)
    }
  }, [category]);

  if (!isOpen) {
    return null;
  }

  function createData(name: string, value: any) {
    return { name, value };
  }

  const categoryImg = category && category?.images?.id
  const isCategoryImgNotNull = !_.isNull(categoryImg);

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
        {categoryId !== category?.id ? (<Loading />):
        (
          <Grid container spacing={2}>
            <Grid item xs={12} position={'sticky'} top={0}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>View Category Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2} p={2}>
                  <Grid item xs={12} sm={6} md={5} lg={3}>
                    <Box px={2}>
                      {isCategoryImgNotNull && category?.images ?
                        (<img src={`${process.env.REACT_APP_API_BASE_URL}${category?.images?.filePath}`} alt={`Logo`} style={{ width: '213px', height: '213px', borderRadius: '20px' }} />) : (
                          <img src={Category} style={{ width: '213px', height: '213px' }} alt="Profile picture" />
                        )
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={7} lg={9}>
                    <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Grid item lg={2} className='view-details-header'><span style={{ paddingLeft: '16px' }}>{category?.categoryName}</span></Grid>
                    </Grid>
                    <Grid container>
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
                                  <TableCell className='view-details-row-data'>{row.value}</TableCell>
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

export default CategoryView;