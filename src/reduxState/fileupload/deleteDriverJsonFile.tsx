import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance';

interface JsonDriverFile {
  id: any;
}

interface JsonDriverFileState {
  data: JsonDriverFile[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: JsonDriverFileState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteDriverJsonFile = createAsyncThunk('jsonDriverfileDelete/delete', async (id: any, thunkAPI) => {
  const escriptMasterDataType = 'customers';
  return await Axios.delete<File>(`/S3/file/${id}?escriptMasterDataType=${escriptMasterDataType}`).catch(thunkAPI.rejectWithValue)
}
);

export const jsonDriverfileDeleteSlice = createSlice({
  name: 'jsonDriverfileDelete',
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
    builder.addCase(deleteDriverJsonFile.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteDriverJsonFile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (file) => file.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteDriverJsonFile.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearState } = jsonDriverfileDeleteSlice.actions;
export default jsonDriverfileDeleteSlice.reducer;
