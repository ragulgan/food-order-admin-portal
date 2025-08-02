import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Merchant {
  id: string;
  image: any;
  merchantId: string;
  restaurantName: string;
  contactName: string;
  contactNo: string;
  contactEmail: string;
  branchCount: number;
  contactAddress: string;
  branches: [
    {
      id: string;
      branchType: string;
      branchName: string;
      contactName: string;
      contactNo: string;
      contactEmail: string;
      status: string;
    }
  ];
  status: string;
  createdDate: string;
}

interface MerchantsState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: MerchantsState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchMerchants = createAsyncThunk<any, any>('merchantList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/merchant`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const merchantsSlice = createSlice({
  name: 'merchantList',
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
      .addCase(fetchMerchants.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchMerchants.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchMerchants.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = merchantsSlice.actions;
export default merchantsSlice.reducer;
