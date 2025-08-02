import * as React from 'react'
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import saleEmptyState from '../../../assets/images/saleDashChart.webp'
import { Box, Typography } from '@mui/material';


const Revenue: React.FC<any> = ({ chooseSalesCategory }) => {
    const dispatch = useDispatch<AppDispatch>();
    const dashboardMerchantSale = useSelector((state: RootState) => state.dashboardCard);
    const [selectedSaleCategoryType, setSelectedSaleCategoryType] = React.useState<string>('MONTHLY');
    const seriesData = dashboardMerchantSale?.data?.categoryChart?.series;
    const xaxisCategories = dashboardMerchantSale?.data?.categoryChart?.xaxis?.categories;
    const hasChartData = seriesData?.length > 0 && xaxisCategories?.length > 0;

    const chartData: any = {
        options: {
            chart: {
                type: 'bar',
                width: '100%',
                height: 250,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 3,
                    columnWidth: '25%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['transparent']
            },
            // title: {
            //   text: 'Revenue by Category',
            //   align: 'left'
            // },
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
                        return  val + " order"
                    }
                }
            },
            grid: {
                borderColor: '#f1f1f1',
            }
        }
    };

    const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSaleCategoryType(event.target.value);
        chooseSalesCategory(event.target.value)
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className='dchart-title'>Revenue by Category</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5 }}>
                    <div>
                        <select className='dchart-filter' value={selectedSaleCategoryType} onChange={handleRangeChange}>
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
                        series={seriesData}
                        type='bar'
                        height={250}
                    />) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={265} p={5}>
                        <Box textAlign={'center'}>
                            <img src={saleEmptyState} alt="img" width={'55px'} height={'55px'} />
                            <Typography my={2} className='dashboard-empty-state'>No Category Sales Data Available</Typography>
                        </Box>
                    </Box>
                )
            }
        </React.Fragment>
    );
}

export default Revenue;