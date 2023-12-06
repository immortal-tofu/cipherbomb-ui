import { Contract, JsonRpcProvider, WebSocketProvider } from 'ethers';

// const JSONRPC_URL = 'http://localhost:8545/';
// const WEBSOCKET_URL = 'ws://localhost:8546';
const JSONRPC_URL = 'https://devnet.zama.ai/';
const WEBSOCKET_URL = 'wss://devnet.ws.zama.ai/';

const jsonProvider = new JsonRpcProvider(JSONRPC_URL);
const wsProvider = new WebSocketProvider(WEBSOCKET_URL);

const getJsonProvider = () => {
  return jsonProvider;
};

const getWsProvider = () => {
  return wsProvider;
};

export const getReadContract = (contract: Contract): Contract => {
  return contract.connect(getJsonProvider()) as Contract;
};

export const getEventContract = (contract: Contract): Contract => {
  return contract.connect(getWsProvider()) as Contract;
};

export const onNextBlock = (fn: () => void | Promise<void>) => {
  // const provider = getWsProvider();
  // const execFn = () => {
  //   void fn();
  //   void provider.off('block', execFn);
  // };
  // void provider.on('block', execFn);
  void fn();
};
