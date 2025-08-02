import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance';

interface JsonFile {
  id: any;
}

interface JsonFileState {
  data: JsonFile[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: JsonFileState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteJsonFile = createAsyncThunk('jsonfileDelete/delete', async (id: any, thunkAPI) => {
  const escriptMasterDataType = 'customers';
  return await Axios.delete<File>(`/S3/file/${id}?escriptMasterDataType=${escriptMasterDataType}`).catch(thunkAPI.rejectWithValue)
}
);

export const jsonfileDeleteSlice = createSlice({
  name: 'jsonfileDelete',
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
    builder.addCase(deleteJsonFile.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteJsonFile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (file) => file.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteJsonFile.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearState } = jsonfileDeleteSlice.actions;
export default jsonfileDeleteSlice.reducer;
