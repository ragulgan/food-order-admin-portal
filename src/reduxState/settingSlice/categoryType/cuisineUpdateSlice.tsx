import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CuisineUpdateByID {
  id: string;
  name: string;
  status: string;
}

interface CuisineUpdateState {
  loading: boolean;
  data: CuisineUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface CuisineUpdateByIdPayload {
  id: string;
  name: string;
  status: string;
}


export const updateCuisineById = createAsyncThunk<any, any>('cuisineUpdate/cuisineUpdateByID',
  async (payload: CuisineUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/categoryType/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CuisineUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const cuisineUpdateByIdSlice = createSlice({
  name: 'cuisineUpdate',
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
      .addCase(updateCuisineById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateCuisineById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (cuisine) => cuisine.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCuisineById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = cuisineUpdateByIdSlice.actions;
export default cuisineUpdateByIdSlice.reducer;