import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosFileInstance';

interface File {
  id: any;
}

interface FileState {
  data: File[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: FileState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
};

export const deleteFile = createAsyncThunk('fileDelete/delete', async (id: any, thunkAPI) => {
  const escriptMasterDataType = 'merchants';
  return await Axios.delete<File>(`/S3/file/${id}?escriptMasterDataType=${escriptMasterDataType}`).catch(thunkAPI.rejectWithValue)
}
);

export const fileDeleteSlice = createSlice({
  name: 'fileDelete',
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
    builder.addCase(deleteFile.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteFile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (file) => file.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteFile.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearState } = fileDeleteSlice.actions;
export default fileDeleteSlice.reducer;
