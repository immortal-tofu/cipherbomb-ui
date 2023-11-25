import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import './Title.css';

export const Title = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1 className={classNames(className, 'Title')} {...props}>
      {children}
    </h1>
  );
};
