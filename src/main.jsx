import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppContextProvider from './Context/AppContext.jsx';
import WalletProvider from './walletProvide.jsx';
createRoot(document.getElementById('root')).render(

  <WalletProvider>
    <BrowserRouter>
      <AppContextProvider>
        <div><Toaster/></div>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </WalletProvider>
)
