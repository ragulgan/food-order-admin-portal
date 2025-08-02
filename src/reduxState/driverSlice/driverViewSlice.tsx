import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface DriverViewByID {
  id: string,
  profile: {
    id: string;
    displayName: string;
    filePath: string;
  };
  firstName: string,
  lastName: string,
  driverId: string,
  emailId: string,
  nin: string,
  phoneNumber: string,
  dob: string,
  status: string,
  currentAddressDoorNo: string,
  currentAddressStreet: string,
  currentAddressLocality: string,
  currentAddressPincode: string,
  permanentAddressDoorNo: string,
  permanentAddressStreet: string,
  permanentAddressLocality: string,
  permanentAddressPincode: string,
  driverVehicleNumber: string,
  driverVehicleBrand: string,
  driverVehicleModel: string,
  driverVehicleColor: string,
  driverVehicleRCNumber: string,
  vehicleInsuranceNumber: string,
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
  permanentAddressCityDetails: {
    id: string,
    cityName: string
  },
  permanentAddressCountryDetails: {
    id: string,
    countryName: string
  },
  permanentAddressStateDetails: {
    id: string,
    stateName: string
  },
  documents: any,
}

interface DriverState {
  loading: boolean;
  data: any;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: DriverState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchDriverById = createAsyncThunk('driverView/fetchDriverById', async (id: string, thunkAPI) => {
  return await Axios.get<DriverViewByID>(`/driver/${id}`).catch(thunkAPI.rejectWithValue)
});

export const driverViewByIdSlice = createSlice({
  name: 'driverView',
  initialState,
  reducers: {
    clearViewState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchDriverById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = driverViewByIdSlice.actions;
export default driverViewByIdSlice.reducer;
