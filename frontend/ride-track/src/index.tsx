import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Auth0Provider
    domain="dev-2uer6jn7.us.auth0.com"
    clientId="AHsTOUfAHVTFnlwFLHGf7Y0kzeIHmLKF"
    redirectUri={process.env.REACT_APP_REDIRECT_URI}
    audience="https://ride-track-backend-gol2gz2rwq-uc.a.run.app"
    scope="read write offline_access"
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <App/>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();