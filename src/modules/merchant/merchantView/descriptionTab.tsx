import React, { useEffect } from 'react'
import { Tabs, Tab, Typography, Box, TableContainer, Table, TableBody, TableRow, Chip, Divider, Grid, Card, CardHeader, Avatar, CardContent, Rating, Pagination, Stack } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxState/store';
import Loading from '../../commonToast/loader';
import StarIcon from '@mui/icons-material/Star';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const sampleData = {
  "id": 1,
  "rating": 3.5,
  "reviewCount": 500,
  "comments": [{
    "id": "1",
    "review": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "customerlogo": "http://localhost:3000/logo192.png",
    "CustomerName": "Raj kumar",
    "timeline": "9 hours ago",
    "rating": 3.5
  },
  {
    "id": "2",
    "review": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "customerlogo": "",
    "CustomerName": "selva kumar",
    "timeline": "9 hours ago",
    "rating": 2.5
  },
  {
    "id": "3",
    "review": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "customerlogo": "http://localhost:3000/logo192.png",
    "CustomerName": "Praveen kumar",
    "timeline": "9 hours ago",
    "rating": 4
  }
  ]
};


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
  id: any;
}

const DescriptionTabs: React.FC<ConfirmationModalProps> = ({ id }) => {
  const [value, setValue] = React.useState(0);
  const merchant = useSelector((state: RootState) => state.merchantView.data);
  const [description, setDescription] = React.useState<any>([])

  useEffect(() => {
    if (merchant && merchant?.id) {
      const driverRow = [
        createData('Description', merchant && merchant?.restaurantDesc ? merchant?.restaurantDesc : '--'),
      ]
      setDescription(driverRow)
    }
  }, [merchant]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function createData(
    name: string,
    value: any,
  ) {
    return { name, value };
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <Box sx={{ width: '100%' }} px={5}>
      {id !== merchant?.id && <>{<Loading />}</>}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='tabPanel-active'>
          <Tab className='driver-view-attachment-header' label="Description" {...a11yProps(0)} />
          {/* <Tab className='driver-view-attachment-header' label={`Rating & Reviews (${sampleData.reviewCount})`} {...a11yProps(1)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TableContainer sx={{ maxWidth: "auto", padding: '0px' }} className='padding-table'>
          <Table sx={{ borderStyle: 'hidden', maxWidth: "80%" }} aria-label="simple table">
            <TableBody>
              {description.map((description: any) => (
                <TableRow
                  key={description.name}
                  sx={{ border: 0, borderStyle: 'hidden' }}
                >
                  <TableCell className='merhchat-view-table'>{description.name}</TableCell>
                  <TableCell>
                    <Typography className='view-details-row-data'>
                      {description.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {/* rating tab hide start */}
      {/* <TabPanel value={value} index={1}>
        {sampleData.comments.map((review, index) => (
          <Card sx={{ maxWidth: '100%', marginBottom: '16px' }} key={index}>
            <CardHeader
              avatar={review.customerlogo ? (
                <Avatar alt={`Img`} src={review.customerlogo} />
              ) : (
                <Avatar sx={{ backgroundColor: getRandomColor() }}>
                  {review.CustomerName ? (
                    review.CustomerName.charAt(0).toUpperCase()
                  ) : 'N/A'}
                </Avatar>
              )}
              title={<Rating
                name="text-feedback"
                value={review.rating}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.15 }} fontSize="inherit" />}
              />}
              subheader={<Typography className='merchant-review-tab'>{`${review.CustomerName} . ${review.timeline}`}</Typography>}
            />
            <CardContent>
              <Typography className='merchant-review-content'>
                {review.review}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4 }}>
          <Stack spacing={2} paddingTop={2} direction="row" justifyContent='flex-end'>
            <Pagination size="small" showFirstButton showLastButton defaultPage={1} siblingCount={0} boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#000',
                  background: '#FFFFFF',
                  border: '0.742647px solid #DFE3E8',
                  borderRadius: '2.97059px',
                  margin: '0 2px',
                  '&.Mui-selected': {
                    backgroundColor: '#FFFFFF',
                    color: '#FB3E07',
                    border: '0.742647px solid #FB3E07',
                  },
                },
              }}
            />
          </Stack>
        </Box>
      </TabPanel> */}
      {/* rating tab hide finish */}
    </Box>
  );
}


export default DescriptionTabs;