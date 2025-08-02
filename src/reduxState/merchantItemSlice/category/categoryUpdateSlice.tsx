import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CategoryUpdateByID {
  id: string;
  categoryName: string;
  images: any;
  status: string;
}

interface CategoryUpdateState {
  loading: boolean;
  data: CategoryUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface CategoryUpdateByIdPayload {
  id: string;
  categoryName: string;
  images: any;
  status: string;
}


export const updateCategoryById = createAsyncThunk<any, any>('categoryUpdate/updateCategoryById',
  async (payload: CategoryUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/category/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CategoryUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const categoryUpdateByIdSlice = createSlice({
  name: 'categoryUpdate',
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
      .addCase(updateCategoryById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateCategoryById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (category) => category.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCategoryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = categoryUpdateByIdSlice.actions;
export default categoryUpdateByIdSlice.reducer;