import { BrowserProvider } from 'ethers';
import { ReactNode, useEffect, useState } from 'react';

import { init } from './fhevmjs';
import { Connect, Layout } from './modules/common-ui';

import './App.css';

type AppProps = {
  children: (account: string, provider: BrowserProvider) => ReactNode;
};

const App = ({ children }: AppProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

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
