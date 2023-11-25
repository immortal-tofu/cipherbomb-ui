import { JsonRpcProvider } from 'ethers';

export const getJsonRpc = () => {
  const jsonProvider = new JsonRpcProvider('http://localhost:8545');
  return jsonProvider;
};
