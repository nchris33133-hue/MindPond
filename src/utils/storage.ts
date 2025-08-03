import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing data in local storage
export const CURRENT_FISH_KEY = 'current_fish';
export const FISH_LIST_KEY = 'fish_list';
export const TASK_COMPLETIONS_KEY = 'task_completions';

export async function setCurrentFish(type: string) {
  await AsyncStorage.setItem(CURRENT_FISH_KEY, type);
}

export async function getCurrentFish(): Promise<string | null> {
  return await AsyncStorage.getItem(CURRENT_FISH_KEY);
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Fish = {
  id: string;
  type: string;
  name: string;
  rarity: Rarity;
  timestamp: number;
};

/**
 * Get all fish from storage
 */
export async function getFish(): Promise<Fish[]> {
  try {
    const json = await AsyncStorage.getItem(FISH_LIST_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load fish:', e);
    return [];
  }
}

/**
 * Add a new fish and save it to storage.
 *
 * The name and rarity arguments are optional so callers that only
 * provide the fish type/emoji continue to work. When omitted, a
 * sensible default is used for each property.
 */
export async function addFish(
  type: string,
  name = 'Unnamed',
  rarity: Rarity = 'common'
): Promise<Fish> {
  const fish: Fish = {
    id: Date.now().toString(),
    type,
    name,
    rarity,
    timestamp: Date.now(),
  };

  const existing = await getFish();
  existing.push(fish);

  await AsyncStorage.setItem(FISH_LIST_KEY, JSON.stringify(existing));

  return fish;
}

/**
 * Clear all fish (for debugging)
 */
export async function clearFish() {
  try {
    await AsyncStorage.removeItem(FISH_LIST_KEY);
  } catch (e) {
    console.error('Failed to clear fish:', e);
  }
}

export type TaskCompletions = Record<string, number>;

/**
 * Get completion timestamps for all tasks
 */
export async function getTaskCompletions(): Promise<TaskCompletions> {
  try {
    const json = await AsyncStorage.getItem(TASK_COMPLETIONS_KEY);
    return json ? JSON.parse(json) : {};
  } catch (e) {
    console.error('Failed to load task completions:', e);
    return {};
  }
}

/**
 * Mark a task as completed now
 */
export async function setTaskCompleted(task: string): Promise<void> {
  const completions = await getTaskCompletions();
  completions[task] = Date.now();
  await AsyncStorage.setItem(
    TASK_COMPLETIONS_KEY,
    JSON.stringify(completions)
  );
}

/**
 * Determine if a task is still on its cooldown period
 */
export function isTaskOnCooldown(
  completions: TaskCompletions,
  task: string,
  cooldownMs = 24 * 60 * 60 * 1000
): boolean {
  const last = completions[task];
  return last ? Date.now() - last < cooldownMs : false;
}
