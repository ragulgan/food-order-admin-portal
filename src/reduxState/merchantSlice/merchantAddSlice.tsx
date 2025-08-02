import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface MerchantAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  merchantId: string;
  fieldError: string;
  code: any;
}
const initialState: MerchantAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  merchantId: '',
  fieldError: '',
  code: ''
}
export const addMerchant = createAsyncThunk<any, any>('merchantAdd', async (payload, thunkAPI) => {
  return await Axios.post('/merchant', payload).catch(thunkAPI.rejectWithValue)
});

export const merchantAddSlice = createSlice({
  name: 'merchantAdd',
  initialState,
  reducers: {
    clearAddState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    },
    clearMerchantId: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.merchantId = '';
      state.fieldError = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addMerchant.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addMerchant.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.merchantId = action?.payload?.data?.data;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addMerchant.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.fieldError = action?.payload?.response?.data?.data?.error;
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState, clearMerchantId } = merchantAddSlice.actions;
export default merchantAddSlice.reducer;