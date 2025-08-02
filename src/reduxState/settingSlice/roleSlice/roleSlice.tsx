import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Role {
  id: string,
  role: string,
  status: string,
  type: string;
  createdDate: string,
}

interface RoleState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: RoleState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchRoles = createAsyncThunk<any, any>('rolesList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/role`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const rolesSlice = createSlice({
  name: 'rolesList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchRoles.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchRoles.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = rolesSlice.actions;
export default rolesSlice.reducer;
