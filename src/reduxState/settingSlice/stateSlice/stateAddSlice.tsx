import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

export interface StateAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: StateAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}
export const addState = createAsyncThunk<any, any>('stateAdd', async (payload, thunkAPI) => {
  return await Axios.post('/state', payload).catch(thunkAPI.rejectWithValue)
});

export const stateAddSlice = createSlice({
  name: 'stateAdd',
  initialState,
  reducers: {
    clearAddState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addState.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    }).addCase(addState.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.message = action?.payload?.data?.message;
      state.error = false;
      state.code = action?.payload?.data?.code;
    }).addCase(addState.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddState } = stateAddSlice.actions;
export default stateAddSlice.reducer;
