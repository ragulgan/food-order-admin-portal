import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

export interface forgotPasswordState {
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}
const initialState: forgotPasswordState = {
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
}
export const forgotPassword = createAsyncThunk<any, any>('forgotPassword', async (payload, thunkAPI) => {
  return await Axios.post('/auth/generateRandomPassword', payload).catch(thunkAPI.rejectWithValue)
});
export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = false;
    }).addCase(forgotPassword.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.code = action?.payload?.data?.code;
      state.error = false;
    }).addCase(forgotPassword.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;