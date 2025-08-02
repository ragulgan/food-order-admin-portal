import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface configrationUpdateByID {
  id: string;
}

interface ConfigrationUpdateState {
  loading: boolean;
  data: configrationUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface ConfigrationUpdateByIdPayload {
  id: string;
  name: string;
  status: string;
}


export const updateConfigrationById = createAsyncThunk<any, any>('configrationUpdate/configrationUpdateByID',
  async (payload: ConfigrationUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/configuration`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: ConfigrationUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const configrationUpdateByIdSlice = createSlice({
  name: 'configrationUpdate',
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
      .addCase(updateConfigrationById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateConfigrationById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (config) => config.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateConfigrationById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = configrationUpdateByIdSlice.actions;
export default configrationUpdateByIdSlice.reducer;