import { AudioAlertPlayer } from './audioAlertPlayer';
import { Howl } from 'howler';
jest.mock('howler', () => ({ ...jest.requireActual('howler'), Howl: jest.fn() }));

const playAudio = (player: AudioAlertPlayer) => {
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
    const audioAlertPlayer = new AudioAlertPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

    playAudio(audioAlertPlayer);
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
    expect(howlMock.play).toHaveBeenCalledOnce();
  });
});

describe('mute and unmute', () => {
  it('mutes but continues to play audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    playAudio(audioAlertPlayer);

    audioAlertPlayer.mute();

    expect(audioAlertPlayer.isMuted()).toBeTrue();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });

  it('unmutes and continues to play audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    playAudio(audioAlertPlayer);

    audioAlertPlayer.mute();
    audioAlertPlayer.unmute();

    expect(audioAlertPlayer.isMuted()).toBeFalse();
    expect(audioAlertPlayer.isPlaying()).toBeTrue();
  });
});

describe('stop', () => {
  it('stops playing audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
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
  it('sets max volume', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.setMaxVolume(0.1);
    expect(audioAlertPlayer.maxVolume).toBe(0.1);
  });

  it('enforces maximum max volume', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.maxVolume).toBe(1.0);
  });

  it('enforces minumum max volume', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    audioAlertPlayer.setMaxVolume(1.5);
    expect(audioAlertPlayer.maxVolume).toBe(1.0);
  });
});

describe('severity', () => {
  it('plays higher severity audio', () => {
    const audioAlertPlayer = new AudioAlertPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

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
    const audioAlertPlayer = new AudioAlertPlayer();
    const howlMock = { ...jest.requireActual('howler'), play: jest.fn(), state: () => 'unloaded', stop: jest.fn() };
    (Howl as jest.Mock<Howl>).mockImplementation(() => howlMock);

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
