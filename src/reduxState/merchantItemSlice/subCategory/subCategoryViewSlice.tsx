import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface SubCategoryViewByID {
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
    id: string,
    branchName: string;
  },
  description: string;
  images: any;
  status: string;
  createdDate: string;
}

interface SubCategoryViewState {
  loading: boolean;
  data: SubCategoryViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: SubCategoryViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchSubCategoryById = createAsyncThunk('subCategoryView/fetchData', async (id: string, thunkAPI) => {
  return await Axios.get<SubCategoryViewByID>(`/subCategory/${id}`).catch(thunkAPI.rejectWithValue)
});

export const subCategoryViewByIdSlice = createSlice({
  name: 'subCategoryView',
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
      .addCase(fetchSubCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = subCategoryViewByIdSlice.actions;
export default subCategoryViewByIdSlice.reducer;
