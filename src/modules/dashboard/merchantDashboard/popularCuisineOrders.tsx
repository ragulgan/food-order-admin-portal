import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxState/store';
import cuisineEmptyState from '../../../assets/images/cuisineDashChart.webp'
import { Box, Typography } from '@mui/material';

const PopularCuisines: React.FC<any> = ({chooseCuisine}) => {
    const dispatch = useDispatch<AppDispatch>();
    const dashboardRegister = useSelector((state: RootState) => state.dashboardCard);
    const [selectedCuisine, setSelectedCuisine] = React.useState<string>('MONTHLY');
    const seriesData = dashboardRegister?.data?.cuisineChart?.series;
    const labels = dashboardRegister?.data?.cuisineChart?.labels;
    const hasChartData = seriesData?.length > 0 && labels?.length > 0;

    const chartData: any = {
        options: {
            chart: {
                width: '100%',
                height: 285,
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
            // title: {
            //     text: "Popular Cuisines Orders",
            //     align: 'left',
            //     style: {
            //         fontSize: '16px',
            //         fontWeight: 'bold',
            //         color: '#000'
            //     },
            // },
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

    const handleCuisineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCuisine(event.target.value);
        chooseCuisine(event.target.value)
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className='dchart-title'>Popular Cuisines Orders</h2>
                <div>
                    <select className='dchart-filter' value={selectedCuisine} onChange={handleCuisineChange}>
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
                        series={seriesData}
                        type='pie'
                        height={285}
                    />
                ) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={265} p={5}>
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
export default PopularCuisines;