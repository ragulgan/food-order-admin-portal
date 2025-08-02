import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface OrderViewByID {
  id: any;
  orderId: any;
  customerDetails: {
    id: any,
    customerName: any,
    emailId: any,
    mobileNumber: any,
    profile: any,
  },
  driverDetails: {
    id: any,
    profile: any,
    driverName: any,
    phoneNumber: any,
    emailId: any,
    driverId: any
},
  items: [
    {
      product: {
        id: any,
        productName: any,
        images: any,
      },
      variant: {
        id: any,
        variantName: any,
      },
      prdQty: any,
      prdPrice: any,
      totPrice: any,
    },
  ],
  branchDetails: {
    id: any,
    branchName: any,
    branchAddress: any,
    branchLocation: any,
  },
  totItems: any;
  totAmt: any;
  dlvCharges: any;
  subTotalAmt: any;
  orderSts: any;
  paymentMode: any;
  paymentStatus: any;
  isCoupenApplied: any;
  coupenAmount: any;
  offerApplied: any;
  offerAmount: any;
  distanceBetweenBranchAndUser: any;
  dlvAddrs: {
    id: any,
    streetAddress: any,
    addressType: any,
    contactName: any,
    contactNo: any,
    area: any,
    landMark: any,
    zipCode: any,
  },
  status: any;
  createdDate: any;
  time: any
}

interface OrdersState {
  loading: boolean;
  data: OrderViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any
}

const initialState: OrdersState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchOrderById = createAsyncThunk('orderView/fetchOrderById', async (id: string, thunkAPI) => {
  return await Axios.get<OrderViewByID>(`/orders/${id}`).catch(thunkAPI.rejectWithValue)
});

export const ordersViewByIdSlice = createSlice({
  name: 'orderView',
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
      .addCase(fetchOrderById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = ordersViewByIdSlice.actions;
export default ordersViewByIdSlice.reducer;
