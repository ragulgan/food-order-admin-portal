import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface CategoryAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: CategoryAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
}
export const addCategory = createAsyncThunk<any, any>('categoryAdd', async (payload, thunkAPI) => {
  return await Axios.post('/category', payload).catch(thunkAPI.rejectWithValue)
});
export const categoryAddSlice = createSlice({
  name: 'categoryAdd',
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
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addCategory.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addCategory.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = categoryAddSlice.actions;
export default categoryAddSlice.reducer;






