import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface OfferUpdateByID {
  id: string;
  branchId: any;
  offerColor: string;
  offerDesc: string;
  offerImage: any;
  offerName: string;
  offerPerc: any;
  status: any;
}

interface OfferUpdateState {
  loading: boolean;
  data: OfferUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface OfferUpdateByIdPayload {
  id: string;
  branchId: any;
  offerColor: string;
  offerDesc: string;
  offerImage: any;
  offerName: string;
  offerPerc: any;
  status: any;
}


export const updateOfferById = createAsyncThunk<any, any>('offersUpdate/offersUpdateByID',
  async (payload: OfferUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/offer/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: OfferUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const offerUpdateByIdSlice = createSlice({
  name: 'offersUpdate',
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
      .addCase(updateOfferById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateOfferById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (offer) => offer.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateOfferById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = offerUpdateByIdSlice.actions;
export default offerUpdateByIdSlice.reducer;