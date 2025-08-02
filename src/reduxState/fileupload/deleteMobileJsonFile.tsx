import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance';

interface JsonMobileFile {
  id: any;
}

interface JsonMobileFileState {
  data: JsonMobileFile[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: JsonMobileFileState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteMobileJsonFile = createAsyncThunk('jsonMobilefileDelete/delete', async (id: any, thunkAPI) => {
  const escriptMasterDataType = 'customers';
  return await Axios.delete<File>(`/S3/file/${id}?escriptMasterDataType=${escriptMasterDataType}`).catch(thunkAPI.rejectWithValue)
}
);

export const jsonMobilefileDeleteSlice = createSlice({
  name: 'jsonMobilefileDelete',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteMobileJsonFile.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteMobileJsonFile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (file) => file.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteMobileJsonFile.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearState } = jsonMobilefileDeleteSlice.actions;
export default jsonMobilefileDeleteSlice.reducer;
