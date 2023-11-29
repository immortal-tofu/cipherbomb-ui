import music from '../assets/music.mp3';

let enabled = false;
let waitToPlay = false;

const musicAudio = new Audio(music);
musicAudio.loop = true;
musicAudio.volume = 0.5;

export const playMusic = () => {
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
  if (waitToPlay) void musicAudio.play();
};

document.addEventListener('click', enableMusic);
document.addEventListener('tap', enableMusic);
