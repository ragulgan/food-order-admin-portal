import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface SubCategoryAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: SubCategoryAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
}
export const addSubCategory = createAsyncThunk<any, any>('subCategoryAdd', async (payload, thunkAPI) => {
  return await Axios.post('/subCategory', payload).catch(thunkAPI.rejectWithValue)
});
export const subCategoryAddSlice = createSlice({
  name: 'subCategoryAdd',
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
    builder.addCase(addSubCategory.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addSubCategory.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(addSubCategory.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = subCategoryAddSlice.actions;
export default subCategoryAddSlice.reducer;






