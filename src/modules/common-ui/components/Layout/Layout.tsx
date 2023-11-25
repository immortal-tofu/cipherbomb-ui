import { ReactNode } from 'react';

import { Title } from '../Title';

import './Layout.css';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div className="Layout">{children}</div>;
};
