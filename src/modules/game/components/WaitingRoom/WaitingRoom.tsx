import copy from 'copy-to-clipboard';
import { Contract, getAddress } from 'ethers';
import { useEffect, useState } from 'react';

import { Back, Button, Loader, Subtitle, Title } from '../../../common-ui';
import { ListPlayers } from '../ListPlayers';
import { PlayerName } from '../PlayerName';

import './WaitingRoom.css';

type WaitingRoomProps = {
  account: string;
  contract: Contract;
  players: { address: string; name: string }[];
  currentName?: string;
};

export const WaitingRoom = ({ contract, account, players, currentName = '' }: WaitingRoomProps) => {
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);

  const copyLink = () => {
    copy(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setInGame(players.some((player) => player.address === account));
  }, [players, account]);

  useEffect(() => {
    const refreshInformations = async () => {
      const owner: string = await contract.owner();
      setIsOwner(getAddress(owner) === account);

      setMinPlayers(await contract.MIN_PLAYERS());
      setMaxPlayers(await contract.MAX_PLAYERS());
    };
    void refreshInformations();
  }, [contract]);

  const startGame = async () => {
    const startTx = await contract.start();
    setGameLoading(true);
    await startTx.wait();
    setGameLoading(false);
  };

  const joinGame = async () => {
    const startTx = await contract.start();
    setGameLoading(true);
    await startTx.wait();
    setGameLoading(false);
  };

  if (!contract) return null;

  return (
    <div>
      <Back />
      <Title>Waiting room</Title>
      {inGame && <PlayerName contract={contract} currentName={currentName} />}
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
      {!inGame && (
        <div className="WaitingRoom__actions">
          <Button onClick={joinGame} disabled={players.length >= maxPlayers || gameLoading}>
            Join
          </Button>
          {gameLoading && <Loader />}
        </div>
      )}
    </div>
  );
};
