import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface CityUpdateByID {
  id: string;
  stateId: string;
  cityName: string;
  status: string;
}

interface CityUpdateState {
  loading: boolean;
  data: CityUpdateByID[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

interface CityUpdateByIdPayload {
  id: string;
  stateId: string;
  cityName: string;
  status: string;
}


export const updateCityById = createAsyncThunk<any, any>('cityUpdate/cityUpdateByID',
  async (payload: CityUpdateByIdPayload, thunkAPI) => {
    return await Axios.put(`/city/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

const initialState: CityUpdateState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const cityUpdateByIdSlice = createSlice({
  name: 'cityUpdate',
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
      .addCase(updateCityById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(updateCityById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (city) => city.id === action.payload.id
        );
        state.data[index] = action?.payload?.data?.data;
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = false;
      })
      .addCase(updateCityById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message|| 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = cityUpdateByIdSlice.actions;
export default cityUpdateByIdSlice.reducer;