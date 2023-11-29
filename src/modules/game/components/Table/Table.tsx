import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { getInstance, getTokenSignature } from '../../../../fhevmjs';
import { getEventContract, getReadContract, onNextBlock } from '../../../../utils/rpc';
import { Button, Loader, Subtitle, Title } from '../../../common-ui';
import card from '../../assets/card.mp3';
import { CardDisplay } from '../CardDisplay';
import { TablePlayers } from '../TablePlayers';

import './Table.css';

type TableProps = {
  account: string;
  contract: Contract;
  players: { address: string; name: string }[];
};

export const Table = ({ contract, account, players }: TableProps) => {
  const [dealInProgress, setDealInProgress] = useState(false);
  const [dealIsNeeded, setDealIsNeeded] = useState(true);
  const [role, setRole] = useState<number | null>(null);
  const [cards, setCards] = useState<number[]>(players.map(() => 0));
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [moveLeft, setMoveLeft] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);

  const [remainingWires, setRemainingWires] = useState<number | null>(null);

  const [cardPicked, setCardPicked] = useState(2);
  const [cardOpen, setCardOpen] = useState(false);

  const refresh = useCallback(async () => {
    const din: boolean = await getReadContract(contract).turnDealNeeded();
    setDealIsNeeded(din);

    const rw: bigint = await getReadContract(contract).remainingWires();
    setRemainingWires(Number(rw));

    const ct: bigint = await getReadContract(contract).turnIndex();
    setCurrentTurn(Number(ct));

    const nop = await getReadContract(contract).numberOfPlayers();
    const turnMove: bigint = await getReadContract(contract).turnMove();
    setMoveLeft(Number(nop - turnMove));

    const address: string = await getReadContract(contract).turnCurrentPlayer();
    setCurrentPlayer(address);

    const cards: bigint[] = await getReadContract(contract).getCards();
    setCards(cards.map((n) => Number(n)));
  }, [contract]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onCardPicked = (cp: number) => {
      void new Audio(card).play();
      setCardPicked(Number(cp));
      setCardOpen(true);
      onNextBlock(refresh);
    };

    const onGoodDeal = () => {
      onNextBlock(refresh);
    };

    if (contract) {
      const gameContract = getEventContract(contract);
      void gameContract.on(gameContract.filters.CardPicked, onCardPicked);
      void gameContract.on(gameContract.filters.GoodDeal, onGoodDeal);
      return () => {
        void gameContract.off(gameContract.filters.CardPicked, onCardPicked);
        void gameContract.on(gameContract.filters.GoodDeal, onGoodDeal);
      };
    }
  }, [contract, refresh]);

  const instance = getInstance(account);

  const onRole = async () => {
    void new Audio(card).play();
    if (role == null) {
      const contractAddress = await contract.getAddress();
      const token = await getTokenSignature(contractAddress, account);
      const encryptedRole = await contract.getRole(token.publicKey, token.signature);
      const r = instance.decrypt(contractAddress, encryptedRole);
      setRole(r);
    }
    setRoleOpen(true);
  };

  const onDeal = async () => {
    setDealInProgress(true);
    const txDeal = await contract.deal();
    await txDeal.wait();
    const txCheck = await contract.checkDeal();
    await txCheck.wait();
    setDealInProgress(false);
  };

  return (
    <div>
      <Title>Cipher Bomb</Title>
      <div className="Table__informations">
        <div>
          <Subtitle>Turn</Subtitle>
          <p>
            Remaining wires: {remainingWires}
            <br />
            Cards left to be taken: {moveLeft}
            <br />
            Current turn: {currentTurn + 1} ({5 - currentTurn} cards)
          </p>
          {dealIsNeeded && (
            <div className="Table__deal">
              <Button onClick={onDeal} disabled={dealInProgress}>
                Deal cards
              </Button>
              {dealInProgress && <Loader />}
            </div>
          )}
        </div>
        <div>
          <div className="Table__actions">
            <Subtitle>Your role</Subtitle>
            <p>
              <Button onClick={onRole}>See my role</Button>
            </p>
          </div>
        </div>
      </div>
      <TablePlayers
        dealIsNeeded={dealIsNeeded}
        contract={contract}
        players={players}
        cards={cards}
        currentPlayer={currentPlayer}
        account={account}
      />
      {role != null && (
        <CardDisplay type={role == 1 ? 'good' : 'bad'} isOpen={roleOpen} close={() => setRoleOpen(false)} />
      )}
      {cardPicked != null && (
        <CardDisplay
          type={cardPicked === 0 ? 'wire' : cardPicked === 1 ? 'bomb' : 'neutral'}
          isOpen={cardOpen}
          close={() => setCardOpen(false)}
        />
      )}
    </div>
  );
};
