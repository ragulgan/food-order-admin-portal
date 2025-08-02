import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface City {
  id: string;
  cityName: string,
  state: {
    id: string;
    stateName: string;
  },
  status: string;
}

interface CityState {
  data: City[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: CityState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchCity = createAsyncThunk<any, any>('cityList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/city`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const citySlice = createSlice({
  name: 'cityList',
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
      .addCase(fetchCity.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCity.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.size = action?.payload?.data?.count;
        state.error = false;
      })
      .addCase(fetchCity.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = citySlice.actions;
export default citySlice.reducer;
