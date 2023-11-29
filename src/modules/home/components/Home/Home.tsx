import classNames from 'classnames';
import { BrowserProvider, ContractFactory } from 'ethers';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import cipherbomb from '../../../../abi/cipherbomb.json';
import { Loader, Title } from '../../../common-ui';

import './Home.css';

type HomeProps = {
  account: string;
  provider: BrowserProvider;
};

export const Home = ({ account, provider }: HomeProps) => {
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();
  const createARoom = async () => {
    if (createLoading) return;
    const contractFactory = new ContractFactory(cipherbomb.abi, cipherbomb.bytecode, await provider.getSigner());
    const c = await contractFactory.deploy();
    setCreateLoading(true);
    await c.waitForDeployment();
    const address = await c.getAddress();
    navigate(`/game/${address}`);
  };
  return (
    <div className="Home">
      <Title>Cipher Bomb</Title>
      <div className="Home__account">Welcome, {account}</div>
      <div className="Home__menu">
        <div>
          <span onClick={createARoom} className={classNames('Home__link', { 'Home__link--disabled': createLoading })}>
            Create a room {createLoading && <Loader />}
          </span>
        </div>
        <div>
          <Link to="/join" className={classNames('Home__link', { 'Home__link--disabled': createLoading })}>
            Join a room
          </Link>
        </div>
      </div>
    </div>
  );
};
