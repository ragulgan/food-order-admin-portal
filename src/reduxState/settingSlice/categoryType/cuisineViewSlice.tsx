import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CuisineViewByID {
  id: string;
  status: string;
  name: string;
}

interface CuisineViewState {
  loading: boolean;
  data: CuisineViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: CuisineViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchCuisineById = createAsyncThunk('cuisineView/fetchCuisineById', async (id: string, thunkAPI) => {
  return await Axios.get<CuisineViewByID>(`/categoryType/${id}`).catch(thunkAPI.rejectWithValue)
});

export const cuisineViewByIdSlice = createSlice({
  name: 'cuisineView',
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
      .addCase(fetchCuisineById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchCuisineById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCuisineById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = cuisineViewByIdSlice.actions;
export default cuisineViewByIdSlice.reducer;
