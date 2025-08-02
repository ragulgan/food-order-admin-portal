import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Merchant {
  id: string;
  merchantName: string;
  registeredDate: string;
  status: string;
}

interface MerchantsState {
  data: Merchant[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: MerchantsState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteMerchantById = createAsyncThunk('merchantDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Merchant>(`/merchant/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const merchantsDeleteSlice = createSlice({
  name: 'merchantDelete',
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
    builder.addCase(deleteMerchantById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    })
      .addCase(deleteMerchantById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (merchant) => merchant.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteMerchantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = merchantsDeleteSlice.actions;
export default merchantsDeleteSlice.reducer;
