import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing fish in local storage
const CURRENT_FISH_KEY = 'current_fish';

export async function setCurrentFish(type: string) {
  await AsyncStorage.setItem(CURRENT_FISH_KEY, type);
}

export async function getCurrentFish(): Promise<string | null> {
  return await AsyncStorage.getItem(CURRENT_FISH_KEY);
}

export type Fish = {
  id: string;
  type: string;
  timestamp: number;
};

/**
 * Get all fish from storage
 */
export async function getFish(): Promise<Fish[]> {
  try {
    const json = await AsyncStorage.getItem(CURRENT_FISH_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load fish:', e);
    return [];
  }
}

/**
 * Add a new fish and save it to storage
 */
export async function addFish(type: string): Promise<Fish> {
  const fish: Fish = {
    id: Date.now().toString(),
    type,
    timestamp: Date.now(),
  };

  const existing = await getFish();
  existing.push(fish);

  console.log('Saving fish list:', existing); // 👈 DEBUG

  await AsyncStorage.setItem(CURRENT_FISH_KEY, JSON.stringify(existing));

  return fish;
}

/**
 * Clear all fish (for debugging)
 */
export async function clearFish() {
  try {
    await AsyncStorage.removeItem(CURRENT_FISH_KEY);
    console.log('All fish cleared.');
  } catch (e) {
    console.error('Failed to clear fish:', e);
  }
}
