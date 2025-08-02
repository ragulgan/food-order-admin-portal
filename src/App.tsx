import React from 'react'
import AppRoutes from "./AppRoutes";
import { store } from './reduxState/store'
import { Provider } from 'react-redux';
import { red, deepOrange, lightBlue, green, orange, amber, grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme({
  palette: {
    primary: {
      light: orange[600],
      main: orange[700],
      dark: orange[800],
      contrastText: orange[50]
    },
    secondary: {
      light: amber[700],
      main: amber[800],
      dark: amber[900],
      contrastText: amber[50]
    },
    error: {
      light: red[700],
      main: red[800],
      dark: red[900],
      contrastText: red[50]
    },
    warning: {
      light: deepOrange[200],
      main: deepOrange[700],
      dark: deepOrange[800],
      contrastText: deepOrange[50]
    },
    info: {
      light: grey[700],
      main: grey[800],
      dark: grey[900],
      contrastText: grey[50]
    },
    success: {
      light: green[700],
      main: green[800],
      dark: green[900],
      contrastText: green[50]
    }
  },
});

const App: React.FC<any> = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </LocalizationProvider>
    </ThemeProvider >
  );
}

export default App;
