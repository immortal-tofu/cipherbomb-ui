import classNames from 'classnames';

import './Splash.css';

export type SplashProps = {
  type: 'bad' | 'good' | 'bomb' | 'falsedeal';
  onClose: () => void;
};

export const Splash = ({ type, onClose }: SplashProps) => {
  let message;
  switch (type) {
    case 'bad': {
      message = (
        <>
          Bad
          <br />
          Guys
          <br />
          Wins
        </>
      );
      break;
    }
    case 'bomb': {
      message = (
        <>
          Bomb
          <br />
          exploded!
        </>
      );
      break;
    }
    case 'good': {
      message = (
        <>
          Good
          <br />
          Guys
          <br />
          Wins
        </>
      );
      break;
    }
  }
  return (
    <div className="Splash" onClick={onClose}>
      <div
        className={classNames('Splash__message', {
          Splash__bad: type === 'bad' || type === 'bomb',
          Splash__good: type === 'good',
        })}
      >
        {message}
      </div>
    </div>
  );
};
