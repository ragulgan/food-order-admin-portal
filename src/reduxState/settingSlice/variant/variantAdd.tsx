import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface VariantAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: VariantAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
}
export const addVariant = createAsyncThunk<any, any>('variantAdd', async (payload, thunkAPI) => {
  return await Axios.post('/variant', payload).catch(thunkAPI.rejectWithValue)
});
export const variantAddSlice = createSlice({
  name: 'variantAdd',
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
    builder.addCase(addVariant.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(addVariant.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addVariant.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = variantAddSlice.actions;
export default variantAddSlice.reducer;






