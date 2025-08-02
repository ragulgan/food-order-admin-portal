import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export interface IAppSnackbar {
  showAlert: boolean;
  message: string;
  type: any;
  duration?: number;
  onClose: () => void
}
const AppSnackbar: React.FC<IAppSnackbar> = ({ showAlert, message, type, duration = 1500, onClose }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    onClose();
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  React.useEffect(() => {
    setOpen(showAlert)
  }, [showAlert])
  return (
    <>
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
export default AppSnackbar;