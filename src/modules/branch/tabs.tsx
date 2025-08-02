import React, { useEffect } from 'react'
import { Tabs, Tab, Typography, Box, TableContainer, Table, TableBody, TableRow, Chip, Divider, Grid } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxState/store';
import { formatDisplayTimeOnly } from '../utils/dateformat'

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

const BasicTabs: React.FC<ConfirmationModalProps> = ({ id }) => {
  const [value, setValue] = React.useState(0);
  const branchView = useSelector((state: RootState) => state.branchView.data);
  const [branch, setBranch] = React.useState<any>([])
  const [branchAddress, setBranchAddress] = React.useState<any>([])
  const [branchType, setBranchType] = React.useState<any>([])

  const renderWeekDays = (branchIsOpen: any) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
      <div style={{ display: 'flex' }}>
        {weekDays.map((day, index) => (
          <div key={day} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              disabled
              checked={branchIsOpen[index] === '1' ?? null}
            />
            <label>{day}</label>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (branchView && branchView?.id) {
      const categoryTypes = branchView && branchView?.categoryDetails.map((item: any) => item.categoryName).join(', ');
      const BranchRow = [
        createData('Category', branchView && branchView?.categoryDetails?.length > 0 ? (
          <Typography className='category-type-chip cuisine-type-text'>{categoryTypes.split('\n')}</Typography>
        ): '--'),
        createData('Branch Min Amount', branchView && branchView?.branchMinAmount ?
          (`${'OMR'} ${branchView?.branchMinAmount}`) : '--'),
        createData('Branch Location', branchView && branchView?.branchLocation ? branchView?.branchLocation : '--'),
        createData('Branch Status', branchView && branchView?.branchStatus ? branchView?.branchStatus : '--'),
        createData('Branch Open Days', branchView && branchView?.branchIsOpen?.length > 0 ? renderWeekDays(branchView?.branchIsOpen) : '--'),
      ]
      setBranch(BranchRow)
    }
  }, [branchView]);

  useEffect(() => {
    if (branchView && branchView?.id) {
      const addressParts = branchView && branchView?.branchAddress.split(', ').reverse();
      const cuisineTypes = branchView && branchView?.categoryTypeDetails?.map((item: any) => item.name).join(', ');
      let city = '--';
      let state = '--';
      let country = '--';

      if (addressParts.length >= 3) {
        city = addressParts[2];
        state = addressParts[1];
        country = addressParts[0];
      }
      const addressRow = [
        createData('Cuisine Type',branchView && branchView?.categoryTypeDetails?.length > 0 ? (
          <Typography className='cuisine-type-chip cuisine-type-text'>{cuisineTypes.split('\n')}</Typography>
        ): '--'),
        createData('City', city),
        createData('State', state),
        createData('Country', country),
        createData('Longitude', branchView && branchView?.longt ? branchView?.longt : '--'),
        createData('Latitude', branchView && branchView?.lat ? branchView?.lat : '--'),
      ]
      setBranchAddress(addressRow)
    }
  }, [branchView]);

  useEffect(() => {
    if (branchView && branchView?.id) {
      const TypeRow = [
        createData('', branchView && branchView?.branchType ? branchView?.branchType : '--'),
      ]
      setBranchType(TypeRow)
    }
  }, [branchView]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='setting-tabPanel-active'>
          <Tab className='driver-view-attachment-header' label="Branch Details " {...a11yProps(0)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container justifyContent={'space-between'} spacing={2} columns={16}>
          <Grid item sm={14} md={14} lg={8} order={{ sm: 2, md: 2, lg: 1}}>
            <TableContainer sx={{ maxWidth: "auto", padding: '0px' }}>
              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                <TableBody>
                  {branch.map((item: any) => (
                    <TableRow
                      key={item.id}
                      sx={{ border: 0, borderStyle: 'hidden' }}
                    >
                      <TableCell className='merhchat-view-table'>{item.name}</TableCell>
                      <TableCell className='customer-second-table'>
                        <Typography className='view-details-row-data'>
                          {item.value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item sm={14} md={14} lg={6} order={{ sm: 3, md: 3, lg: 2}}>
            <TableContainer sx={{ maxWidth: "auto", padding: '0px' }}>
              <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
                <TableBody>
                  {branchAddress.map((item: any) => (
                    <TableRow
                      key={item.id}
                      sx={{ border: 0, borderStyle: 'hidden' }}
                    >
                      <TableCell className='merhchat-view-table'>{item.name}</TableCell>
                      <TableCell className='customer-second-table'>
                        <Typography className='view-details-row-data'>
                          {item.value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item sm={16} md={16} lg={2} order={{ sm: 1, md: 1, lg: 3}} display={'flex'} justifyContent={'end'}>
            {branchType.map((item: any) => (
              <Typography>
                {item.value === 'MainBranch' ? (<Chip className='branch-main-chip' label={item.value} variant="outlined" />) :
                  (<Chip className='branch-sub-chip' label={item.value} variant="outlined" />)}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </TabPanel>
      {branchView && branchView?.image?.length > 1 ? (
      <Divider />) : null}
    </Box>
  );
}


export default BasicTabs;