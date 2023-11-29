import { BrowserProvider, isAddress } from 'ethers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Back, Button, TextInput, Title } from '../../../common-ui';

type JoinGameProps = {
  account: string;
  provider: BrowserProvider;
};

export const JoinGame = (_: JoinGameProps) => {
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
