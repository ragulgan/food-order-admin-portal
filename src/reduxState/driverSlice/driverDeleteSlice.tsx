import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Driver {
  id: string;
}

interface DriversState {
  data: Driver[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: DriversState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteDriverById = createAsyncThunk('driversDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Driver>(`/driver/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const driversDeleteSlice = createSlice({
  name: 'driversDelete',
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
    builder.addCase(deleteDriverById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteDriverById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (driver) => driver.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteDriverById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = driversDeleteSlice.actions;
export default driversDeleteSlice.reducer;
