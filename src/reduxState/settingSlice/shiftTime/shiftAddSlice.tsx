import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface ShiftTimeAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: ShiftTimeAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}
export const addShift = createAsyncThunk<any, any>('shiftTimeAdd', async (payload, thunkAPI) => {
  return await Axios.post('/shiftTime', payload).catch(thunkAPI.rejectWithValue)
});

export const shiftAddSlice = createSlice({
  name: 'shiftTimeAdd',
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
    builder.addCase(addShift.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addShift.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addShift.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = shiftAddSlice.actions;
export default shiftAddSlice.reducer;
