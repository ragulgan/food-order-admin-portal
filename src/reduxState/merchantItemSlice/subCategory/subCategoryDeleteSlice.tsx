import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface SubCategory {
  id: string;
}

interface SubCategoryState {
  data: SubCategory[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: SubCategoryState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteSubCategoryById = createAsyncThunk('subCategoryDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<SubCategory>(`/subCategory/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const subCategoryDeleteSlice = createSlice({
  name: 'subCategoryDelete',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteSubCategoryById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.status = 'pending';
    })
      .addCase(deleteSubCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (subcategory) => subcategory.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteSubCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = subCategoryDeleteSlice.actions;
export default subCategoryDeleteSlice.reducer;
