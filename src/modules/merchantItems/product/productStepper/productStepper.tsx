import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { clearState as clearAddState, clearProductId as clearAddProdcutId } from '../../../../reduxState/merchantItemSlice/product/productAddSlice';
import { clearState as clearProductState, clearProductId as clearUpdateProductId } from '../../../../reduxState/merchantItemSlice/product/productUpdateSlice';
import { clearState as clearProductViewState } from '../../../../reduxState/merchantItemSlice/product/productViewSlice';
import { clearState as clearFileUpload } from '../../../../reduxState/fileupload/multipleFileUpload';
import { clearState as clearDeleteFile } from '../../../../reduxState/fileupload/deleteFile';

import { AppDispatch } from '../../../../reduxState/store';
import ProductAdd from './productAdd';
import ProductVariantAdd from './productVariantAdd';
import Preview from './previewDetails';

const steps = ['Product Details', 'Variant Details', 'Preview'];

const theme = createTheme();

const ProductStepper: React.FC<any> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const [addTimeEditProductId, setAddTimeEditProductId] = React.useState('')
    const [statusCheck, setStatusCheck] = React.useState<any>('')
    const { reset } = useForm<any>();

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleOnCloseMerchant = () => {
        if(location.state){
            reset({
                branchName: '',
                categoryName: '',
                subcategoryName: '',
                productName: '',
                description: '',
                images: [],
                status: '',
                categoryTypes: [],
                isVeg: false,
                variantId: []
            });
            dispatch(clearProductState())
            dispatch(clearUpdateProductId())
            dispatch(clearProductViewState())
            dispatch(clearFileUpload())
            dispatch(clearDeleteFile())
            setAddTimeEditProductId('')
            navigate('/merchant-items/product')
        }else {
            reset({
                branchName: '',
                categoryName: '',
                subcategoryName: '',
                productName: '',
                description: '',
                images: [],
                status: '',
                categoryTypes: [],
                isVeg: false,
                variantId: []
            });
            dispatch(clearAddState())
            dispatch(clearAddProdcutId())
            dispatch(clearFileUpload())
            dispatch(clearDeleteFile())
            setAddTimeEditProductId('')
            navigate('/merchant-items/product')
        }
    }

    const handleSubmit = () => {
        if(location.state){
            dispatch(clearProductState())
            dispatch(clearUpdateProductId())
            dispatch(clearProductViewState())
            dispatch(clearFileUpload())
            dispatch(clearDeleteFile())
            navigate('/merchant-items/product')
        }else {
            dispatch(clearAddState())
            dispatch(clearAddProdcutId())
            dispatch(clearFileUpload())
            dispatch(clearDeleteFile())
            setAddTimeEditProductId('')
            navigate('/merchant-items/product')
        }      
    }

    React.useEffect(() => {
        return () => {
            dispatch(clearProductViewState())
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: '18px', width: '100%' }}>
                <Grid item xs={12} sx={{ background: "#f9fbfc", borderRadius: "8px" }}>
                    <Stepper activeStep={activeStep} sx={{ p: 2 }}>
                        {steps.map((label) => (
                            <Step key={label} className='stepper-style'>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <React.Fragment>
                    <Box sx={{ mt: 5 }}>
                        {activeStep === 0 && <ProductAdd onClose={handleOnCloseMerchant} onProductComplete={handleNext} addTimeEditProductId={addTimeEditProductId} setStatusCheck={setStatusCheck} />}
                        {activeStep === 1 && <ProductVariantAdd onStepBack={handleBack} onVariantComplete={handleNext} setAddTimeEditProductId={setAddTimeEditProductId} statusCheck={statusCheck} />}
                        {activeStep === 2 && <Preview onStepBack={handleBack} onSave={handleSubmit} />}
                    </Box>
                </React.Fragment>
            </Box>
        </ThemeProvider>
    )
}

export default ProductStepper;