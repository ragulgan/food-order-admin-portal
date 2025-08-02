import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Region {
  id: string;
  cityName: string,
  state: {
    id: string;
    stateName: string;
    country: {
      id: string;
      status: string;
      countryName: string;
    }
    status: string;
  },
  status: string;
}

interface RegionState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: any;
}

const initialState: RegionState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: '',
};

export const fetchRegion = createAsyncThunk<any, any>('regionList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/city`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const regionSlice = createSlice({
  name: 'regionList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegion.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchRegion.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action?.payload?.data?.code;
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(fetchRegion.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = regionSlice.actions;
export default regionSlice.reducer;
