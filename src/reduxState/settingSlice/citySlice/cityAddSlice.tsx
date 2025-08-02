import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface CityAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: CityAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}
export const addCity = createAsyncThunk<any, any>('cityAdd', async (payload, thunkAPI) => {
  return await Axios.post('/city', payload).catch(thunkAPI.rejectWithValue)
});

export const cityAddSlice = createSlice({
  name: 'cityAdd',
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
    builder.addCase(addCity.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addCity.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addCity.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = cityAddSlice.actions;
export default cityAddSlice.reducer;
