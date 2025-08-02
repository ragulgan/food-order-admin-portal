import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface BranchListState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: BranchListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchBranch = createAsyncThunk<any, any>('branchList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/branch`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const branchSlice = createSlice({
  name: 'branchList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranch.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchBranch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchBranch.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = branchSlice.actions;
export default branchSlice.reducer;
