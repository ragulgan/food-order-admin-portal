import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosJsonFileInstance'

export interface SingleMobileJsonFileState {
    data: any;
    loading: boolean;
    message: string;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: boolean;
}
const initialState: SingleMobileJsonFileState = {
    data: {},
    loading: false,
    message: '',
    status: 'idle',
    error: false,

}
export const singleMobileJsonFileUpload = createAsyncThunk<any, any>('singleMobileJsonFile', async (payload: any, thunkAPI) => {
    return await Axios.post('/S3/singlefile', payload).catch(thunkAPI.rejectWithValue)
});
export const singleMobileJsonFileUploadSlice = createSlice({
    name: 'singleMobileJsonFile',
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
        builder.addCase(singleMobileJsonFileUpload.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = false;
        }).addCase(singleMobileJsonFileUpload.fulfilled, (state, action: any) => {
            state.loading = false;
            state.status = 'succeeded';
            state.data = action?.payload?.data?.data;
            state.message = action?.payload?.data?.message;
            state.error = false;
        }).addCase(singleMobileJsonFileUpload.rejected, (state, action: any) => {
            state.loading = false;
            state.status = 'failed';
            state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
            state.error = true;
        });
    }
});
export const { clearState } = singleMobileJsonFileUploadSlice.actions;
export default singleMobileJsonFileUploadSlice.reducer;