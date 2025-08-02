import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface SubCategoryUpdateByID {
  id: string;
  categoryId: string;
  description: string;
  images: any;
  merchantId: string;
  subCategoryName: string;
  status: string;
}

interface SubCategoryUpdateState {
  loading: boolean;
  data: SubCategoryUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface SubCategoryUpdateByIdPayload {
  id: string;
  categoryId: string;
  description: string;
  images: any;
  merchantId: string;
  subCategoryName: string;
  status: string;
}


export const updateSubCategoryById = createAsyncThunk<any, any>('subcategoryUpdate/updateSubCategoryById',
  async (payload: SubCategoryUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/subCategory/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: SubCategoryUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const subCategoryUpdateByIdSlice = createSlice({
  name: 'subcategoryUpdate',
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
      .addCase(updateSubCategoryById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateSubCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (subcategory) => subcategory.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateSubCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = subCategoryUpdateByIdSlice.actions;
export default subCategoryUpdateByIdSlice.reducer;