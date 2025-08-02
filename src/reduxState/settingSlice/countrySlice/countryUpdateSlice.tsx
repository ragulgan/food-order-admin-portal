import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CountryUpdateByID {
  id: string;
  countryName: string;
  status: string;
}

interface CountryUpdateState {
  loading: boolean;
  data: CountryUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface CountryUpdateByIdPayload {
  id: string;
  countryName: string;
  status: string;
}


export const updateCountryById = createAsyncThunk<any, any>('countryUpdate/countryUpdateByID',
  async (payload: CountryUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/country/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CountryUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const countryUpdateByIdSlice = createSlice({
  name: 'countryUpdate',
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
      .addCase(updateCountryById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateCountryById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (country) => country.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCountryById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = countryUpdateByIdSlice.actions;
export default countryUpdateByIdSlice.reducer;