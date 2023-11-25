import { BrowserProvider, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { abi } from '../../../../abi/cipherbomb.json';
import { getJsonRpc } from '../../../../utils/rpc';
import { Table } from '../Table';
import { WaitingRoom } from '../WaitingRoom';

import './Game.css';

type GameProps = {
  account: string;
  provider: BrowserProvider;
};

export const Game = ({ account, provider }: GameProps) => {
  const [contract, setContract] = useState<Contract | null>();
  const [gameIsRunning, setGameIsRunning] = useState<boolean>(false);

  const { contractAddress } = useParams();

  useEffect(() => {
    const getContract = async (address: string) => {
      await provider.getSigner();
      const c = new Contract(address, abi, await provider.getSigner());
      setContract(c);
    };

    if (provider && account && contractAddress) {
      void getContract(contractAddress);
    }
  }, [provider, account, contractAddress]);

  useEffect(() => {
    const refreshInformations = async () => {
      const isRunning = await contract!.gameRunning();
      setGameIsRunning(isRunning);
    };

    const gameHasStarted = () => {
      setGameIsRunning(true);
    };
    const gameHasBeenOpen = () => {
      setGameIsRunning(false);
    };

    if (contract) {
      void refreshInformations();
      const jsonProvider = getJsonRpc();
      const gameContract = contract.connect(jsonProvider);
      void gameContract.on(gameContract.filters.GameOpen, gameHasBeenOpen);
      void gameContract.on(gameContract.filters.GameStart, gameHasStarted);
      return () => {
        void gameContract.off(gameContract.filters.GameOpen, gameHasBeenOpen);
        void gameContract.off(gameContract.filters.GameStart, gameHasStarted);
      };
    }
  }, [contract]);

  if (!contract) {
    return <div></div>;
  }

  return (
    <div>
      {contract && gameIsRunning && <Table contract={contract} account={account} />}
      {contract && !gameIsRunning && <WaitingRoom contract={contract} account={account} />}
    </div>
  );
};
