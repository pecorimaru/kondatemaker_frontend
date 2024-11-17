import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './css/index.css';

import { KondateMaker } from './kondatemaker';
import { KondateMakerProvider } from './components/global/global';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="160003454125-03dkjca5khvs730fqfkmiguatdm8it58.apps.googleusercontent.com">
      <KondateMakerProvider>
        <KondateMaker />
      </KondateMakerProvider>
    </GoogleOAuthProvider>      
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
