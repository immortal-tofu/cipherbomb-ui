import classNames from 'classnames';

import './CardDisplay.css';

type CardDisplayProps = {
  type: 'good' | 'bad' | 'wire' | 'bomb' | 'neutral';
  isOpen: boolean;
  close: () => void;
};

export const CardDisplay = ({ type, isOpen, close }: CardDisplayProps) => {
  if (!isOpen) return null;
  return (
    <div className="CardDisplay" onClick={close}>
      <div
        className={classNames('CardDisplay__card', {
          CardDisplay__bad: type === 'bad',
          CardDisplay__good: type === 'good',
          CardDisplay__wire: type === 'wire',
          CardDisplay__bomb: type === 'bomb',
          CardDisplay__neutral: type === 'neutral',
        })}
      ></div>
    </div>
  );
};
