import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFish,
  getFish,
  setCurrentFish,
  getCurrentFish,
  clearFish,
  FISH_LIST_KEY,
  CURRENT_FISH_KEY,
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
    const fish = await addFish('salmon');
    expect(fish.type).toBe('salmon');

    const list = await getFish();
    expect(list).toHaveLength(1);
    expect(list[0].type).toBe('salmon');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(FISH_LIST_KEY, expect.any(String));
  });

  it('setCurrentFish and getCurrentFish handle the current fish', async () => {
    await setCurrentFish('tuna');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CURRENT_FISH_KEY, 'tuna');

    const current = await getCurrentFish();
    expect(current).toBe('tuna');
  });

  it('clearFish empties stored fish data', async () => {
    await addFish('cod');
    await clearFish();
    const list = await getFish();
    expect(list).toEqual([]);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(FISH_LIST_KEY);
  });
});
