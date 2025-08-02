import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface StateViewByID {
  id: string;
  stateName: string;
  country: any;
  status: string;
}

interface StateViewState {
  loading: boolean;
  data: StateViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: StateViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchStateById = createAsyncThunk('stateView/fetchStateById', async (id: string, thunkAPI) => {
  return await Axios.get<StateViewByID>(`/state/${id}`).catch(thunkAPI.rejectWithValue)
});

export const stateViewByIdSlice = createSlice({
  name: 'stateView',
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
      .addCase(fetchStateById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchStateById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchStateById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = stateViewByIdSlice.actions;
export default stateViewByIdSlice.reducer;
