import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface CustomerViewByID {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  image: any;
  emailId: string;
  status: string;
  createdDate: string;
}

interface CustomerState {
  loading: boolean;
  data: CustomerViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: CustomerState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchCustomerById = createAsyncThunk('customerView/fetchCustomerById', async (id: string, thunkAPI) => {
  return await Axios.get<CustomerViewByID>(`/customer/${id}`).catch(thunkAPI.rejectWithValue)
});

export const customerViewByIdSlice = createSlice({
  name: 'customerView',
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
      .addCase(fetchCustomerById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCustomerById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = customerViewByIdSlice.actions;
export default customerViewByIdSlice.reducer;
