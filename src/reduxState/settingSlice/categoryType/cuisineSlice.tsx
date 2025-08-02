import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Cuisine {
  id: string;
  status: string;
  name: string;
}

interface CuisineState {
  data: Cuisine[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: CuisineState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchCuisine = createAsyncThunk<any, any>('cuisineList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/categoryType`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const cuisineSlice = createSlice({
  name: 'cuisineList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuisine.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(fetchCuisine.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.size = action?.payload?.data?.count;
        state.error = false;
      })
      .addCase(fetchCuisine.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = cuisineSlice.actions;
export default cuisineSlice.reducer;
