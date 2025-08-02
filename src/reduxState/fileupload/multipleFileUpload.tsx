import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosFileInstance'

interface resposne {
  id: string;
  filePath: string;
  displayName: string;
}

export interface MerchantAddState {
  data: resposne[];
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
}

const initialState: MerchantAddState = {
  data: [],
  loading: false,
  message: '',
  status: 'idle',
  error: false,

}
export const multipleFileUpload = createAsyncThunk<any, any>('multipleFile', async (payload: any, thunkAPI) => {
  return await Axios.post('/S3/multiplefile', payload).catch(thunkAPI.rejectWithValue)
});
export const multipleFileUploadSlice = createSlice({
  name: 'multipleFile',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = []
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(multipleFileUpload.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(multipleFileUpload.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data?.data;
      state.message = action?.payload?.data?.message;
      state.error = false;
    }).addCase(multipleFileUpload.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = multipleFileUploadSlice.actions;
export default multipleFileUploadSlice.reducer;






