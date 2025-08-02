import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface RoleViewByID {
  id: string;
  menus: any;
  role: string;
  status: string;
  type: string;
  createdDate: string;
  name: string;
}

interface RoleViewState {
  loading: boolean;
  data: RoleViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: RoleViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchRoleById = createAsyncThunk('roleView/fetchRoleById', async (id: string, thunkAPI) => {
  return await Axios.get<RoleViewByID>(`/role/${id}`).catch(thunkAPI.rejectWithValue)
});

export const roleViewByIdSlice = createSlice({
  name: 'roleView',
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
      .addCase(fetchRoleById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchRoleById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchRoleById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = roleViewByIdSlice.actions;
export default roleViewByIdSlice.reducer;
