import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import {App} from './components/App';
import { ThemeProvider } from './ThemeProvider';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ThemeProvider>
);