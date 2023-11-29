import { isAddress } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter, redirect } from 'react-router-dom';

import App from './App';
import { Game, JoinGame } from './modules/game';
import { Home, Rules } from './modules/home';

import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <React.StrictMode>
        <App>{(account, provider) => <Home account={account} provider={provider} />}</App>
      </React.StrictMode>
    ),
  },
  {
    path: 'rules',
    element: (
      <React.StrictMode>
        <App>{(account, provider) => <Rules account={account} provider={provider} />}</App>
      </React.StrictMode>
    ),
  },
  {
    path: 'join',
    element: (
      <React.StrictMode>
        <App>{(account, provider) => <JoinGame account={account} provider={provider} />}</App>
      </React.StrictMode>
    ),
  },
  {
    path: 'game/:contractAddress',
    loader: ({ params }) => {
      if (!params.contractAddress || !isAddress(params.contractAddress)) {
        return redirect('/');
      }
      return null;
    },
    element: (
      <React.StrictMode>
        <App>{(account, provider) => <Game account={account} provider={provider} />}</App>
      </React.StrictMode>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
