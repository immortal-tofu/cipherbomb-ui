import { Back, Subtitle, Title } from '../../../common-ui';

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
      <Subtitle>Role</Subtitle>
      <p>
        The Decryptors members are represented by the Role cards with a blue background. The objective of these members
        is defusing the bomb.
      </p>
      <p>
        Members of the Red Cipher are represented by the role cards with a red background. The purpose of these members
        is to detonate the bomb.
      </p>
      <Subtitle>Card</Subtitle>
      <p>Terminal: no effect</p>
      <p>Vulnerability: founding a vulnerability brings you close to victory if you are part of the Decryptors.</p>
      <p>Bomb: triggering the bomb encrypts the digital world and hands victory to the Red Cipher</p>
    </div>
  );
};
