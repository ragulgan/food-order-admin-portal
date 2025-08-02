import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Dashboard {
  merchants: number;
  drivers: number;
  registerLogin: number;
  Register: number;
  RegisterChart: {
    series: [
      {
        name: string;
        data: [];
      }
    ],
    xaxis: {
      categories: [];
    }
  },
  SalesChart: {
    series: [
      {
        name: string;
        data: [];
      }
    ],
    xaxis: {
      categories: [];
    }
  },
  cuisine: {
    series: [],
    labels: []
  }
  cuisineChart: {
    series: [],
    labels: []
  },
  branch: any;
  orders: any;
  offers: any;
  coupens: any;
  customers:any;
  orderChart: {
    series: [
      {
        name: string;
        data: [];
      }
    ],
    xaxis: {
      categories: [];
    }
  },
  orderStatusChart: {
    series: [],
    labels: []
  },
  categoryChart: {
    series: [
      {
        name: string,
        data: []
      }
    ],
    xaxis: {
      categories: []
    }
  },
  dailyCount: any;
  previousCount: any;
  todayDeliveredCount: any;
  previousDeliveredCount: any;
  todayCancelledCount: any;
  previousCancelledCount: any;
  todaySale: any;
  previousSale: any;
}

interface DashboardApiResponse {
  data: Dashboard;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: DashboardApiResponse = {
  data: {
    merchants: 0,
    drivers: 0,
    registerLogin: 0,
    Register: 0,
    RegisterChart: {
      series: [
        {
          name: '',
          data: []
        },
      ],
      xaxis: {
        categories: []
      }
    },
    SalesChart: {
      series: [
        {
          name: '',
          data: []
        },
      ],
      xaxis: {
        categories: []
      }
    },
    cuisine: {
      series: [],
      labels: []
    },
    cuisineChart: {
      series: [],
      labels: []
    },
    branch: 0,
    orders: 0,
    offers: 0,
    coupens: 0,
    customers: 0,
    orderChart: {
      series: [
        {
          name: '',
          data: []
        },
      ],
      xaxis: {
        categories: []
      }
    },
    orderStatusChart: {
      series: [],
      labels: []
    },
    categoryChart: {
      series: [
        {
          name: '',
          data: []
        }
      ],
      xaxis: {
        categories: []
      }
    },
    dailyCount: 0,
    previousCount: 0,
    todayDeliveredCount: 0,
    previousDeliveredCount: 0,
    todayCancelledCount: 0,
    previousCancelledCount: 0,
    todaySale: 0,
    previousSale: 0,
  },
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const fetchDashboardCard = createAsyncThunk<any, any, any>('dashboardCard/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/dashboard`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const dashboardSlice = createSlice({
  name: 'dashboardCard',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = {
        merchants: 0,
        drivers: 0,
        registerLogin: 0,
        Register: 0,
        RegisterChart: {
          series: [
            {
              name: '',
              data: []
            },
          ],
          xaxis: {
            categories: []
          }
        },
        SalesChart: {
          series: [
            {
              name: '',
              data: []
            },
          ],
          xaxis: {
            categories: []
          }
        },
        cuisine: {
          series: [],
          labels: []
        },
        cuisineChart: {
          series: [],
          labels: []
        },
        branch: 0,
        orders: 0,
        offers: 0,
        coupens: 0,
        customers: 0,
        orderChart: {
          series: [
            {
              name: '',
              data: []
            },
          ],
          xaxis: {
            categories: []
          }
        },
        orderStatusChart: {
          series: [],
          labels: []
        },
        categoryChart: {
          series: [
            {
              name: '',
              data: []
            }
          ],
          xaxis: {
            categories: []
          }
        },
        dailyCount: 0,
        previousCount: 0,
        todayDeliveredCount: 0,
        previousDeliveredCount: 0,
        todayCancelledCount: 0,
        previousCancelledCount: 0,
        todaySale: 0,
        previousSale: 0,
      };
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardCard.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchDashboardCard.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload.data?.data;
        state.message = action.payload.data?.message;
        state.code = action.payload.data?.code;
        state.error = false;
      })
      .addCase(fetchDashboardCard.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
