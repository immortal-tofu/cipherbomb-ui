import { BrowserProvider, getAddress } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { createFhevmInstance } from '../../../../fhevmjs';
import { Button } from '../Button';
import { Title } from '../Title';

import './Connect.css';

const AUTHORIZED_CHAIN_ID = ['0x1f49', '0x1f4a', '0x1f4b', '0x2328'];

export const Connect: React.FC<{
  children: (account: string, provider: BrowserProvider) => React.ReactNode;
}> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [validNetwork, setValidNetwork] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const provider = new BrowserProvider(window.ethereum);

  const refreshAccounts = (accounts: string[]) => {
    const acc = getAddress(accounts[0]) || '';
    setAccount(acc);
    setConnected(accounts.length > 0);
    return acc;
  };

  const hasValidNetwork = async (): Promise<boolean> => {
    const currentChainId: string = await window.ethereum.request({ method: 'eth_chainId' });
    return AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase());
  };

  const refreshNetwork = async (acc: string) => {
    if (await hasValidNetwork()) {
      setValidNetwork(true);
      await createFhevmInstance(acc);
    } else {
      setValidNetwork(false);
    }
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) {
      setError('No wallet has been found');
      return;
    }

    provider
      .send('eth_accounts', [])
      .then(async (accounts: string[]) => {
        const acc = refreshAccounts(accounts);
        await refreshNetwork(acc);
      })
      .catch(() => {
        // Do nothing
      });
    eth.on('accountsChanged', refreshAccounts);
    eth.on('chainChanged', refreshNetwork);
  }, []);

  const connect = async () => {
    const accounts: string[] = await provider.send('eth_requestAccounts', []);

    if (accounts.length > 0) {
      setAccount(getAddress(accounts[0]));
      setConnected(true);
      if (!(await hasValidNetwork())) {
        await switchNetwork();
      }
    }
  };

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ['https://devnet.zama.ai/'],
            chainName: 'Zama Devnet',
            nativeCurrency: {
              name: 'ZAMA',
              symbol: 'ZAMA',
              decimals: 18,
            },
            blockExplorerUrls: ['https://main.explorer.zama.ai'],
          },
        ],
      });
    }
    await refreshNetwork(account);
  }, []);

  const child = useMemo<React.ReactNode>(() => {
    if (!account || !provider) {
      return null;
    }

    if (!validNetwork) {
      return (
        <div>
          <Title>Cipher Bomb</Title>
          <p>You're not on the correct network</p>
          <p>
            <Button className="Connect__button" onClick={switchNetwork}>
              Switch to Zama Devnet
            </Button>
          </p>
        </div>
      );
    }

    return children(account, provider);
  }, [account, validNetwork, children, switchNetwork]);

  if (error) {
    return (
      <p>
        No wallet has been found. Install <a href="https://metamask.io/download/">Metamask</a> extension.
      </p>
    );
  }

  const connectInfos = (
    <div className="Connect__info">
      {!connected && (
        <div>
          <Title>Cipher Bomb</Title>
          <Button className="Connect__button" onClick={connect}>
            Connect your wallet
          </Button>
        </div>
      )}
      {/* {connected && <div className="Connect__account">Welcome {account}</div>} */}
    </div>
  );

  return (
    <>
      {connectInfos}
      <div className="Connect__child">{child}</div>
    </>
  );
};
