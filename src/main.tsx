import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import App from './App';

import { Home } from './components/Home';
import { JoinGame } from './components/JoinGame';

import './index.css';
import { Game } from './components/Game';
import { isAddress } from 'ethers';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.StrictMode>
        <App>{(account, provider) => <Home account={account} provider={provider} />}</App>
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
        return redirect('/') as Response;
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
