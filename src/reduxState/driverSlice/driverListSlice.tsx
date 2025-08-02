import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Driver {
  id: string;
  profile: {
    id: string;
    displayName: string;
    filePath: string;
  };
  firstName: string;
  lastName: string;
  driverId: string;
  phoneNumber: string;
  currentAddressDoorNo: string,
  currentAddressStreet: string,
  currentAddressLocality: string,
  currentAddressCountryDetails: {
    id: string,
    countryName: string
  },
  currentAddressCityDetails: {
    id: string,
    cityName: string
  },
  currentAddressStateDetails: {
    id: string,
    stateName: string
  },
  currentAddressPincode: string,
  status: string;
}

interface DriverState {
  data: Driver[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: DriverState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchDriver = createAsyncThunk<any, any>('driverList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/driver`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const driversSlice = createSlice({
  name: 'driverList',
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
      .addCase(fetchDriver.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchDriver.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchDriver.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = driversSlice.actions;
export default driversSlice.reducer;