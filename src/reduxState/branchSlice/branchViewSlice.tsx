import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosInstance';

interface BranchViewByID {
  id: string,
  merchantDetails:
  {
    id: string,
    merchantName: string,
  },
  branchName: string,
  branchType: string,
  contactNo: string,
  contactEmail: string,
  contactName: string,
  image: any,
  city: {
    id: string,
    cityName: string,
  },
  state: {
    id: string,
    stateName: string,
  },
  country: {
    id: string,
    countryName: string,
  },
  gst: string,
  branchLocation: string,
  branchAddress: string,
  categoryTypeDetails: [
    {
      id: string
      name: string,
    }
  ],
  categoryDetails: [
    {
      id: string
      categoryName: string,
    }
  ],
  branchIsOpen: [string],
  branchStatus: string,
  mrngFromTime: string,
  mrngToTime: string,
  evngFromTime: string,
  evngToTime: string,
  nightFromTime: string,
  nightToTime: string,
  isVeg: string,
  lat: any,
  longt: any,
  branchMinAmount: string,
  status: string,
  createdDate: string,
  roleModuleDetails: {
    id: string;
    type: string;
    role: string;
  };
  password: string;
  branchManager: string;
  branchTelephoneNumber: any;
  rating: any;
  review: any;
  description: any
}

interface BranchState {
  loading: boolean;
  data: BranchViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any
}

const initialState: BranchState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: ''
};

export const fetchBranchById = createAsyncThunk('branchView/fetchBranchById', async (id: string, thunkAPI) => {
  return await Axios.get<BranchViewByID>(`/branch/${id}`).catch(thunkAPI.rejectWithValue)
});

export const branchViewByIdSlice = createSlice({
  name: 'branchView',
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
      .addCase(fetchBranchById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.status = 'succeeded';
        state.error = null;
        state.code = action?.payload?.data?.code
      })
      .addCase(fetchBranchById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message || 'Something went wrong.';
      });
  },
});


export const { clearViewState } = branchViewByIdSlice.actions;
export default branchViewByIdSlice.reducer;
