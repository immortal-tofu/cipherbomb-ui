import { HTMLAttributes } from 'react';

import './Title.css';
import classNames from 'classnames';

export const Title = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1 className={classNames(className, 'Title')} {...props}>
      {children}
    </h1>
  );
};
