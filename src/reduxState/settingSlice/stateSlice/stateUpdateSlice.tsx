import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface StateUpdateByID {
  id: string;
  countryId: string;
  stateName: string;
  status: string;
}

interface StateUpdateState {
  loading: boolean;
  data: StateUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface StateUpdateByIdPayload {
  id: string;
  countryId: string;
  stateName: string;
  status: string;
}


export const updateStateById = createAsyncThunk<any, any>('stateUpdate/stateUpdateByID',
  async (payload: StateUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/state/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: StateUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const stateUpdateByIdSlice = createSlice({
  name: 'stateUpdate',
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
      .addCase(updateStateById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateStateById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (state) => state.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateStateById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = stateUpdateByIdSlice.actions;
export default stateUpdateByIdSlice.reducer;