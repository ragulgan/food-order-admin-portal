import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface ShiftUpdateByID {
  id: string;
  name: string;
  status: string;
  fromTime: string;
  toTime: string;
}

interface ShiftUpdateState {
  loading: boolean;
  data: ShiftUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface ShiftUpdateByIdPayload {
  id: string;
  name: string;
  status: string;
  fromTime: string;
  toTime: string;
}


export const updateShiftById = createAsyncThunk<any, any>('shiftUpdate/shiftUpdateByID',
  async (payload: ShiftUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/shiftTime/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: ShiftUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const shiftUpdateByIdSlice = createSlice({
  name: 'shiftUpdate',
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
      .addCase(updateShiftById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateShiftById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (shift) => shift.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateShiftById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = shiftUpdateByIdSlice.actions;
export default shiftUpdateByIdSlice.reducer;