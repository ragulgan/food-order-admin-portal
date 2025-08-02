import * as React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import GeneralTabs from './generalTab';
import RoleTabs from './role/roleList';
import CountryTabs from './country/countryList';
import StateTabs from './state/stateList';
import CityTabs from './city/cityList';
import CategoryTypeTabs from './categoryType/cuisineList'
import VariantTabs from './variant/variantList';
import ConfigAdd from './configration/configrationAdd';
import ShiftTimingTabs from './shiftTiming/shiftTimingList'
import { Role_Types } from '../utils/constant'
import LanguageTabs from './textConfig/textConfigList';

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
          <Box>{children}</Box>
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

const SettingTabs: React.FC<any> = () => {
  const [value, setValue] = React.useState(0);
  // roles
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      {roles_data.role === Role_Types.Admin ?
        <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '20px', p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', position:'sticky', top: "10%", bgcolor: 'background.paper', zIndex: 2 }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="basic tabs example" className='setting-tabPanel-active'>
              <Tab className='driver-view-attachment-header' label="Roles" {...a11yProps(0)} />
              <Tab className='driver-view-attachment-header' label="Country" {...a11yProps(1)} />
              <Tab className='driver-view-attachment-header' label="State" {...a11yProps(2)} />
              <Tab className='driver-view-attachment-header' label="City" {...a11yProps(3)} />
              <Tab className='driver-view-attachment-header' label="Cuisine Type" {...a11yProps(4)} />
              {/* <Tab className='driver-view-attachment-header' label="Variant" {...a11yProps(5)} /> */}
              <Tab className='driver-view-attachment-header' label="Shift Timing" {...a11yProps(5)} />
              <Tab className='driver-view-attachment-header' label="Language" {...a11yProps(6)} />
              <Tab className='driver-view-attachment-header' label="Configuration" {...a11yProps(7)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <RoleTabs />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CountryTabs />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <StateTabs />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <CityTabs />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <CategoryTypeTabs />
          </TabPanel>
          {/* <TabPanel value={value} index={5}>
            <VariantTabs />
          </TabPanel> */}
          <TabPanel value={value} index={5}>
            <ShiftTimingTabs />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <LanguageTabs />
          </TabPanel>
          <TabPanel value={value} index={7}>
            <ConfigAdd />
          </TabPanel>
        </Box> :
        <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '20px', p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', position:'sticky', top: "10%", bgcolor: 'background.paper', zIndex: 2  }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="basic tabs example" className='setting-tabPanel-active'>
              <Tab className='driver-view-attachment-header' label="General" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <Box px={4}>
            <TabPanel value={value} index={0}>
              <GeneralTabs />
            </TabPanel>
          </Box>
        </Box>}
    </React.Fragment>
  )
}

export default SettingTabs;