import * as React from 'react'
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import registerEmptyState from '../../../assets/images/registerDashChart.webp'
import { Box, Typography } from '@mui/material';

const Order: React.FC<any> = ({ chooseOrder }) => {
    const dispatch = useDispatch<AppDispatch>();
    const dashboardRegister = useSelector((state: RootState) => state.dashboardCard);
    const [selectedOrder, setSelectedOrder] = React.useState<string>('MONTHLY');
    const seriesData = dashboardRegister?.data?.orderChart?.series;
    const xaxisCategories = dashboardRegister?.data?.orderChart?.xaxis?.categories;
    const hasChartData = seriesData?.length > 0 && xaxisCategories?.length > 0;

    const formattedSeriesData = seriesData?.map((series: any) => ({
        name: series?.name.charAt(0).toUpperCase() + series?.name.slice(1),
        data: series?.data,
    }));

    const chartData: any = {
        options: {
            chart: {
                width: "100%",
                height: 250,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [2, 2, 2],
                curve: 'smooth',
                dashArray: [5, 5, 5]
            },
            // title: {
            //   text: 'Register',
            //   align: 'left',
            // },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                tooltipHoverFormatter: function (val: any, opts: any) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                }
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                categories: xaxisCategories,
            },
            fill: {
                opacity: 1
            },
            colors: ['#5E54D8', '#F14B4B', '#14B755'],
            tooltip: {
                y: [
                    {
                        title: {
                            formatter: function (val: any) {
                                return val;
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val: any) {
                                return val;
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val: any) {
                                return val;
                            }
                        }
                    }
                ]
            },
            grid: {
                borderColor: '#f1f1f1',
            }
        },
    }

    const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOrder(event.target.value);
        chooseOrder(event.target.value)
    };

    return (
        <React.Fragment >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className='dchart-title'>Order</h2>
                <div>
                    <select className='dchart-filter' value={selectedOrder} onChange={handleRangeChange}>
                        <option value="TODAY">Today</option>
                        <option value="WEEKLY">Week</option>
                        <option value="MONTHLY">Month</option>
                    </select>
                </div>
            </div>
            {
                hasChartData ? (
                    <ReactApexChart
                        options={chartData.options}
                        series={formattedSeriesData}
                        type='line'
                        height={250}
                    />
                ) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={250} p={5}>
                        <Box textAlign={'center'}>
                            <img src={registerEmptyState} alt="img" width={'55px'} height={'55px'} />
                            <Typography my={2} className='dashboard-empty-state'>No Order Data Available</Typography>
                        </Box>
                    </Box>
                )
            }
        </React.Fragment >
    );
}

export default Order;
