import { BrowserProvider, Contract, getAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { abi } from '../../../../abi/cipherbomb.json';
import { getEventContract, getReadContract, onNextBlock } from '../../../../utils/rpc';
import { Splash } from '../../../common-ui/components/Splash';
import badGuysWin from '../../assets/badguyswin.mp3';
import begin from '../../assets/begin.mp3';
import goodGuysWin from '../../assets/goodguyswin.mp3';
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
  const [contractLoading, setContractLoading] = useState(false);

  const { contractAddress } = useParams();

  useEffect(() => {
    const getContract = async (address: string) => {
      await provider.getSigner();
      const c = new Contract(address, abi, await provider.getSigner());
      setContract(c);
      const isRunning = await getReadContract(c).gameRunning();
      setGameIsRunning(isRunning);
      setContractLoading(false);
    };

    if (!contractLoading && contractAddress) {
      setContractLoading(true);
      void getContract(contractAddress);
    }
  }, [contractAddress, provider]);

  useEffect(() => {
    const refreshPlayers = async () => {
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
    };

    const refreshInformations = async () => {
      if (!contract) return;
      const isRunning = await getReadContract(contract).gameRunning();
      setGameIsRunning(isRunning);
    };

    const gameHasStarted = () => {
      onNextBlock(() => {
        void new Audio(begin).play();
        setGameIsRunning(true);
      });
    };
    const gameHasBeenOpen = () => {
      onNextBlock(refreshInformations);
    };

    const onGoodGuysWin = () => {
      void new Audio(goodGuysWin).play();
      setEndGame('good');
      onNextBlock(refreshInformations);
      onNextBlock(refreshPlayers);
    };

    const onBadGuysWin = (reason: string) => {
      void new Audio(badGuysWin).play();
      setEndGame(reason === 'bomb' ? 'bomb' : 'bad');
      onNextBlock(refreshInformations);
      onNextBlock(refreshPlayers);
    };

    if (contract) {
      console.log('on');
      void refreshInformations();
      void refreshPlayers();
      void getEventContract(contract).then((gameContract) => {
        void gameContract.on(gameContract.filters.GameOpen, gameHasBeenOpen);
        void gameContract.on(gameContract.filters.GameStart, gameHasStarted);
        void gameContract.on(gameContract.filters.GoodGuysWin, onGoodGuysWin);
        void gameContract.on(gameContract.filters.BadGuysWin, onBadGuysWin);
      });
      return () => {
        console.log('off');
        void getEventContract(contract).then((gameContract) => {
          void gameContract.off(gameContract.filters.GameOpen, gameHasBeenOpen);
          void gameContract.off(gameContract.filters.GameStart, gameHasStarted);
          void gameContract.off(gameContract.filters.GoodGuysWin, onGoodGuysWin);
          void gameContract.off(gameContract.filters.BadGuysWin, onBadGuysWin);
        });
      };
    }
  }, [contract]);

  useEffect(() => {
    const onPlayerNameChanged = (player: string, name: string) => {
      const newPlayers = players.map((p) => {
        if (p.address === getAddress(player)) {
          return { ...p, name };
        }
        return p;
      });
      setPlayers(newPlayers);
    };

    const onPlayerJoined = async (address: string) => {
      if (contract) {
        const name = await getReadContract(contract).name(address);
        const newPlayers = [...players, { address, name }];
        console.log(newPlayers);
        setPlayers(newPlayers);
      }
    };

    const onPlayerLeave = (player: string) => {
      const newPlayers = players.filter(({ address }) => address != player);

      console.log(newPlayers);
      setPlayers(newPlayers);
    };

    if (contract && players.length) {
      console.log('on players');
      void getEventContract(contract).then((gameContract) => {
        void gameContract.on(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
        void gameContract.on(gameContract.filters.PlayerJoined, onPlayerJoined);
        void gameContract.on(gameContract.filters.PlayerKicked, onPlayerLeave);
      });
      return () => {
        console.log('off players');
        void getEventContract(contract).then((gameContract) => {
          void gameContract.off(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
          void gameContract.off(gameContract.filters.PlayerJoined, onPlayerJoined);
          void gameContract.off(gameContract.filters.PlayerKicked, onPlayerLeave);
        });
      };
    }
  }, [contract, players]);

  if (!contract || contractLoading) {
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
