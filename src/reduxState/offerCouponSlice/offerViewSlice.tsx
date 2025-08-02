import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface OfferViewByID {
  id: string;
  branchDetails: any;
  offerName: string;
  offerImage: any;
  offerPerc: any;
  offerDesc: string;
  offerColor: string;
  isApplied: string;
  status: any;
  createdDate: string;
}

interface OfferViewState {
  loading: boolean;
  data: OfferViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: OfferViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchOfferById = createAsyncThunk('offersView/fetchOfferById', async (id: string, thunkAPI) => {
  return await Axios.get<OfferViewByID>(`/offer/${id}`).catch(thunkAPI.rejectWithValue)
});

export const offerViewByIdSlice = createSlice({
  name: 'offersView',
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
      .addCase(fetchOfferById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchOfferById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchOfferById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = offerViewByIdSlice.actions;
export default offerViewByIdSlice.reducer;
