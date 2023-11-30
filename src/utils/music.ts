import music from '../assets/music.mp3';

const MUSIC_MUTED = 'musicMuted';

let enabled = false;
let waitToPlay = false;
const storedMuted = window.localStorage.getItem(MUSIC_MUTED);
let muted = (storedMuted && storedMuted === '1') || false;

const musicAudio = new Audio(music);
musicAudio.loop = true;
musicAudio.volume = 0.3;

export const isMuted = () => {
  return muted;
};

export const muteMusic = () => {
  muted = true;
  window.localStorage.setItem(MUSIC_MUTED, '1');
  pauseMusic();
};

export const demuteMusic = () => {
  muted = false;
  window.localStorage.setItem(MUSIC_MUTED, '0');
  playMusic();
};

export const playMusic = () => {
  if (muted) return;
  if (enabled) {
    void musicAudio.play();
  } else {
    waitToPlay = true;
  }
};

export const pauseMusic = () => {
  if (enabled) {
    void musicAudio.pause();
  } else {
    waitToPlay = false;
  }
};

const enableMusic = () => {
  enabled = true;
  if (waitToPlay) playMusic();
  document.removeEventListener('click', enableMusic);
  document.removeEventListener('tap', enableMusic);
};

document.addEventListener('click', enableMusic);
document.addEventListener('tap', enableMusic);
