import { ReactNode, useEffect, useState } from 'react';
import { init } from './fhevmjs';
import './App.css';
import { Connect } from './components/Connect';
import { BrowserProvider } from 'ethers';
import { Layout } from './components/Layout';

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
