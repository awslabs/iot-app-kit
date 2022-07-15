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
  const audioAlertPlayer = new AudioPlayer();

  it('automatically plays audio', () => {
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

    playAudio(audioAlertPlayer);
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    expect(howlMock.play).toHaveBeenCalledOnce();
  });
});

describe('mute and unmute', () => {
  let audioAlertPlayer: AudioPlayer;

  beforeEach(() => {
    audioAlertPlayer = new AudioPlayer();
    playAudio(audioAlertPlayer);
  });

  it('mutes but continues to play audio', () => {
    audioAlertPlayer.mute();

    expect(audioAlertPlayer.isMuted()).toBeTrue();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('unmutes and continues to play audio', () => {
    audioAlertPlayer.mute();
    audioAlertPlayer.unmute();

    expect(audioAlertPlayer.isMuted()).toBeFalse();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});

describe('stop', () => {
  const audioAlertPlayer = new AudioPlayer();

  it('stops playing audio', () => {
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);
    playAudio(audioAlertPlayer);

    expect(howlMock.play).toHaveBeenCalledOnce();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();

    audioAlertPlayer.stop();

    expect(howlMock.stop).toHaveBeenCalledOnce();
    expect(audioAlertPlayer.isPlaying()).toBeFalse();
  });
});

describe('setMaxVolume', () => {
  const audioAlertPlayer = new AudioPlayer();

  it('sets max volume', () => {
    audioAlertPlayer.setMaxVolume(0.1);
    expect(audioAlertPlayer.maxVolume).toBe(0.1);
  });

  it('enforces maximum max volume', () => {
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.maxVolume).toBe(1.0);
  });

  it('enforces minumum max volume', () => {
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.maxVolume).toBe(1.0);
  });
});

describe('severity', () => {
  let audioAlertPlayer: AudioPlayer;
  let howlMock = {
    ...jest.requireActual('howler'),
  };

  beforeEach(() => {
    howlMock = {
      ...jest.requireActual('howler'),
      play: jest.fn(),
      state: () => 'unloaded',
      stop: jest.fn(),
    };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);
    audioAlertPlayer = new AudioPlayer();
  });

  it('plays higher severity audio', () => {
    const play1 = audioAlertPlayer.play({
      severity: 3,
      volume: 0.5,
    });
    expect(play1).toBeTrue();

    const play2 = audioAlertPlayer.play({
      severity: 2,
      volume: 0.8,
    });
    expect(play2).toBeTrue();

    expect(howlMock.play).toHaveBeenCalledTimes(2);
  });

  it("doesn't switch to lower severity alert", () => {
    audioAlertPlayer.stop();
    const play1 = audioAlertPlayer.play({
      severity: 2,
      volume: 0.5,
    });
    expect(play1).toBeTrue();

    const play2 = audioAlertPlayer.play({
      severity: 3,
      volume: 0.8,
    });
    expect(play2).toBeFalse();

    expect(howlMock.play).toHaveBeenCalledOnce();
  });
});
