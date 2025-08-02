import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Variant {
  id: string;
}

interface VariantState {
  data: Variant[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: VariantState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteVariantById = createAsyncThunk('variantDelete/delete', async (id: string, thunkAPI) => {
  return await Axios.delete<Variant>(`/variant/${id}`).catch(thunkAPI.rejectWithValue)
}
);

export const variantDeleteSlice = createSlice({
  name: 'variantDelete',
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
    builder.addCase(deleteVariantById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteVariantById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (variant) => variant.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteVariantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = variantDeleteSlice.actions;
export default variantDeleteSlice.reducer;
