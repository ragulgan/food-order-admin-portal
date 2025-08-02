import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface OrderStatus {
  id: string;
  orderStatus: string;
}

interface OrderStatusState {
  data: OrderStatus[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateOrderById = createAsyncThunk<any, any>('orderUpdate/updateOrderById', async (payload: OrderStatus, thunkAPI) => {
  return await Axios.put(`/orders/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
}
);

const initialState: OrderStatusState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const orderUpdateByIdSlice = createSlice({
  name: 'orderUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateOrderById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (order) => order.id === action.payload.id
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateOrderById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = orderUpdateByIdSlice.actions;
export default orderUpdateByIdSlice.reducer;
