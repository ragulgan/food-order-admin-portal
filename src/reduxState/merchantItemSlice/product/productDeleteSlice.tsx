import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../authorization/axiosInstance';

interface Product {
    id: string;
}

interface ProductState {
    data: Product[];
    loading: boolean;
    message: string;
    error: boolean;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: ProductState = {
    data: [],
    loading: false,
    message: '',
    error: false,
    status: 'idle',
};

export const deleteProductById = createAsyncThunk('productDelete/delete', async (id: string, thunkAPI) => {
    return await Axios.delete<Product>(`/product/${id}`).catch(thunkAPI.rejectWithValue)
}
);


export const productDeleteSlice = createSlice({
    name: 'productDelete',
    initialState,
    reducers: {
        clearState: (state) => {
            state.data = [];
            state.loading = false;
            state.message = '';
            state.error = false;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteProductById.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = false;
        })
            .addCase(deleteProductById.fulfilled, (state, action: any) => {
                state.loading = false;
                state.status = 'succeeded';
                state.data = state.data.filter(
                    (subcategory) => subcategory.id !== action.payload.id
                );
                state.message = action?.payload?.data?.message;
                state.error = false;
            })
            .addCase(deleteProductById.rejected, (state, action: any) => {
                state.loading = false;
                state.status = 'failed';
                state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
                state.error = true;
            });
    },
});

export const { clearState } = productDeleteSlice.actions;
export default productDeleteSlice.reducer;