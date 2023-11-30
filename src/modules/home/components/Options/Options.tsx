import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { demuteMusic, isMuted, muteMusic } from '../../../../utils/music';
import { Back, Title } from '../../../common-ui';

import './Options.css';

export const Options = () => {
  const [muted, setMuted] = useState(isMuted());

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const onMute = () => {
    if (!muted) {
      console.log('muted');
      muteMusic();
    } else {
      demuteMusic();
    }
    setMuted(!muted);
  };

  return (
    <div className="Options">
      <Back />
      <Title>Options</Title>
      <div className="Options__menu">
        <div className={classNames('Options__link Options__link')}>
          <span onClick={onMute}>Music: {muted ? 'OFF' : 'ON'}</span>
        </div>
      </div>
    </div>
  );
};
