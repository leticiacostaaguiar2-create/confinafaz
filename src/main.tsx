import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with automatic update and offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] Nova versão disponível. Atualizando automaticamente...');
  },
  onOfflineReady() {
    console.log('[PWA] Vale Forte está pronto para operar totalmente offline!');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
