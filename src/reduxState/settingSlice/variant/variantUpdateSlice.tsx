import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface VariantUpdateByID {
  id: string;
  variantName: string;
  status: string;
}

interface VariantUpdateState {
  loading: boolean;
  data: VariantUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface VariantUpdateByIdPayload {
  id: string;
  variantName: string;
  status: string;
}


export const updateVariantById = createAsyncThunk<any, any>('variantUpdate/updateVariantById',
  async (payload: VariantUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/variant/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: VariantUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const variantUpdateByIdSlice = createSlice({
  name: 'variantUpdate',
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
      .addCase(updateVariantById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateVariantById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (variant) => variant.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateVariantById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = variantUpdateByIdSlice.actions;
export default variantUpdateByIdSlice.reducer;