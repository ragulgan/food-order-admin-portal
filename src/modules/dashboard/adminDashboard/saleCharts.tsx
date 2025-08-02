import * as React from 'react'
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import saleEmptyState from '../../../assets/images/saleDashChart.webp'
import { Box, Typography } from '@mui/material';


const Sales: React.FC<any> = ({ chooseSales, chooseSalesPercent }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardMerchantSale = useSelector((state: RootState) => state.dashboardCard);
  const [selectedSaleType, setSelectedSaleType] = React.useState<string>('MONTHLY');
  const [selectedSalePer, setSelectedSalePer] = React.useState<string>('TOP');
  const seriesData = dashboardMerchantSale?.data?.SalesChart?.series;
  const xaxisCategories = dashboardMerchantSale?.data?.SalesChart?.xaxis?.categories;
  const hasChartData = seriesData?.length > 0 && xaxisCategories?.length > 0;

  const formattedSeriesData = seriesData?.map((series: any) => ({
    name: series?.name.charAt(0).toUpperCase() + series?.name.slice(1),
    data: series?.data,
  }));

  const chartData: any = {
    options: {
      chart: {
        type: 'bar',
        width: '100%',
        height: 265,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 3,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: xaxisCategories,
      },
      fill: {
        opacity: 1
      },
      colors: ['#5E54D8', '#F14B4B', '#14B755'],
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return  val;
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSaleType(event.target.value);
    chooseSales(event.target.value)
  };

  const handlePercentageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSalePer(event.target.value);
    chooseSalesPercent(event.target.value)
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className='dchart-title'>Branch Sales</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5 }}>
          <div>
            <select className='dchart-filter' value={selectedSalePer} onChange={handlePercentageChange}>
              <option value="TOP">Top</option>
              <option value="AVERAGE">Avg</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <select className='dchart-filter' value={selectedSaleType} onChange={handleRangeChange}>
              <option value="TODAY">Today</option>
              <option value="WEEKLY">Week</option>
              <option value="MONTHLY">Month</option>
            </select>
          </div>
        </div>
      </div>
      {
        hasChartData ? (
          <ReactApexChart
            options={chartData.options}
            series={formattedSeriesData}
            type='bar'
            height={265}
          />) : (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={265} p={5}>
            <Box textAlign={'center'}>
              <img src={saleEmptyState} alt="img" width={'55px'} height={'55px'} />
              <Typography my={2} className='dashboard-empty-state'>No Branch Sales Data Available</Typography>
            </Box>
          </Box>
        )
      }
    </React.Fragment>
  );
}

export default Sales;