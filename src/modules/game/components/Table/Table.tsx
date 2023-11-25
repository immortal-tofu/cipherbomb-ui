import { Contract } from 'ethers';
import { useEffect, useState } from 'react';

import { DisplayName, Subtitle, Title } from '../../../common-ui';

type TableProps = {
  account: string;
  contract: Contract;
};

export const Table = ({ contract, account }: TableProps) => {
  const [dealIsNeeded, setDealIsNeeded] = useState(true);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [moveLeft, setMoveLeft] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<{ name: string; address: string } | null>(null);
  useEffect(() => {
    const refresh = async () => {
      const din: boolean = await contract.turnDealNeeded();
      setDealIsNeeded(din);

      const ct: bigint = await contract.turnIndex();
      setCurrentTurn(Number(ct));

      const nop = await contract.numberOfPlayers();
      const turnMove: bigint = await contract.turnMove();
      setMoveLeft(Number(nop - turnMove));

      const address: string = await contract.turnCurrentPlayer();
      const name: string = await contract.name(address);
      setCurrentPlayer({ address, name });
    };
    void refresh();
  }, [contract]);

  console.log(moveLeft);
  return (
    <div>
      <Title>Cipher Bomb</Title>
      <Subtitle>Next Player</Subtitle>
      <p>{currentPlayer && <DisplayName address={currentPlayer.address} name={currentPlayer.name} />}</p>
      <p>{moveLeft}</p>
      <p>{currentTurn}</p>
      <p>{dealIsNeeded}</p>
      {dealIsNeeded && <div>Wait for deal</div>}
    </div>
  );
};
