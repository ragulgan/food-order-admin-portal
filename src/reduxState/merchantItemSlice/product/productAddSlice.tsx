import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface ProductAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  productId: string;
  code: any;
}
const initialState: ProductAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  productId: '',
  code: '',
}
export const addProduct = createAsyncThunk<any, any>('productAdd', async (payload, thunkAPI) => {
  return await Axios.post('/product', payload).catch(thunkAPI.rejectWithValue)
});
export const productAddSlice = createSlice({
  name: 'productAdd',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    },
    clearProductId: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.productId = '';
      state.code = '';
    }

  },
  extraReducers: (builder) => {
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.status = 'pending';
      state.error = false;
    }).addCase(addProduct.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.productId = action?.payload?.data?.data;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addProduct.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState, clearProductId } = productAddSlice.actions;
export default productAddSlice.reducer;