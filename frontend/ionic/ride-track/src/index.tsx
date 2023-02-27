import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2uer6jn7.us.auth0.com"
      clientId="NNEnH1PYbXV0BXONtkQlg4hD30X9uo0r"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      authorizationParams={{
        redirect_uri:"com.benalexander.Ride-Track://dev-2uer6jn7.us.auth0.com/capacitor/com.benalexander.Ride-Track/callback"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
