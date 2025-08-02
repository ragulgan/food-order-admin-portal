import * as React from 'react'
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Divider } from '@mui/material';

const Orders: React.FC = () => {
  const chartData: any = {
    series: [{
      data: [121799, 50799, 25567, 5789]
    }
    ],
    options: {
      chart: {
        type: 'bar',
        width: '100%',
        height: 265,
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      plotOptions: {
        bar: {
          barHeight: '40%',
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        formatter: (val: any) => {
          return val / 1000 + 'K'
        }
      },
      xaxis: {
        categories: ['Yogesh', 'Sridhar', 'Saran', 'Naveen'],
        labels: {
          formatter: (val: any) => {
            return val / 1000 + 'K'
          }
        }
      },
      fill: {
        opacity: 1,
      },
      colors: ['#4A3AFF', '#9291A5', '#9291A5', '#9291A5'],
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }
  };
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className='dchart-title'>Driver</h2>
        <div>
          <select className='dchart-filter' /*value={selectedRange} onChange={handleRangeChange}*/ >
            <option value="TODAY">Today</option>
            <option value="WEEKLY">Week</option>
            <option value="MONTHLY">Month</option>
          </select>
        </div>
      </div>
      <Divider />
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type='bar'
        height={265}
      />
    </React.Fragment>
  );
}

export default Orders;