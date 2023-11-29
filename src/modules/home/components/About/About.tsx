import { Back, Subtitle, Title } from '../../../common-ui';

import './About.css';

export const About = () => {
  return (
    <div>
      <Back />
      <Title>About</Title>
      <p>
        Cipher Bomb is a blockchain game crafted using{' '}
        <a href="https://zama.ai/fhevm" title="fhEVM website">
          the fhEVM
        </a>
        . Developed in Solidity, Cipher Bomb leverages the encrypted types provided by the fhEVM to secure player cards
        and utilizes the encrypted PRNG to distribute cards to each player on-chain. For a deeper understanding, you can
        explore{' '}
        <a href="https://github.com/immortal-tofu/cipherbomb" title="Cipherbomb repository">
          the contract's source code
        </a>
        .
      </p>

      <Subtitle>Credits</Subtitle>
      <dl className="About__list">
        <dt>Contract & dapp</dt>
        <dd>
          <a href="https://twitter.com/immortofu">immortal tofu</a>
        </dd>
        <dt>Graphics</dt>
        <dd>
          <a href="https://www.instagram.com/brice.eljeji/">Brice Eljeji</a>
        </dd>
        <dt>Music</dt>
        <dd>Eternal Lupin</dd>
      </dl>
    </div>
  );
};
