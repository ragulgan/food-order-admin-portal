import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import cuisineEmptyState from '../../../assets/images/cuisineDashChart.webp'
import { Box, Typography, Divider } from '@mui/material';

const Cuisines: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardRegister = useSelector((state: RootState) => state.dashboardCard);

  const seriesData = dashboardRegister?.data?.cuisine?.series;
  const labels = dashboardRegister?.data?.cuisine?.labels;

  const hasChartData = seriesData?.length > 0 && labels?.length > 0;

  const chartData: any = {
    options: {
      chart: {
        width: '100%',
        height: 300,
        type: 'pie',
      },
      labels: labels,
      theme: {
        monochrome: {
          enabled: false
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          dataLabels: {
            offset: -5
          }
        }
      },
      dataLabels: {
        formatter(val: any, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex]
          return [name, val.toFixed(1) + '%']
        }
      },
      legend: {
        show: false
      },
      colors: ['#5E54D8', '#698AFF', '#93AAFD', '#C6D2FD', '#E5EAFC'],
    },
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <h2 className='dchart-title'>Popular Cuisines Orders</h2>
      </div>
      <Divider />  
      {
        hasChartData ? (
            <ReactApexChart
              options={chartData.options}
              series={seriesData}
              type='pie'
              height={300}
            />
        ) : (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={280} p={5}>
            <Box textAlign={'center'}>
              <img src={cuisineEmptyState} alt="img" width={'55px'} height={'55px'} />
              <Typography my={2} className='dashboard-empty-state'>No Cuisines Data Available</Typography>
            </Box>
          </Box>
        )
      }
    </React.Fragment>
  );
}
export default Cuisines;