import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface CustomerAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: CustomerAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
}
export const addCustomer = createAsyncThunk<any, any>('customerAdd', async (payload, thunkAPI) => {
  return await Axios.post('/customer', payload).catch(thunkAPI.rejectWithValue)
});
export const customerAddSlice = createSlice({
  name: 'customerAdd',
  initialState,
  reducers: {
    clearAddState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addCustomer.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(addCustomer.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addCustomer.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = customerAddSlice.actions;
export default customerAddSlice.reducer;