import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Country {
  id: string;
  status: string;
  countryName: string;
}

interface CountryState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: CountryState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchCountry = createAsyncThunk<any, any>('countryList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/country`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const countrySlice = createSlice({
  name: 'countryList',
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
      .addCase(fetchCountry.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCountry.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.size = action?.payload?.data?.count;
        state.error = false;
      })
      .addCase(fetchCountry.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = countrySlice.actions;
export default countrySlice.reducer;
