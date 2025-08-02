import React, { Fragment } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, Grid, Modal, TextField, Typography, CircularProgress,
  Autocomplete
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../reduxState/store';
import { updateOrderById, clearUpdateState } from '../../../reduxState/orderSlice/orderUpdateSlice';
import { fetchOrderById, clearViewState } from '../../../reduxState/orderSlice/orderViewSlice';
import AppSnackbar from '../../commonToast/customizeAlert'

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: any;
}

const OrderEdit: React.FC<any> = ({ isOpen, onClose, orderId }: ConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const orderUpdateState = useSelector((state: RootState) => state.orderUpdate);
  const readTaskState = useSelector((state: RootState) => state.orderView)
  const [editShow, seteditShow] = React.useState<boolean>(false)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);

  const OrderStatus: any = [
    { value: 'OrderPlaced', name: 'Placed' },
    { value: 'OrderConfirmed', name: 'Confirmed' },
    // { value: 'OrderIsPreparing', name: 'Preparing' },
    // { value: 'OrderReady', name: 'Ready To Pickup' },
    // { value: 'OrderOutForDelivery', name: 'Out For Delivery' },
    // { value: 'OrderReceived', name: 'Received' }
  ];

  React.useEffect(() => {
    if (orderUpdateState && orderUpdateState?.error === true) {
      setIsErrorSnackbarOpen(true);
      setTimeout(()=>{
        dispatch(clearUpdateState());
      },2000)
    }
  }, [orderUpdateState]);

  const validationSchema = yup.object().shape({
    orderStatus: yup.object().required(''),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      orderStatus: '',
    },
  });

  const onSubmit: SubmitHandler<any> = (event: any) => {
    const payload: any = {
      orderStatus: event.orderStatus.value,
    }
    if (orderId) {
      payload.id = orderId;
      dispatch(updateOrderById(payload));
    }
  };

  React.useEffect(() => {
    if (orderUpdateState && orderUpdateState?.code === 200) {
      reset({
        orderStatus: '',
      });
      dispatch(clearViewState())
      onClose();
    }
  }, [orderUpdateState])

  React.useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [orderId]);

  React.useEffect(() => {
    if (readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id) {
      seteditShow(true)
      const Status = OrderStatus.find((item: any) => item.value === readTaskState?.data?.orderSts);
      reset({
        orderStatus: Status,
      })
    }
  }, [readTaskState])

  const handleOnCloseModal = () => {
    reset({
      orderStatus: '',
    });
    dispatch(clearViewState())
    onClose();
  }

  React.useEffect(() => {
    return () => {
      dispatch(clearViewState())
  }
  },[])

  const handleSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '391px', height: '272px', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '18px' }}>
          <Grid style={{ margin: "0", width: "100%" }} container spacing={2}>
            <Grid item xs={12} sm={12} md={12} style={{ padding: "0" }}>
              <Typography className='view-details-header' variant="h5" align="center" mb={2}>Update Order Status</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} my={2}>
                    <Controller
                      name="orderStatus"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'order status required' }}
                      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <Autocomplete
                          sx={{ marginTop: '8px' }}
                          disablePortal
                          fullWidth
                          id="orderStatus"
                          className='merchant-border-radius required-asterisk-auto-color'
                          value={value || null}
                          options={OrderStatus}
                          getOptionLabel={(option: any) => option.name || ''}
                          onChange={(_, data: any) => { onChange(data) }}
                          renderInput={(params) => (<TextField inputRef={ref} {...params} inputProps={{
                            ...params.inputProps,
                            autoComplete: 'off',
                          }} error={!!error}  label="Order Status" InputLabelProps={{ required: true }} />)}
                          clearOnBlur={value ? true : false}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <Button className='styledButtonCancel' variant="outlined" color="secondary" onClick={handleOnCloseModal}>Cancel</Button>
                      <Button className='styledButtonSave' variant="contained" type="submit" disabled={orderUpdateState && orderUpdateState?.loading} onClick={() => handleSubmit(onSubmit)}>
                        {
                          orderUpdateState && orderUpdateState?.loading === true ? <CircularProgress size={18} style={{ color: '#FFFFFF', marginLeft: '2px' }} /> : 'Update'
                        }
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box >
      </Modal >
      {isErrorSnackbarOpen && (
        <AppSnackbar
          showAlert={isErrorSnackbarOpen}
          message={orderUpdateState?.message}
          type="error"
          onClose={handleSnackbarClose}
        />
      )}
    </Fragment >
  )
}

export default OrderEdit;