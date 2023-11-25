import { ReactNode } from 'react';

import './Layout.css';
import { Title } from '../Title';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div className="Layout">{children}</div>;
};
