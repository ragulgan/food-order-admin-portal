import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance'

export interface SingleDriverJsonFileState {
    data: any;
    loading: boolean;
    message: string;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: boolean;
}
const initialState: SingleDriverJsonFileState = {
    data: {},
    loading: false,
    message: '',
    status: 'idle',
    error: false,

}
export const singleDriverJsonFileUpload = createAsyncThunk<any, any>('singleDriverJsonFile', async (payload: any, thunkAPI) => {
    return await Axios.post('/S3/singlefile', payload).catch(thunkAPI.rejectWithValue)
});
export const singleDriverJsonFileUploadSlice = createSlice({
    name: 'singleDriverJsonFile',
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
        builder.addCase(singleDriverJsonFileUpload.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = false;
        }).addCase(singleDriverJsonFileUpload.fulfilled, (state, action: any) => {
            state.loading = false;
            state.status = 'succeeded';
            state.data = action?.payload?.data?.data;
            state.message = action?.payload?.data?.message;
            state.error = false;
        }).addCase(singleDriverJsonFileUpload.rejected, (state, action: any) => {
            state.loading = false;
            state.status = 'failed';
            state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
            state.error = true;
        });
    }
});
export const { clearState } = singleDriverJsonFileUploadSlice.actions;
export default singleDriverJsonFileUploadSlice.reducer;