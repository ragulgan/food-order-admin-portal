import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CouponEditByID {
  id: string;
  coupenCode: string;
  coupenName: string;
  coupenPerc: string;
  coupenDesc: string;
  status: string;
}

interface CouponState {
  loading: boolean;
  data: CouponEditByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: CouponState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchCouponById = createAsyncThunk('couponEdit/fetchCouponById', async (id: string, thunkAPI) => {
  return await Axios.get<CouponEditByID>(`/coupenCode/${id}`).catch(thunkAPI.rejectWithValue)
});

export const couponEditByIdSlice = createSlice({
  name: 'couponEdit',
  initialState,
  reducers: {
    clearEditState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouponById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCouponById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearEditState } = couponEditByIdSlice.actions;
export default couponEditByIdSlice.reducer;
