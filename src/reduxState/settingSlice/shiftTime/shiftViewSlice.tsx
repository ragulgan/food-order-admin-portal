import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface ShiftViewByID {
  id: string;
  status: string;
  name: string;
  fromTime: string;
  toTime: string;
}

interface ShiftViewState {
  loading: boolean;
  data: ShiftViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: ShiftViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchShiftById = createAsyncThunk('shiftView/fetchShiftById', async (id: string, thunkAPI) => {
  return await Axios.get<ShiftViewByID>(`/shiftTime/${id}`).catch(thunkAPI.rejectWithValue)
});

export const shiftViewByIdSlice = createSlice({
  name: 'shiftView',
  initialState,
  reducers: {
    clearViewState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShiftById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchShiftById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchShiftById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = shiftViewByIdSlice.actions;
export default shiftViewByIdSlice.reducer;
