import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Order {
  id: string,
  orderId: string,
  customerDetails: {
    id: string,
    customerName: string
  },
  driverDetails: {
    id: string,
    driverName: string,
    profile: string
  }
  subTotalAmt: string,
  createdDate: string,
  orderSts: string,
  totItems: string;
}

interface OrdersState {
  data: Order[];
  loading: any;
  message: any;
  error: any;
  status: any;
  size: any;
}

const initialState: OrdersState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchOrders = createAsyncThunk<any, any>('ordersList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/orders`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchOrders.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = ordersSlice.actions;
export default ordersSlice.reducer;
