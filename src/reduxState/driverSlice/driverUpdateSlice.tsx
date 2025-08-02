import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Driver {
  id: string,
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
  profile: any,
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
    countryName: string
  },
  currentAddressCityDetails: {
    cityName: string
  },
  currentAddressStateDetails: {
    stateName: string
  },
  permanentAddressCityDetails: {
    cityName: string
  },
  permanentAddressCountryDetails: {
    countryName: string
  },
  permanentAddressStateDetails: {
    stateName: string
  },
  documents: any,
}

interface DriverState {
  loading: boolean;
  data: Driver[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateDriverById = createAsyncThunk<any, any>('driverUpdate/updateDriverById', async (payload: Driver, thunkAPI) => {
  return await Axios.put(`/driver/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
}
);

const initialState: DriverState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const driversUpdateByIdSlice = createSlice({
  name: 'driverUpdate',
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
      .addCase(updateDriverById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        // state.status = 'pending';
      })
      .addCase(updateDriverById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (driver) => driver.id === action.payload.id
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateDriverById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = driversUpdateByIdSlice.actions;
export default driversUpdateByIdSlice.reducer;
