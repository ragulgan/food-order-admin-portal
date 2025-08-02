import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CategoryViewByID {
  id: string;
  categoryName: string;
  images: any;
  status: string;
  createdDate: string;
}

interface CategoryViewState {
  loading: boolean;
  data: CategoryViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: CategoryViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchCategoryById = createAsyncThunk('categoryView/fetchCategoryById', async (id: string, thunkAPI) => {
  return await Axios.get<CategoryViewByID>(`/category/${id}`).catch(thunkAPI.rejectWithValue)
});

export const categoryViewByIdSlice = createSlice({
  name: 'categoryView',
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
      .addCase(fetchCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = categoryViewByIdSlice.actions;
export default categoryViewByIdSlice.reducer;
