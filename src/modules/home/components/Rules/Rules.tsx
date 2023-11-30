import { Back, Subtitle, Title } from '../../../common-ui';

import './Rules.css';

export const Rules = () => {
  return (
    <div>
      <Back />
      <Title>Story</Title>
      <p>
        In the shadows of the digital realm, a formidable hacker known as Natalya Encryptova has assembled a team called
        the Red Cipher to concoct a nefarious plan and unleash chaos upon the world. Natalya has infiltrated the core
        servers of a highly secure data center, planting a malevolent program that will encrypt all available data and
        demand a ransom for its release. As the countdown to encryption begins, a group of elite hackers, led by
        CrunchCracker and known as the Decryptors, races against time to prevent the impending catastrophe.
      </p>
      <p>
        The game begins with players secretly discovering whether they belong to the Decryptors or the Red Cipher, and
        they must navigate the intricate web of alliances and deceptions within the hacker community. As the turns
        unfold, players choose a vulnerability in the encryption algorithm to exploit, attempting to detonate or defuse
        the bomb according to which team you belong. The Decryptors wins if they defuse the bomb, while the Red Cipher
        wins if they detonate the bomb.
      </p>
      <Title>Rules</Title>
      <Subtitle>Roles</Subtitle>
      <p>
        The Decryptors members are represented by the Role cards with a blue background. The objective of these members
        is defusing the bomb.
      </p>
      <p>
        Members of the Red Cipher are represented by the role cards with a red background. The purpose of these members
        is to detonate the bomb.
      </p>
      <p>The number of Decryptors and Red Cipher member depends of the number of players.</p>
      <dl className="Rules__list">
        <dt>4 players</dt>
        <dd>1 or 2 members of the Red Cipher</dd>
        <dt>5 players</dt>
        <dd>2 members of the Red Cipher</dd>
        <dt>6 players</dt>
        <dd>2 members of the Red Cipher</dd>
      </dl>
      <Subtitle>Cards</Subtitle>
      <dl className="Rules__list">
        <dt>Safe code</dt>
        <dd>Nothing happens.</dd>
        <dt>Vulnerability</dt>
        <dd>Founding a vulnerability brings you close to victory if you are part of the Decryptors.</dd>
        <dt>Bomb</dt>
        <dd>Triggering the bomb encrypts the digital world and hands victory to the Red Cipher.</dd>
      </dl>
      <Subtitle>How to play</Subtitle>
      <p>
        The game is played over a maximum of 4 rounds uring which you attempt to identify vulnerabilities in other
        players' cards in pursuit of achieving your goal.
      </p>
      <p>
        Beginning with the first player, select the player from whom you wish to draw a card. Encourage discussion and
        listen to each player's arguments before making your decision. You cannot take one of your own cards. The chosen
        card is revealed to everyone.
      </p>
      <p>
        The round ends when the number of revealed cards equals the total number of players. Subsequently, all cards are
        redistributed.
      </p>
      <p>
        With each new round, each player has one card less than at the beginning of the previous round. A new round
        begins.
      </p>
      <p>The game ends immediately if one of the following three conditions is met:</p>
      <ul>
        <li>
          <strong>All vulnerabilities are revealed.</strong> Members of the Decryptors immediately win the game.
        </li>
        <li>
          <strong>The Bomb card is revealed.</strong> Members of the Red Cipher immediately win the game.
        </li>
        <li>
          <strong>At the end of four rounds, neither of the two above conditions have been reached.</strong> Members of
          the Red Cipher immediately win the game.
        </li>
      </ul>
    </div>
  );
};
