import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './redux/store.js';  // Ensure the correct store import
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persist } from './redux/store.js';  // Import the persistor from your store.js

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>  {/* Pass persistor here */}
      <App />
    </PersistGate>
  </Provider>
);
