import { useState } from 'react';
import { isAddress } from 'ethers';

import { redirect, useNavigate } from 'react-router-dom';
import { BrowserProvider } from 'ethers';

import { Button } from '../Button';
import { Title } from '../Title';
import { TextInput } from '../TextInput';
import { Back } from '../Back';

type JoinGameProps = {
  account: string;
  provider: BrowserProvider;
};

export const JoinGame = (props: JoinGameProps) => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState<string>('');
  const onClick = () => {
    if (isAddress(contractAddress)) {
      navigate(`/game/${contractAddress}`);
    }
  };
  return (
    <div>
      <Back />
      <Title>Join a room</Title>
      <div>
        <label htmlFor="contractAddress">Contract address:</label>{' '}
        <TextInput
          value={contractAddress}
          name="contractAddress"
          id="contractAddress"
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <Button onClick={onClick}>Join</Button>
      </div>
    </div>
  );
};
