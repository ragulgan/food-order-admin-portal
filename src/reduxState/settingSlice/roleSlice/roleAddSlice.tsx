import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface RoleAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: RoleAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}
export const addRole = createAsyncThunk<any, any>('roleAdd', async (payload, thunkAPI) => {
  return await Axios.post('/role', payload).catch(thunkAPI.rejectWithValue)
});

export const roleAddSlice = createSlice({
  name: 'roleAdd',
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
    builder.addCase(addRole.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addRole.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addRole.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = roleAddSlice.actions;
export default roleAddSlice.reducer;
