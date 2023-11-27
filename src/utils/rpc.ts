import { Contract, JsonRpcProvider, WebSocketProvider } from 'ethers';

const jsonProvider = new JsonRpcProvider('http://localhost:8545/');
const wsProvider = new WebSocketProvider('ws://localhost:8546/');
// const jsonProvider = new WebSocketProvider('ws://13.38.37.229:8546/');

export const getReadContract = (contract: Contract): Contract => {
  return contract.connect(getJsonProvider()) as Contract;
};

export const getJsonProvider = () => {
  return jsonProvider;
};

export const getWsProvider = () => {
  return wsProvider;
};

export const onNextBlock = (fn: () => void | Promise<void>) => {
  const provider = getWsProvider();
  const execFn = () => {
    void fn();
    void provider.off('block', execFn);
  };
  void provider.on('block', execFn);
};
