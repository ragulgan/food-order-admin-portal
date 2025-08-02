import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import cuisineEmptyState from '../../../assets/images/cuisineDashChart.webp'
import { Box, Typography } from '@mui/material';

const OrderStatus: React.FC<any> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dashboardRegister = useSelector((state: RootState) => state.dashboardCard);
    const seriesData = dashboardRegister?.data?.orderStatusChart?.series;
    const labels = dashboardRegister?.data?.orderStatusChart?.labels;
    const hasChartData = seriesData?.length > 0 && labels?.length > 0;

    const chartData: any = {
        options: {
            chart: {
                width: '100%',
                height: 310,
                type: 'donut',
            },
            labels: labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    size: 200,
                    donut: {
                        size: '60%',
                    },
                    expandOnClick: true
                }
            },
            // title: {
            //     text: "Order Status",
            //     align: 'left',
            //     style: {
            //         fontSize: '16px',
            //         fontWeight: 'bold',
            //         color: '#000'
            //     },
            // },
            dataLabels: {
                offset: null,
                labels: {
                    show: false,
                }
            },
            legend: {
                show: true,
                position: 'right',
                horizontalAlign: 'right',
                formatter: function (val: any, opts: any) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex] + ''
                }
            },
            colors: ['#4A3AFF', '#008FFB', '#962DFF', '#FEB019', '#00E396', '#FF4560'],
        },
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'start' }}>
                <h2 className='dchart-title'>Order Status</h2>
            </div>
            {
                hasChartData ? (
                    <ReactApexChart
                        options={chartData.options}
                        series={seriesData}
                        type='donut'
                        height={310}
                    />
                ) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={250} p={5}>
                        <Box textAlign={'center'}>
                            <img src={cuisineEmptyState} alt="img" width={'55px'} height={'55px'} />
                            <Typography my={2} className='dashboard-empty-state'>No Orders Status Data Available</Typography>
                        </Box>
                    </Box>
                )
            }
        </React.Fragment>
    );
}
export default OrderStatus;