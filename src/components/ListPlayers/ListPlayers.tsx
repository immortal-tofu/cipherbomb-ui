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
            {name && `${name} (${address})`}
            {!name && address}
          </li>
        );
      })}
    </ul>
  );
};
