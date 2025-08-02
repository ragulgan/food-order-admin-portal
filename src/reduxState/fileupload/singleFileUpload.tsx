import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../authorization/axiosFileInstance'

export interface MerchantAddState {
    data: any;
    loading: boolean;
    message: string;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: boolean;
}
const initialState: MerchantAddState = {
    data: {},
    loading: false,
    message: '',
    status: 'idle',
    error: false,

}
export const singleFileUpload = createAsyncThunk<any, any>('singleFile', async (payload: any, thunkAPI) => {
    return await Axios.post('/S3/singlefile', payload).catch(thunkAPI.rejectWithValue)
});
export const singleFileUploadSlice = createSlice({
    name: 'singleFile',
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
        builder.addCase(singleFileUpload.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = false;
        }).addCase(singleFileUpload.fulfilled, (state, action: any) => {
            state.loading = false;
            state.status = 'succeeded';
            state.data = action?.payload?.data?.data;
            state.message = action?.payload?.data?.message;
            state.error = false;
        }).addCase(singleFileUpload.rejected, (state, action: any) => {
            state.loading = false;
            state.status = 'failed';
            state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
            state.error = true;
        });
    }
});
export const { clearState } = singleFileUploadSlice.actions;
export default singleFileUploadSlice.reducer;