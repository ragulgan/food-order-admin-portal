import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';
import { AnyNaptrRecord } from 'dns';

interface Merchant {
  id: string;
  branches: [
    {
      branchName: string;
      branchType: string;
      contactName: string;
      contactAddress: string;
      contactNo: string;
      contactEmail: string;
      gst: string;
      status: string;
      cityId: string;
      countryId: string;
      stateId: string;
      images: string[];
    }
  ];
  categoryTypes: any;
  contactAddress: string;
  contactEmail: string;
  contactName: string;
  contactNo: string;
  city: string;
  state: string;
  country: string;
  restaurantDesc: string;
  restaurantName: string;
  status: string;
  image: any;
  website: string;
  isVeg: any;
  roleId: string;
  password: string;
}

interface MerchantsState {
  loading: boolean;
  data: Merchant[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  updateMerchantId: string;
  fieldError: string;
  code: any;
}

interface UpdateMerchantByIdPayload {
  id: string;
  branches: [
    {
      branchName: string;
      branchType: string;
      contactName: string;
      contactAddress: string;
      contactNo: string;
      contactEmail: string;
      gst: string;
      status: string;
      cityId: string;
      countryId: string;
      stateId: string;
      images: string[];
    }
  ];
  categoryTypes: any;
  contactAddress: string;
  contactEmail: string;
  contactName: string;
  contactNo: string;
  city: string;
  state: string;
  country: string;
  restaurantDesc: string;
  restaurantName: string;
  status: string;
  image: any;
  website: string;
  isVeg: any;
  roleId: string;
  password: string;
}

export const updateMerchantById = createAsyncThunk<any, any>(
  'merchantUpdate/updateMerchantById',
  async (payload: UpdateMerchantByIdPayload, thunkAPI) => {
    return await Axios.put(`/merchant/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: MerchantsState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  updateMerchantId: '',
  fieldError: '',
  code: '',
};

export const merchantsUpdateByIdSlice = createSlice({
  name: 'merchantUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    },
    clearUpdateMerchantId: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.fieldError = '';
      state.updateMerchantId = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMerchantById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateMerchantById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (merchant) => merchant.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.updateMerchantId = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateMerchantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.fieldError = action?.payload?.response?.data?.data?.error;
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState, clearUpdateMerchantId } = merchantsUpdateByIdSlice.actions;
export default merchantsUpdateByIdSlice.reducer;
