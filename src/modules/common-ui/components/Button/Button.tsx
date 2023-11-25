import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

import './Button.css';

export const Button = ({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={classNames(className, 'Button')} {...props}>
      {children}
    </button>
  );
};
