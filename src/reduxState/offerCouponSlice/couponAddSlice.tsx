import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface CouponAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: CouponAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
}
export const addCoupon = createAsyncThunk<any, any>('couponAdd', async (payload, thunkAPI) => {
  return await Axios.post('/coupenCode', payload).catch(thunkAPI.rejectWithValue)
});
export const couponAddSlice = createSlice({
  name: 'couponAdd',
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
    builder.addCase(addCoupon.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addCoupon.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addCoupon.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = couponAddSlice.actions;
export default couponAddSlice.reducer;