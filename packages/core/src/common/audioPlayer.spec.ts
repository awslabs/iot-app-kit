import { AudioPlayer } from './audioPlayer';
import { Howl } from 'howler';
jest.mock('howler', () => ({ ...jest.requireActual('howler'), Howl: jest.fn() }));

const playAudio = (player: AudioPlayer) => {
  if (player) {
    return player.play({
      severity: 3,
      volume: 0.5,
    });
  }
  return;
};

describe('play', () => {
  it('automatically plays audio', () => {
    const audioPlayer = new AudioPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

    playAudio(audioPlayer);
    expect(audioPlayer.isPlaying()).toBeTrue();
    expect(howlMock.play).toHaveBeenCalledOnce();
  });
});

describe('mute and unmute', () => {
  it('mutes but continues to play audio', () => {
    const audioPlayer = new AudioPlayer();
    playAudio(audioPlayer);

    audioPlayer.mute();

    expect(audioPlayer.isMuted()).toBeTrue();
    expect(audioPlayer.isPlaying()).toBeTrue();
  });

  it('unmutes and continues to play audio', () => {
    const audioPlayer = new AudioPlayer();
    playAudio(audioPlayer);

    audioPlayer.mute();
    audioPlayer.unmute();

    expect(audioPlayer.isMuted()).toBeFalse();
    expect(audioPlayer.isPlaying()).toBeTrue();
  });
});

describe('stop', () => {
  it('stops playing audio', () => {
    const audioPlayer = new AudioPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);
    playAudio(audioPlayer);

    expect(howlMock.play).toHaveBeenCalledOnce();
    expect(audioPlayer.isPlaying()).toBeTrue();

    audioPlayer.stop();

    expect(howlMock.stop).toHaveBeenCalledOnce();
    expect(audioPlayer.isPlaying()).toBeFalse();
  });
});

describe('setMaxVolume', () => {
  it('sets max volume', () => {
    const audioPlayer = new AudioPlayer();
    audioPlayer.setMaxVolume(0.1);
    expect(audioPlayer.maxVolume).toBe(0.1);
  });

  it('enforces maximum max volume', () => {
    const audioPlayer = new AudioPlayer();
    audioPlayer.setMaxVolume(1.5);
    expect(audioPlayer.maxVolume).toBe(1.0);
  });

  it('enforces minumum max volume', () => {
    const audioPlayer = new AudioPlayer();
    audioPlayer.setMaxVolume(1.5);
    expect(audioPlayer.maxVolume).toBe(1.0);
  });
});

describe('severity', () => {
  it('plays higher severity audio', () => {
    const audioPlayer = new AudioPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

    const play1 = audioPlayer.play({
      severity: 3,
      volume: 0.5,
    });
    expect(play1).toBeTrue();

    const play2 = audioPlayer.play({
      severity: 2,
      volume: 0.8,
    });
    expect(play2).toBeTrue();

    expect(howlMock.play).toHaveBeenCalledTimes(2);
  });

  it("doesn't switch to lower severity alert", () => {
    const audioPlayer = new AudioPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

    const play1 = audioPlayer.play({
      severity: 2,
      volume: 0.5,
    });
    expect(play1).toBeTrue();

    const play2 = audioPlayer.play({
      severity: 3,
      volume: 0.8,
    });
    expect(play2).toBeFalse();

    expect(howlMock.play).toHaveBeenCalledOnce();
  });
});
