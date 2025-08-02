import React, { useEffect } from 'react'
import { Tabs, Tab, Typography, Box, TableContainer, Table, TableBody, TableRow, Chip, Divider, Grid } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxState/store';

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
  const driver = useSelector((state: RootState) => state.driverView.data);
  const [drivers, setDrivers] = React.useState<any>([])
  const [vehicles, setVehicles] = React.useState<any>([])

  useEffect(() => {
    if (driver && driver?.id) {
      const driverRow = [
        createData('Driver Id', driver && driver?.driverId ? driver?.driverId : '--'),

        createData('NIN', driver && driver?.nin ? driver?.nin : '--'),

        createData('State', driver && driver?.permanentAddressStateDetails && driver?.permanentAddressStateDetails?.stateName ? driver?.permanentAddressStateDetails?.stateName : '--'),

        createData('City', driver && driver?.permanentAddressCityDetails && driver?.permanentAddressCityDetails?.cityName ? driver?.permanentAddressCityDetails?.cityName : '--'),

        createData('Current Address', driver && driver?.currentAddressDoorNo && driver?.currentAddressStreet && driver?.currentAddressLocality && driver?.currentAddressCityDetails?.cityName && driver?.currentAddressPincode && driver?.currentAddressStateDetails?.stateName && driver?.currentAddressCountryDetails?.countryName ? `${driver?.currentAddressDoorNo}, ${driver?.currentAddressStreet}, ${driver?.currentAddressLocality}, 
        ${driver?.currentAddressCityDetails?.cityName} ${'-'} ${driver?.currentAddressPincode}, ${driver?.currentAddressStateDetails?.stateName}, 
        ${driver?.currentAddressCountryDetails?.countryName}` : '--'),

        createData('Permanent Address', driver && driver?.permanentAddressDoorNo && driver?.permanentAddressStreet && driver?.permanentAddressLocality && driver?.permanentAddressCityDetails?.cityName && driver?.permanentAddressPincode && driver?.permanentAddressStateDetails?.stateName && driver?.permanentAddressCountryDetails?.countryName ? `${driver?.permanentAddressDoorNo}, ${driver?.permanentAddressStreet}, ${driver?.permanentAddressLocality}, 
        ${driver?.permanentAddressCityDetails?.cityName} ${'-'} ${driver?.permanentAddressPincode}, ${driver?.permanentAddressStateDetails?.stateName}, 
        ${driver?.permanentAddressCountryDetails?.countryName}` : '--'),

        createData('Status', driver && driver?.status ? (driver?.status === "ACTIVE" ? (<Chip size='small' label={driver?.status} className='status-active-chip' variant="outlined" />) :
          driver?.status === "INACTIVE" ? (<Chip size='small' label={driver?.status} className='status-inactive-chip' variant="outlined" />) : driver?.status === "NOT_VERIFIED" ? (<Chip size='small' label={driver?.status} className='order-status od-color' variant="outlined" />) : driver?.status === "PENDING" ? (<Chip size='small' label={driver?.status} className='order-status opickup-color' variant="outlined" />) :
            (<Chip size='small' label={driver?.status} className='status-deleted-chip' variant="outlined" />)) : '--'),
      ]
      setDrivers(driverRow)
    }
  }, [driver]);

  useEffect(() => {
    if (driver && driver?.id) {
      const vehicleRow = [
        createData('Vehicle Number', driver && driver?.driverVehicleNumber ? driver?.driverVehicleNumber : '--'),
        createData('Vehicle Brand', driver && driver?.driverVehicleBrand ? driver?.driverVehicleBrand : '--'),
        createData('Vehicle Color', driver && driver?.driverVehicleColor ? driver?.driverVehicleColor : '--'),
        createData('Vehicle Model', driver && driver?.driverVehicleModel ? driver?.driverVehicleModel : '--'),
        createData('Vehicle RC Number', driver && driver?.driverVehicleRCNumber ? driver?.driverVehicleRCNumber : '--'),
        createData('Vehicle Insurance Number', driver && driver?.vehicleInsuranceNumber ? driver?.vehicleInsuranceNumber : '--'),
      ]
      setVehicles(vehicleRow)
    }
  }, [driver]);

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
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='tabPanel-active'>
          <Tab className='driver-view-attachment-header' label="Personal Details " {...a11yProps(0)} />
          <Tab className='driver-view-attachment-header' label="Vehicle Details" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Grid container justifyContent={'space-between'} spacing={2} columns={12}>
      <Grid item sm={12} md={8} textAlign={'start'}>
      <TabPanel value={value} index={0}>
        <TableContainer sx={{ maxWidth: "auto", padding: '0px' }} className='padding-table'>
          <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
            <TableBody>
              {drivers?.map((driver: any) => (
                <TableRow
                  key={driver.name}
                  sx={{ border: 0, borderStyle: 'hidden' }}
                >
                  <TableCell className='merhchat-view-table'>{driver?.name}</TableCell>
                  <TableCell className='customer-second-table'>
                    <Typography className='view-details-row-data'>
                      {driver?.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      </Grid>
      </Grid>
      <Grid container justifyContent={'space-between'} spacing={2} columns={12}>
        <Grid item sm={12} md={8} textAlign={'start'}>
      <TabPanel value={value} index={1}>
        <TableContainer sx={{ maxWidth: "auto", padding: '0px' }} className='padding-table'>
          <Table sx={{ borderStyle: 'hidden' }} aria-label="simple table">
            <TableBody>
              {vehicles?.map((vehicle: any) => (
                <TableRow
                  key={vehicle.name}
                  sx={{ border: 0, borderStyle: 'hidden' }}
                >
                  <TableCell className='merhchat-view-table'>{vehicle?.name}</TableCell>
                  <TableCell className='customer-second-table'>
                    <Typography className='view-details-row-data'>
                    {vehicle?.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}


export default BasicTabs;