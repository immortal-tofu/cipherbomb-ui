import classNames from 'classnames';
import { InputHTMLAttributes } from 'react';

import './TextInput.css';

export const TextInput = ({ children, className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={classNames(className, 'TextInput')} {...props} />;
};
