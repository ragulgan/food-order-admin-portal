import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface Customer {
  id: string;
}

interface CustomersState {
  data: Customer[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: CustomersState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteCustomerById = createAsyncThunk('customerDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Customer>(`/customer/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const customersDeleteSlice = createSlice({
  name: 'customerDelete',
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
    builder.addCase(deleteCustomerById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteCustomerById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (customer) => customer.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteCustomerById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = customersDeleteSlice.actions;
export default customersDeleteSlice.reducer;
