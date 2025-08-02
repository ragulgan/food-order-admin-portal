import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Offer {
  id: string;
  branchDetails: {
    id: string,
    branchName: string,
  };
  offerName: string;
  offerImage: any;
  offerPerc: string;
  offerDesc: string;
  offerColor: string;
  isApplied: boolean;
  status: string;
  createdDate: string;
}

interface OfferState {
  data: Offer[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: OfferState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchOffer = createAsyncThunk<any, any>('offerList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/offer`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const offerSlice = createSlice({
  name: 'offerList',
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
      .addCase(fetchOffer.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchOffer.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.size = action?.payload?.data?.count;
        state.error = false;
      })
      .addCase(fetchOffer.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = offerSlice.actions;
export default offerSlice.reducer;
