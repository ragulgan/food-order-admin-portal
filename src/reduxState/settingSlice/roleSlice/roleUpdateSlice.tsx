import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface RoleUpdateByID {
  id: string;
  menus: any;
  role: string;
  status: string;
  type: string;
}

interface RoleUpdateState {
  loading: boolean;
  data: RoleUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface RoleUpdateByIdPayload {
  id: string;
  menus: any;
  role: string;
  status: string;
  type: string;
}


export const updateRoleById = createAsyncThunk<any, any>('roleUpdate/roleUpdateByID',
  async (payload: RoleUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/role/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: RoleUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const roleUpdateByIdSlice = createSlice({
  name: 'roleUpdate',
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
      .addCase(updateRoleById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateRoleById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (role) => role.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateRoleById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = roleUpdateByIdSlice.actions;
export default roleUpdateByIdSlice.reducer;