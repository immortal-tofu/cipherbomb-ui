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
        <div className={classNames('Home__link Home__link', { 'Home__link--disabled': createLoading })}>
          <span onClick={createARoom}>Create a room</span>
          {createLoading && <Loader />}
        </div>
        <div className={classNames('Home__link Home__link', { 'Home__link--disabled': createLoading })}>
          <Link to="/join">Join a room</Link>
        </div>
        <div className={classNames('Home__link Home__link', { 'Home__link--disabled': createLoading })}>
          <Link to="/rules">Rules</Link>
        </div>
        <div className={classNames('Home__link Home__link--small', { 'Home__link--disabled': createLoading })}>
          <Link to="/about">About</Link>
        </div>
      </div>
    </div>
  );
};
