import { BrowserProvider } from 'ethers';
import { ReactNode, useEffect, useState } from 'react';

import { init } from './fhevmjs';
import { Connect, Layout } from './modules/common-ui';
import { pauseMusic, playMusic } from './utils/music';

import './App.css';

type AppProps = {
  music?: boolean;
  children: (account: string, provider: BrowserProvider) => ReactNode;
};

const App = ({ music = false, children }: AppProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (music) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [music]);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <Layout>
      <Connect>{children}</Connect>
    </Layout>
  );
};

export default App;
