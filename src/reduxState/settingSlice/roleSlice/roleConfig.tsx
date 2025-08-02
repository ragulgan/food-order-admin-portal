import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface RoleConfig {
  menus: [
    {
      name: string,
      view: boolean,
      add: boolean,
      edit: boolean,
      delete: boolean,
      visible: boolean,
      export: boolean
    }
  ]
}

interface RoleState {
  data: RoleConfig[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
  code: any;
}

const initialState: RoleState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
  code: '',
};

export const fetchConfig = createAsyncThunk<any, any>('rolesconfig/fetchData', async (thunkAPI) => {
  return await Axios.get(`/config`).catch(thunkAPI.rejectWithValue)
});

export const configSlice = createSlice({
  name: 'rolesconfig',
  initialState,
  reducers: {
    clearListState: (state) => {
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
      .addCase(fetchConfig.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchConfig.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.menus;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchConfig.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = configSlice.actions;
export default configSlice.reducer;
