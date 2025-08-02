import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface MerchantViewByID {
  id: string;
  merchantId: string;
  restaurantName: string;
  restaurantDesc: string;
  contactName: string;
  contactNo: string;
  contactEmail: string;
  contactAddress: string;
  website: string;
  image: any;
  city: {
    id: string;
    cityName: string;
  };
  state: {
    id: string;
    stateName: string;
  };
  country: {
    id: string;
    countryName: string;
  };
  categoryTypeDetails: [
    {
      id: string;
      name: string;
    }
  ];
  isVeg: any;
  roleModuleDetails: {
    id: string;
    type: string;
    role: string;
  };
  password: string;
  branches: [
    {
      id: string;
      branchType: string;
      branchName: string;
      contactName: string;
      contactAddress: string;
      contactNo: string;
      contactEmail: string;
      gst: string;
      status: string;
      city: {
        id: string,
        cityName: string
      },
      country: {
        id: string,
        countryName: string
      },
      state: {
        id: string,
        stateName: string
      },
      images: [];
    }
  ];
  status: string;
  createdDate: string;
  modifiedDate: string;
  branchCount: number;
}

interface MerchantsState {
  loading: boolean;
  data: MerchantViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: MerchantsState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: ''
};

export const fetchMerchantById = createAsyncThunk('merchantView/fetchMerchantById', async (id: string, thunkAPI) => {
  return await Axios.get<MerchantViewByID>(`/merchant/${id}`).catch(thunkAPI.rejectWithValue)
});

export const merchantsViewByIdSlice = createSlice({
  name: 'merchantView',
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
      .addCase(fetchMerchantById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchMerchantById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchMerchantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = merchantsViewByIdSlice.actions;
export default merchantsViewByIdSlice.reducer;
