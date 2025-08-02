import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Language {
  id: string,
}

interface LanguageState {
  loading: boolean;
  data: Language[];
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: any;
}

export const updateLanguageById = createAsyncThunk<any, any>('languageUpdate/updateLanguageById', async (payload: Language, thunkAPI) => {
  return await Axios.put(`/textConfig/${payload.id}`, payload).catch(thunkAPI.rejectWithValue)
}
);

const initialState: LanguageState = {
  loading: false,
  data: [],
  message: '',
  error: false,
  status: 'idle',
  code: ''
};

export const languageUpdateByIdSlice = createSlice({
  name: 'languageUpdate',
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
      .addCase(updateLanguageById.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = false;
      })
      .addCase(updateLanguageById.fulfilled, (state, action: any) => {
        state.loading = false;
        const index = state.data.findIndex(
          (language) => language.id === action.payload.id
        );
        state.data[index] = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.status = 'succeeded';
        state.error = false;
        state.code = action?.payload?.data?.code;
      })
      .addCase(updateLanguageById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearUpdateState } = languageUpdateByIdSlice.actions;
export default languageUpdateByIdSlice.reducer;
