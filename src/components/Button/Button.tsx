import { ButtonHTMLAttributes } from 'react';

import './Button.css';
import classNames from 'classnames';

export const Button = ({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={classNames(className, 'Button')} {...props}>
      {children}
    </button>
  );
};
