import App from './App';
import ReactDOM from 'react-dom';
import 'src/mocks';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'nprogress/nprogress.css';
import { SidebarProvider } from './contexts/SidebarContext';

ReactDOM.render(
  <SidebarProvider>
    <App />
  </SidebarProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
