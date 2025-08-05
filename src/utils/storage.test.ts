import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFish,
  getFish,
  getFishWithNow,
  setCurrentFish,
  getCurrentFish,
  clearFish,
  FISH_LIST_KEY,
  CURRENT_FISH_KEY,
  setTaskCompleted,
  getTaskCompletions,
  TASK_COMPLETIONS_KEY,
  getStreak,
  FISH_LIFESPAN_MS,
} from './storage';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
    }),
    getItem: jest.fn(async (key) => {
      return key in store ? store[key] : null;
    }),
    removeItem: jest.fn(async (key) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

describe('storage utils', () => {
  beforeEach(async () => {
    await (AsyncStorage.clear as jest.Mock)();
    jest.clearAllMocks();
  });

  it('addFish adds a fish and getFish retrieves the list', async () => {
    const fish = await addFish('salmon', 'Nemo', 'common');
    expect(fish.type).toBe('salmon');
    expect(fish.name).toBe('Nemo');
    expect(fish.rarity).toBe('common');
    expect(fish.expiresAt - fish.timestamp).toBe(FISH_LIFESPAN_MS.common);

    const list = await getFish();
    expect(list).toHaveLength(1);
    expect(list[0].type).toBe('salmon');
    expect(list[0].name).toBe('Nemo');
    expect(list[0].rarity).toBe('common');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(FISH_LIST_KEY, expect.any(String));
  });

  it('addFish supplies defaults when name and rarity are omitted', async () => {
    const fish = await addFish('trout');
    expect(fish.type).toBe('trout');
    expect(fish.name).toBe('Unnamed');
    expect(fish.rarity).toBe('common');
    expect(fish.expiresAt - fish.timestamp).toBe(FISH_LIFESPAN_MS.common);
  });

  it('getFish filters out expired fish', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(0);
    await addFish('a', 'one', 'common');
    await addFish('b', 'two', 'rare');

    const now = FISH_LIFESPAN_MS.common + 1;
    const list = await getFishWithNow(now);
    expect(list).toHaveLength(1);
    expect(list[0].type).toBe('b');
    (Date.now as jest.Mock).mockRestore();
  });

  it('setCurrentFish and getCurrentFish handle the current fish', async () => {
    await setCurrentFish('tuna');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CURRENT_FISH_KEY, 'tuna');

    const current = await getCurrentFish();
    expect(current).toBe('tuna');
  });

  it('clearFish empties stored fish data', async () => {
    await addFish('cod', 'Bubbles', 'rare');
    await clearFish();
    const list = await getFish();
    expect(list).toEqual([]);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(FISH_LIST_KEY);
  });

  it('setTaskCompleted records a timestamp and getTaskCompletions retrieves it', async () => {
    await setTaskCompleted('Walk');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      TASK_COMPLETIONS_KEY,
      expect.any(String)
    );
    const completions = await getTaskCompletions();
    expect(completions.Walk).toBeDefined();
    expect(typeof completions.Walk).toBe('number');
  });

  it('updates streak for consecutive days', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
    await setTaskCompleted('Walk');
    expect(await getStreak()).toBe(1);

    jest.setSystemTime(new Date('2024-01-02'));
    await setTaskCompleted('Read');
    expect(await getStreak()).toBe(2);

    jest.useRealTimers();
  });
});
