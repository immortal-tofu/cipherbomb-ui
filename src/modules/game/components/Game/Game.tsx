import { BrowserProvider, Contract, getAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { abi } from '../../../../abi/cipherbomb.json';
import { getReadContract, getWsProvider, onNextBlock } from '../../../../utils/rpc';
import { Splash } from '../../../common-ui/components/Splash';
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
  const [players, setPlayers] = useState<{ name: string; address: string }[]>([]);
  const [endGame, setEndGame] = useState<'bad' | 'good' | 'bomb' | null>(null);

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

  const onPlayerNameChanged = useCallback(
    (player: string, name: string) => {
      const newPlayers = players.map((p) => {
        if (p.address === getAddress(player)) {
          return { ...p, name };
        }
        return p;
      });
      console.log(newPlayers);
      setPlayers(newPlayers);
    },
    [players],
  );

  const onPlayerJoined = useCallback(
    async (address: string) => {
      if (contract) {
        const name = await getReadContract(contract).name(address);
        const newPlayers = [...players, { address, name }];
        console.log(newPlayers);
        setPlayers(newPlayers);
      }
    },
    [players, contract],
  );

  const onPlayerLeave = useCallback(
    (player: string) => {
      const newPlayers = players.filter(({ address }) => address != player);

      console.log(newPlayers);
      setPlayers(newPlayers);
    },
    [players],
  );

  const refreshPlayers = useCallback(async () => {
    if (contract) {
      const playerWithNames: { name: string; address: string }[] = [];
      const nop: bigint = await getReadContract(contract).numberOfPlayers();
      for (let i = 0; i < nop; i += 1) {
        const address = getAddress(await getReadContract(contract).players(i));
        const name = await getReadContract(contract).name(address);
        playerWithNames.push({ name, address });
      }
      setPlayers(playerWithNames);
    }
  }, [contract]);

  const refreshInformations = useCallback(async () => {
    if (contract) {
      const isRunning = await getReadContract(contract).gameRunning();
      setGameIsRunning(isRunning);
    }
  }, [contract]);

  useEffect(() => {
    const gameHasStarted = () => {
      onNextBlock(() => setGameIsRunning(true));
    };
    const gameHasBeenOpen = () => {
      onNextBlock(refreshInformations);
    };

    const onGoodGuysWin = () => {
      setEndGame('good');
      onNextBlock(refreshInformations);
      onNextBlock(refreshPlayers);
    };

    const onBadGuysWin = (reason: string) => {
      setEndGame(reason === 'bomb' ? 'bomb' : 'bad');
      onNextBlock(refreshInformations);
      onNextBlock(refreshPlayers);
    };

    if (contract) {
      const wsProvider = getWsProvider();
      const gameContract = contract.connect(wsProvider);
      void gameContract.on(gameContract.filters.GameOpen, gameHasBeenOpen);
      void gameContract.on(gameContract.filters.GameStart, gameHasStarted);
      void gameContract.on(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
      void gameContract.on(gameContract.filters.PlayerJoined, onPlayerJoined);
      void gameContract.on(gameContract.filters.PlayerKicked, onPlayerLeave);
      void gameContract.on(gameContract.filters.GoodGuysWin, onGoodGuysWin);
      void gameContract.on(gameContract.filters.BadGuysWin, onBadGuysWin);
      return () => {
        void gameContract.off(gameContract.filters.GameOpen, gameHasBeenOpen);
        void gameContract.off(gameContract.filters.GameStart, gameHasStarted);
        void gameContract.off(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
        void gameContract.off(gameContract.filters.PlayerJoined, onPlayerJoined);
        void gameContract.off(gameContract.filters.PlayerKicked, onPlayerLeave);
        void gameContract.off(gameContract.filters.GoodGuysWin, onGoodGuysWin);
        void gameContract.off(gameContract.filters.BadGuysWin, onBadGuysWin);
      };
    }
  }, [contract, onPlayerNameChanged, onPlayerJoined, onPlayerLeave]);

  useEffect(() => {
    void refreshInformations();
    void refreshPlayers();
  }, [refreshInformations, refreshPlayers]);

  if (!contract) {
    return <div></div>;
  }

  return (
    <div>
      {contract && gameIsRunning && <Table contract={contract} account={account} players={players} />}
      {contract && !gameIsRunning && <WaitingRoom contract={contract} account={account} players={players} />}
      {endGame && <Splash type={endGame} onClose={() => setEndGame(null)} />}
    </div>
  );
};