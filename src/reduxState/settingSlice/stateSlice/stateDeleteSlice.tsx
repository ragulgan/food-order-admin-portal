import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface State {
  id: string;
}

interface RegionState {
  data: State[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: RegionState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteStateById = createAsyncThunk('stateDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<State>(`/state/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const stateDeleteSlice = createSlice({
  name: 'stateDelete',
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
    builder.addCase(deleteStateById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    })
      .addCase(deleteStateById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (state) => state.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteStateById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = stateDeleteSlice.actions;
export default stateDeleteSlice.reducer;
