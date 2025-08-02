import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  image: any;
  email: string;
  status: string;
}

interface CustomerState {
  loading: boolean;
  data: Customer[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateCustomerById = createAsyncThunk<any, any>(
  'customerUpdate/updateCustomerById',
  async (payload: Customer, thunkAPI) => {
    return await Axios.put(`/customer/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CustomerState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const customersUpdateByIdSlice = createSlice({
  name: 'customerUpdate',
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
      .addCase(updateCustomerById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateCustomerById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (merchant) => merchant.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCustomerById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = customersUpdateByIdSlice.actions;
export default customersUpdateByIdSlice.reducer;
