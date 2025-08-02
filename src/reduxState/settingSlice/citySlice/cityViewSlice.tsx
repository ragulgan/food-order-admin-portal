import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CityViewByID {
  id: string;
  cityName: string;
  state: any;
  country: any;
  status: string;
}

interface CityViewState {
  loading: boolean;
  data: CityViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: CityViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchCityById = createAsyncThunk('cityView/fetchCityById', async (id: string, thunkAPI) => {
  return await Axios.get<CityViewByID>(`/city/${id}`).catch(thunkAPI.rejectWithValue)
});

export const cityViewByIdSlice = createSlice({
  name: 'cityView',
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
      .addCase(fetchCityById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchCityById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCityById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = cityViewByIdSlice.actions;
export default cityViewByIdSlice.reducer;
