import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Coupon {
  id: string;
  // coupenCode: string;
  coupenName: string;
  coupenPerc: string;
  coupenDesc: string;
  status: string;
}

interface CouponState {
  data: Coupon[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateCouponById = createAsyncThunk<any, any>('couponUpdate/updateCouponById', async (payload: Coupon, thunkAPI) => {
  return await Axios.put(`/coupenCode/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
}
);

const initialState: CouponState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const couponUpdateByIdSlice = createSlice({
  name: 'couponUpdate',
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
      .addCase(updateCouponById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        // state.status = 'pending';
      })
      .addCase(updateCouponById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (coupon) => coupon.id === action.payload.id
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCouponById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = couponUpdateByIdSlice.actions;
export default couponUpdateByIdSlice.reducer;
