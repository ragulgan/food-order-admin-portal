import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Shift {
  id: string;
  status: string;
  name: string;
  fromTime: string;
  toTime: string;
}

interface ShiftState {
  data: Shift[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: ShiftState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchShift = createAsyncThunk<any, any>('shiftList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/shiftTime`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const shiftSlice = createSlice({
  name: 'shiftList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShift.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchShift.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.size = action?.payload?.data?.count;
        state.error = false;
      })
      .addCase(fetchShift.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = shiftSlice.actions;
export default shiftSlice.reducer;
