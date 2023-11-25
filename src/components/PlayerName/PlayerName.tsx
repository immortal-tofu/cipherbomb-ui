import { useState } from 'react';
import { Contract } from 'ethers';

import { Button } from '../Button';
import { Loader } from '../Loader';
import { TextInput } from '../TextInput';

type PlayerNameProps = {
  currentName: string;
  contract: Contract;
};

export const PlayerName = ({ contract, currentName }: PlayerNameProps) => {
  const [playerNameLoading, setPlayerNameLoading] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>(currentName);

  const onClick = async () => {
    const tx = await contract.setName(playerName);
    setPlayerNameLoading(true);
    tx.wait();
    setPlayerNameLoading(false);
  };
  return (
    <div>
      <label htmlFor="playerName">Your name:</label>{' '}
      <TextInput value={playerName} name="playerName" id="playerName" onChange={(e) => setPlayerName(e.target.value)} />
      <Button onClick={onClick} disabled={playerNameLoading}>
        Update name
      </Button>
      {playerNameLoading && <Loader />}
    </div>
  );
};
