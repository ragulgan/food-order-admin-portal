import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface ResetPassword {
  token: string,
  confirmPassword: string,
  newPassword: string,
}

interface ResetState {
  loading: boolean;
  data: ResetPassword[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updatePasswordByToken = createAsyncThunk<any, { payload: ResetPassword, token: any }>(
  'passwordUpdate/updatePasswordByToken',
  async ({ payload, token }, thunkAPI) => {
    return await Axios.put(`/auth/reset-password?token=${token}`, payload).catch(thunkAPI.rejectWithValue);
  }
);

const initialState: ResetState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: ''
};

export const passwordUpdateByIdSlice = createSlice({
  name: 'passwordUpdate',
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
      .addCase(updatePasswordByToken.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updatePasswordByToken.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (updatepassword) => updatepassword.token === action.payload.token
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.status = 'succeeded';
        state.error = false;
        state.code = action?.payload?.data?.code;
      })
      .addCase(updatePasswordByToken.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = passwordUpdateByIdSlice.actions;
export default passwordUpdateByIdSlice.reducer;
