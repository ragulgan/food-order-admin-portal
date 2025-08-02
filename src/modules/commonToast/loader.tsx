import { Fragment } from "react";
import React from 'react';
import {
    Modal, CircularProgress, Box
} from '@mui/material';

const Loading: React.FC<any> = (isOpen) => {
    return (
        <Fragment>
            {/* <Modal style={{ display: 'flex', justifyContent: 'center', height: '90%', alignItems: 'center' }} open={isOpen}> */}
                <Box padding={0} height={'85vh'} width={'100%'} display='flex' justifyContent={'center'} alignItems={'center'}>
                    <Box>
                    <CircularProgress size={50} style={{ color: '#FC8945', marginLeft: '10px' }} />
                    <h3 style={{ color: '#333333' }}>Loading...</h3>
                    </Box>
                </Box>
            {/* </Modal> */}
        </Fragment>
    )
}
export default Loading;