import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance'

export interface SingleJsonFileState {
    data: any;
    loading: boolean;
    message: string;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: boolean;
}
const initialState: SingleJsonFileState = {
    data: {},
    loading: false,
    message: '',
    status: 'idle',
    error: false,

}
export const singleJsonFileUpload = createAsyncThunk<any, any>('singleJsonFile', async (payload: any, thunkAPI) => {
    return await Axios.post('/S3/singlefile', payload).catch(thunkAPI.rejectWithValue)
});
export const singleJsonFileUploadSlice = createSlice({
    name: 'singleJsonFile',
    initialState,
    reducers: {
        clearState: (state) => {
            state.data = {};
            state.loading = false;
            state.message = '';
            state.status = 'idle';
            state.error = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(singleJsonFileUpload.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = false;
        }).addCase(singleJsonFileUpload.fulfilled, (state, action: any) => {
            state.loading = false;
            state.status = 'succeeded';
            state.data = action?.payload?.data?.data;
            state.message = action?.payload?.data?.message;
            state.error = false;
        }).addCase(singleJsonFileUpload.rejected, (state, action: any) => {
            state.loading = false;
            state.status = 'failed';
            state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
            state.error = true;
        });
    }
});
export const { clearState } = singleJsonFileUploadSlice.actions;
export default singleJsonFileUploadSlice.reducer;