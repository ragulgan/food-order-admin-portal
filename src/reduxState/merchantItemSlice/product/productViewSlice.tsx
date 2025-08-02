import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface productViewByID {
  id: string;
  productName: string;
  merchantDetails: {
    id: string;
    merchantName: string;
  },
  categoryDetails: {
    id: string;
    categoryName: string;
  },
  branchDetails: {
    id: string;
    branchName: string;
  },
  variantDetails: [
    {
      id: string;
      variantName: string;
      price: string;
      description: string;
      status: string;
    }
  ];
  price: string,
  description: string,
  images: any,
  status: string,
  createdDate: string,
  categoryTypeDetails: {
    id: string;
    name: string;
  }
  shiftTime: [
    {
      id: string;
      name: string;
      fromTime: string;
      toTime: string;
    }
  ];
  isVeg: any;
}

interface viewDetailsState {
  loading: boolean;
  data: productViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: viewDetailsState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchProductViewDetailById = createAsyncThunk('productView/fetchData', async (id: string, thunkAPI) => {
  return await Axios.get<productViewByID>(`/product/${id}`).catch(thunkAPI.rejectWithValue)
});

export const productViewByIdSlice = createSlice({
  name: 'productView',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductViewDetailById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchProductViewDetailById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchProductViewDetailById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearState } = productViewByIdSlice.actions;
export default productViewByIdSlice.reducer;