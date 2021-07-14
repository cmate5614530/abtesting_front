import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes, { renderRoutes } from './router';
import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import ScrollToTop from './utils/ScrollToTop';

import { AuthProvider } from './contexts/JWTAuthContext';

import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@material-ui/core';

function App() {
  const history = createBrowserHistory();

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Router history={history}>
            <ScrollToTop />
            <CssBaseline />
            <AuthProvider>{renderRoutes(routes)}</AuthProvider>
          </Router>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
