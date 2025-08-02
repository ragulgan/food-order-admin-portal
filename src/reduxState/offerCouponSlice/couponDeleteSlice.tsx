import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Coupon {
  id: string;
}

interface CouponState {
  data: Coupon[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: CouponState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteCouponById = createAsyncThunk('couponsDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Coupon>(`/coupenCode/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const couponDeleteSlice = createSlice({
  name: 'couponsDelete',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteCouponById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteCouponById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (coupon) => coupon.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteCouponById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = couponDeleteSlice.actions;
export default couponDeleteSlice.reducer;
