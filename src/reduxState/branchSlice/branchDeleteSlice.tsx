import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Branch {
  id: string;
}

interface BranchState {
  data: Branch[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: BranchState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteBranchById = createAsyncThunk('branchDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Branch>(`/branch/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const branchDeleteSlice = createSlice({
  name: 'branchDelete',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteBranchById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteBranchById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (branch) => branch.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteBranchById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = branchDeleteSlice.actions;
export default branchDeleteSlice.reducer;
