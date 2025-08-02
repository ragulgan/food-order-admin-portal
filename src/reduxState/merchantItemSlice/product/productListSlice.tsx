import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface ProductList {
  id: string;
  productName: string;
  merchantDetails: {
    id: string;
    merchantName: string;
  };
  categoryDetails: {
    id: string;
    categoryName: string;
  };
  branchDetails: {
    id: string;
    branchName: string;
  },
  shiftTime: [
    {
      id: string;
      name: string;
      fromTime: string;
      toTime: string;
    }
  ];
  price: string;
  description: string;
  images: any;
  status: string;
  createdDate: string;
}

interface ProductListState {
  data: ProductList[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
}

const initialState: ProductListState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
};

export const fetchProducts = createAsyncThunk<any, any>('productList/fetchData', async (params, thunkAPI) => {
  return await Axios.get(`/product`, { params: params }).catch(thunkAPI.rejectWithValue)
});

export const productSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchProducts.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.size = action?.payload?.data?.count;
      })
      .addCase(fetchProducts.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearState } = productSlice.actions;
export default productSlice.reducer;
