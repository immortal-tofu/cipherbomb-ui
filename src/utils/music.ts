import music from '../assets/music.mp3';

const musicAudio = new Audio(music);
musicAudio.loop = true;
musicAudio.volume = 0.5;

export const playMusic = () => {
  void musicAudio.play();
};

export const pauseMusic = () => {
  void musicAudio.pause();
};
