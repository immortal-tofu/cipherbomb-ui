import classNames from 'classnames';
import { Contract, getAddress } from 'ethers';
import { useState } from 'react';

import { getInstance, getTokenSignature } from '../../../../fhevmjs';
import { Button, DisplayName } from '../../../common-ui';
import { CardsDeck, CardsDeckProps } from '../CardsDeck';

import './TablePlayers.css';

export type TablePlayersProps = {
  dealIsNeeded: boolean;
  account: string;
  contract: Contract;
  players: { address: string; name: string }[];
  cards: number[];
  currentPlayer: string | null;
};

export const TablePlayers = ({ account, contract, players, cards, currentPlayer, dealIsNeeded }: TablePlayersProps) => {
  const [userCards, setUserCards] = useState<number[] | undefined>();
  const [displayCards, setDisplayCards] = useState(false);

  const instance = getInstance(account);

  const onRevealCards = async () => {
    if (!displayCards) {
      const contractAddress = await contract.getAddress();
      const token = await getTokenSignature(contractAddress, account);
      const encryptedCards: string[] = await contract.getMyCards(token.publicKey, token.signature);
      const userC = encryptedCards.map((c) => instance.decrypt(contractAddress, c));
      setUserCards(userC);
    }
    setDisplayCards(!displayCards);
  };

  const onPick = async (player: string) => {
    if (account === currentPlayer) {
      const tx = await contract.takeCard(player);
      await tx.wait();
    }
  };

  return (
    <div className="TablePlayers">
      {players.map(({ address, name }, i) => {
        const cardsDeckProps: Pick<CardsDeckProps, 'cards' | 'displayed' | 'hideCards'> = {};
        if (account === getAddress(address)) {
          cardsDeckProps.cards = userCards;
          cardsDeckProps.displayed = displayCards;
          cardsDeckProps.hideCards = () => setDisplayCards(false);
        }
        return (
          <div
            key={address}
            className={classNames('TablePlayers__player', { 'TablePlayers__player--next': currentPlayer === address })}
          >
            <div className="TablePlayers__name">
              <DisplayName address={address} name={name} />
            </div>
            {currentPlayer === address && <div className="TablePlayers__nextPlayer">Next player</div>}
            {!dealIsNeeded && <CardsDeck size={cards[i]} {...cardsDeckProps} />}
            <div className="TablePlayers__actions">
              {!dealIsNeeded && account === address && (
                <Button onClick={onRevealCards}>{displayCards ? 'Hide my cards' : 'Reveal my cards'}</Button>
              )}
              {!dealIsNeeded && account !== address && account === currentPlayer && (
                <Button onClick={() => onPick(address)}>Pick a card</Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
