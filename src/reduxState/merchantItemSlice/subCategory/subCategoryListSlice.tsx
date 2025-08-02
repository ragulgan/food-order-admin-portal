import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface SubCategoryList {
  id: string;
  subCategoryName: string;
  categoryDetails: {
    id: string,
    categoryName: string,
  },
  merchantDetails: {
    id: string;
    merchantName: string;
  },
  branchDetails: {
    id: string;
    branchName: string;
  },
  description: string;
  images: any;
  status: string;
  createdDate: string;
}

interface SubCategoryListState {
  data: SubCategoryList[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: SubCategoryListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchSubCategories = createAsyncThunk<any, any>('subCategoryList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/subCategory`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const subCategorySlice = createSlice({
  name: 'subCategoryList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchSubCategories.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchSubCategories.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = subCategorySlice.actions;
export default subCategorySlice.reducer;
