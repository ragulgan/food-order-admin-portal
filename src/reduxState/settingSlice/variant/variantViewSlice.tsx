import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface VariantViewByID {
  id: string;
  variantName: string;
  status: string;
}

interface VariantViewState {
  loading: boolean;
  data: VariantViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: VariantViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchVariantById = createAsyncThunk('variantView/fetchVariantById', async (id: string, thunkAPI) => {
  return await Axios.get<VariantViewByID>(`/variant/${id}`).catch(thunkAPI.rejectWithValue)
});

export const variantViewByIdSlice = createSlice({
  name: 'variantView',
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
      .addCase(fetchVariantById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariantById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchVariantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = variantViewByIdSlice.actions;
export default variantViewByIdSlice.reducer;
