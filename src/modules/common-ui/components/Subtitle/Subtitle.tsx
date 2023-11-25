import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import './Subtitle.css';

export const Subtitle = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2 className={classNames(className, 'Subtitle')} {...props}>
      {children}
    </h2>
  );
};
