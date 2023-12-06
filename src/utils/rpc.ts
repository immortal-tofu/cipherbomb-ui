import { Contract, JsonRpcProvider, SocketBlockSubscriber, WebSocketProvider } from 'ethers';
import WebSocket from 'isomorphic-ws';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Testing WebSocket on connection / reconnection before initiating new provider to prevent deadlock
const testWS = async (url: string, reconnectDelay = 100): Promise<{ chainId: number; block: { number: number } }> => {
  const MAX_RETRY = 5;
  let retry = 0;
  let errorObject;

  while (retry < MAX_RETRY + 1) {
    try {
      return await new Promise((resolve, reject) => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
          socket.send(
            JSON.stringify([
              {
                jsonrpc: '2.0',
                method: 'eth_chainId',
                params: [],
                id: 1,
              },
              {
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: ['latest', false],
                id: 2,
              },
            ]),
          );
        };

        socket.onmessage = (event: any) => {
          const data = JSON.parse(event.data);

          resolve({
            chainId: Number(data[0]?.result),
            block: data[1]?.result,
          });
        };

        socket.onerror = (e: Error) => {
          reject(e);
        };
      });
    } catch (e) {
      console.log(`Connection to ${url} failed, attempt: (${retry} of ${MAX_RETRY})`);
      await sleep(reconnectDelay);
      errorObject = e;
      retry++;
    }
  }

  throw errorObject;
};

const connectWS = async (url: string, reconnectDelay = 100) => {
  // Test websocket connection to prevent WebSocketProvider deadlock caused by await this._start();
  const { chainId, block } = await testWS(url, reconnectDelay);
  console.log(`WebSocket ${url} connected: Chain ${chainId} Block ${Number(block?.number)}`);

  const provider = new WebSocketProvider(url);
  const blockSub = new SocketBlockSubscriber(provider);

  (provider.websocket as any).onclose = () => {
    console.log(`Socket ${url} is closed, reconnecting in ${reconnectDelay} ms`);
    setTimeout(() => connectWS(url, reconnectDelay), reconnectDelay);
  };

  provider.websocket.onerror = (e: Error) => {
    console.error(`Socket ${url} encountered error, reconnecting it:\n${e.stack || e.message}`);
    blockSub.stop();
    void provider.destroy();
  };

  blockSub._handleMessage = (result) => {
    console.log((provider as any)._wrapBlock({ ...result, transactions: [] }));
  };
  blockSub.start();

  void provider.on('pending', (tx: string) => {
    console.log(`New pending tx: ${tx}`);
  });
  return provider;
};

// const JSONRPC_URL = 'http://localhost:8545/';
// const WEBSOCKET_URL = 'ws://localhost:8546';
const JSONRPC_URL = 'https://devnet.zama.ai/';
const WEBSOCKET_URL = 'wss://devnet.ws.zama.ai/';

const jsonProvider = new JsonRpcProvider(JSONRPC_URL);
const wsProvider = connectWS(WEBSOCKET_URL);

const getJsonProvider = () => {
  return jsonProvider;
};

const getWsProvider = async () => {
  return await wsProvider;
};

export const getReadContract = (contract: Contract): Contract => {
  return contract.connect(getJsonProvider()) as Contract;
};

export const getEventContract = async (contract: Contract): Promise<Contract> => {
  return contract.connect(await getWsProvider()) as Contract;
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
