import { DisplayName } from '../../../common-ui';

import './ListPlayer.css';

type ListPlayersProps = {
  players: { name: string; address: string }[];
};

export const ListPlayers = ({ players }: ListPlayersProps) => {
  return (
    <ul className="ListPlayer__players">
      {players.map(({ name, address }) => {
        return (
          <li className="ListPlayer__player" key={address}>
            <DisplayName address={address} name={name} />
          </li>
        );
      })}
    </ul>
  );
};
