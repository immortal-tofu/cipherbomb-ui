import { BrowserProvider, getAddress } from 'ethers';
import { ExportedContractKeypairs, FhevmInstance, createInstance, initFhevm } from 'fhevmjs';

export const init = async () => {
  await initFhevm();
};

const instances: {
  [keyof: string]: FhevmInstance;
} = {};

export const createFhevmInstance = async (account: string) => {
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();
  const publicKey = await provider.call({
    to: '0x000000000000000000000000000000000000005d',
    data: '0xd9d47bb001',
  });

  const strKP = getStorage(account);
  const keypairs: ExportedContractKeypairs | undefined = strKP ? JSON.parse(strKP) : undefined;
  instances[account] = await createInstance({ chainId, publicKey, keypairs });
  console.log(publicKey);
};

const getStorageKey = (account: string) => {
  return `fhevmjs_${getAddress(account)}`;
};

const getStorage = (account: string) => {
  return window.localStorage.getItem(getStorageKey(account));
};

const saveStorage = (account: string) => {
  const keypairs = getInstance(account).serializeKeypairs();
  window.localStorage.setItem(getStorageKey(account), JSON.stringify(keypairs));
};

export const getTokenSignature = async (contractAddress: string, account: string) => {
  if (getInstance(account).hasKeypair(contractAddress)) {
    return getInstance(account).getTokenSignature(contractAddress)!;
  } else {
    const { publicKey, token } = getInstance(account).generateToken({ verifyingContract: contractAddress });
    const params = [account, JSON.stringify(token)];
    const signature: string = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });
    getInstance(account).setTokenSignature(contractAddress, signature);
    saveStorage(account);
    return { signature, publicKey };
  }
};

export const getInstance = (account: string) => {
  return instances[account];
};
