import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Branch {
  id: string,
}

interface BranchState {
  loading: boolean;
  data: Branch[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateBranchById = createAsyncThunk<any, any>('branchUpdate/updateBranchById', async (payload: Branch, thunkAPI) => {
  return await Axios.put(`/branch/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
}
);

const initialState: BranchState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: ''
};

export const branchsUpdateByIdSlice = createSlice({
  name: 'branchUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateBranchById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateBranchById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (branch) => branch.id === action.payload.id
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.status = 'succeeded';
        state.error = false;
        state.code = action?.payload?.data?.code;
      })
      .addCase(updateBranchById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = branchsUpdateByIdSlice.actions;
export default branchsUpdateByIdSlice.reducer;
