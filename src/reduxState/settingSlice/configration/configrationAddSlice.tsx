import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface ConfigrationAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: ConfigrationAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}
export const addConfigration = createAsyncThunk<any, any>('configrationAdd', async (payload, thunkAPI) => {
  return await Axios.post('/configuration', payload).catch(thunkAPI.rejectWithValue)
});

export const configrationAddSlice = createSlice({
  name: 'configrationAdd',
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
    builder.addCase(addConfigration.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addConfigration.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addConfigration.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = configrationAddSlice.actions;
export default configrationAddSlice.reducer;
