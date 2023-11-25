import copy from 'copy-to-clipboard';
import { Contract, getAddress } from 'ethers';
import { useEffect, useState } from 'react';

import { getJsonRpc } from '../../../../utils/rpc';
import { Back, Button, Loader, Subtitle, Title } from '../../../common-ui';
import { ListPlayers } from '../ListPlayers';
import { PlayerName } from '../PlayerName';

import './WaitingRoom.css';

type WaitingRoomProps = {
  account: string;
  contract: Contract;
};

export const WaitingRoom = ({ contract, account }: WaitingRoomProps) => {
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<{ name: string; address: string }[]>([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);

  const copyLink = () => {
    copy(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshPlayers = async () => {
    const cn = await contract.name(getAddress(account));
    setCurrentName(cn);

    const playerWithNames: { name: string; address: string }[] = [];
    const nop: bigint = await contract.numberOfPlayers();
    for (let i = 0; i < nop; i += 1) {
      const address = getAddress(await contract.players(i));
      const name = await contract.name(address);
      playerWithNames.push({ name, address });
    }
    setPlayers(playerWithNames);
  };

  const refreshInformations = async () => {
    const owner: string = await contract.owner();
    setIsOwner(getAddress(owner) === getAddress(account));

    setMinPlayers(await contract.MIN_PLAYERS());
    setMaxPlayers(await contract.MAX_PLAYERS());
  };

  useEffect(() => {
    if (contract) {
      const onPlayerJoined = async (address: string) => {
        const name = await contract.name(address);
        const newPlayers = [...players, { address, name }];
        setPlayers(newPlayers);
      };
      const onPlayerLeave = (player: string) => {
        const newPlayers = players.filter(({ address }) => address != player);
        setPlayers(newPlayers);
      };

      const onPlayerNameChanged = (player: string, name: string) => {
        if (getAddress(account) === player) {
          setCurrentName(name);
        }
        console.log(players);
        const newPlayers = players.map((p) => {
          if (p.address === getAddress(player)) {
            return { ...p, name };
          }
          return p;
        });
        setPlayers(newPlayers);
      };
      const jsonProvider = getJsonRpc();
      const gameContract = contract.connect(jsonProvider);
      void gameContract.on(gameContract.filters.PlayerJoined, onPlayerJoined);
      void gameContract.on(gameContract.filters.PlayerKicked, onPlayerLeave);
      void gameContract.on(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
      return () => {
        console.log('off');
        void gameContract.off(gameContract.filters.PlayerJoined, onPlayerJoined);
        void gameContract.off(gameContract.filters.PlayerKicked, onPlayerLeave);
        void gameContract.off(gameContract.filters.PlayerNameChanged, onPlayerNameChanged);
      };
    }
  }, [contract, players]);

  useEffect(() => {
    void refreshPlayers();
    void refreshInformations();
  }, [contract]);

  const startGame = async () => {
    const startTx = await contract.start();
    setGameLoading(true);
    await startTx.wait();
  };

  if (!contract) return null;

  return (
    <div>
      <Back />
      <Title>Waiting room</Title>
      {currentName != null && <PlayerName contract={contract} currentName={currentName} />}
      <Subtitle>Players ({players.length})</Subtitle>
      <ListPlayers players={players} />
      <div className="WaitingRoom__copy" onClick={copyLink}>
        📋 Copy invite link {copied && <span className="WaitingRoom__copied">Copied!</span>}
      </div>
      {isOwner && (
        <div className="WaitingRoom__actions">
          <Button onClick={startGame} disabled={players.length < minPlayers || gameLoading}>
            Start game{players.length < minPlayers && ' (not enough players)'}
          </Button>
          {gameLoading && <Loader />}
        </div>
      )}
    </div>
  );
};
