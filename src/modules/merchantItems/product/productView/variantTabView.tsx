import * as React from 'react';
import {
  Tabs, Tab, Typography, Box, Table, TableBody, TableRow, TableContainer,
  Chip, Grid
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxState/store';
import Loading from '../../../commonToast/loader';

const StyledTableCell = styled(TableCell)(() => ({
  paddingLeft: '0px',
  borderBottom: '0px'
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ConfirmationModalProps {
  id: string;
}

const VariantDetails: React.FC<ConfirmationModalProps> = ({ id }) => {
  const [value, setValue] = React.useState(0);
  const productDetailState = useSelector((state: RootState) => state.productView.data);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (id !== productDetailState?.id) {
    return (<Loading />);
  }

  const variant = productDetailState && productDetailState?.variantDetails.map((variant: any) =>  variant && variant?.variantName);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          className='tabPanel-active'
          aria-label="scrollable auto tabs example">
          {variant && variant.map((variant: any, index: any) => (
            <Tab className='driver-view-attachment-header' sx={{
              '&:hover': {
                color: '#1F1F1F',
                backgroundColor: 'transparent',
                ':active': {
                  backgroundColor: 'transparent'
                },
              },
            }} key={index} label={variant} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {productDetailState && productDetailState?.variantDetails.map((variant: any, index: any) => (
        <>
          <TabPanel value={value} index={index}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={10} lg={10} textAlign={'start'}>
                <TableContainer sx={{ maxWidth: "auto", padding: '0px' }} className='padding-table'>
                  <Table sx={{ borderStyle: 'hidden', maxWidth: "80%" }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <StyledTableCell className='merhchat-view-table' style={{ whiteSpace: 'nowrap' }}>Price</StyledTableCell>
                        <StyledTableCell className='view-details-row-data'>{`${'OMR'} ${variant && variant?.price ? variant?.price : '--'}`}</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className='merhchat-view-table' style={{ whiteSpace: 'nowrap' }}>Description</StyledTableCell>
                        <StyledTableCell className='view-details-row-data'>{variant && variant?.description ? variant?.description : '--'}</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className='merhchat-view-table' style={{ whiteSpace: 'nowrap' }}>Status</StyledTableCell>
                        <StyledTableCell className='view-details-row-data'>
                          {variant && variant?.status ?
                            <>
                              {variant?.status === "ACTIVE" ? (<Chip size='small' label={variant?.status} className='status-active-chip' variant="outlined" />) : ('') ||
                                variant?.status === "INACTIVE" ? (<Chip size='small' label={variant?.status} className='status-inactive-chip' variant="outlined" />) : ('') ||
                                  variant?.status === "DELETED" ? (<Chip size='small' label={variant?.status} className='status-deleted-chip' variant="outlined" />) : ('')}
                            </> : '--'
                          }
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      ))}
    </Box>
  );
}


export default VariantDetails;