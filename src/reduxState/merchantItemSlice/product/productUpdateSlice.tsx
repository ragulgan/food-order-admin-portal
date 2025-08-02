import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface ProductUpdateByID {
  id: string;
  branchId: string;
  categoryId: string;
  productName: string;
  description: string;
  images: any;
  status: string;
  price: string;
  categoryTypes: any;
  shiftTime: any;
  isVeg: any;
  variantId: [
    {
      id: string;
      variantName: string;
      price: string;
      description: string;
      status: string;
    }
  ]
}

interface ProductUpdateState {
  loading: boolean;
  data: ProductUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  productUpdateId: string;
  code: any;
}

interface ProductUpdateByIdPayload {
  id: string;
  branchId: string;
  categoryId: string;
  productName: string;
  subcategoryId: string;
  description: string;
  images: any;
  status: string;
  price: string;
  categoryTypes: any;
  shiftTime: any;
  isVeg: any;
  variantId: [
    {
      date: string;
      description: string;
      id: string;
      images: any;
      price: string;
      status: string;
    }
  ]
}

const initialState: ProductUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  productUpdateId: '',
  code: '',
};

export const updateProductById = createAsyncThunk<any, any>('productUpdate/updateProductById',
  async (payload: ProductUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/product/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const ProductUpdateByIdSlice = createSlice({
  name: 'productUpdate',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    },
    clearProductId: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.productUpdateId = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.status = 'pending';
        state.error = false;
      })
      .addCase(updateProductById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (product) => product.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.productUpdateId = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateProductById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearState, clearProductId } = ProductUpdateByIdSlice.actions;
export default ProductUpdateByIdSlice.reducer;