import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import { KondateMaker } from './kondatemaker';
import reportWebVitals from './reportWebVitals';
import { KondateMakerProvider } from './components/global';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <KondateMakerProvider>
      <KondateMaker />
    </KondateMakerProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
