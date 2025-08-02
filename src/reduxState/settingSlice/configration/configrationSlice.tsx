import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Configration {
  id: string;
  status: string;
  title: string;
  description: string;
  productDetails: [
    {
      id: string;
      productName: string;
    }
  ];
}

interface ConfigrationState {
  data: Configration | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
  message: string;
}

const initialState: ConfigrationState = {
  data: null,
  loading: false,
  error: null,
  status: 'idle',
  code: '',
  message: '',
};

export const fetchConfigration = createAsyncThunk<any, any>('configrationList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/configuration`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const configrationSlice = createSlice({
  name: 'configrationList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigration.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchConfigration.fulfilled, (state, action: any) => {
        state.data = action.payload?.data?.data;
        state.loading = false;
        state.code = action?.payload?.data?.code;
        state.message = action?.payload?.data?.message;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchConfigration.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      })
  },
});

export const { clearState } = configrationSlice.actions;
export default configrationSlice.reducer;
