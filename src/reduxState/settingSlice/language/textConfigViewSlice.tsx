import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface LanguageViewByID {
  id: string;
  langauage: any;
  langauage_code: any
  currency: any;
  mobile_config: any;
  web_config: any;
  driver_config: any;
  status: any;
}

interface LanguageViewState {
  loading: boolean;
  data: LanguageViewByID | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

const initialState: LanguageViewState = {
  loading: false,
  data: null,
  error: null,
  status: 'idle',
  code: '',
};

export const fetchLanguageById = createAsyncThunk('languageView/fetchLanguageById', async (id: string, thunkAPI) => {
  return await Axios.get<LanguageViewByID>(`/textConfig/${id}`).catch(thunkAPI.rejectWithValue)
});

export const languageViewByIdSlice = createSlice({
  name: 'languageView',
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
      .addCase(fetchLanguageById.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(fetchLanguageById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action?.payload?.data?.data;
        state.code = action?.payload?.data?.code;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchLanguageById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action?.payload?.response?.data?.message|| 'Something went wrong.';
      });
  },
});


export const { clearViewState } = languageViewByIdSlice.actions;
export default languageViewByIdSlice.reducer;
