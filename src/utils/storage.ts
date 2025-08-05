import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing data in local storage
export const CURRENT_FISH_KEY = 'current_fish';
export const FISH_LIST_KEY = 'fish_list';
export const TASK_COMPLETIONS_KEY = 'task_completions';
export const TASK_COOLDOWN_MS = 20 * 1000;
export const STREAK_COUNT_KEY = 'streak_count';
export const STREAK_LAST_DATE_KEY = 'streak_last_date';
export const ONBOARDING_KEY = 'onboarding_complete';

// How long each fish rarity should live, in milliseconds
export const FISH_LIFESPAN_MS: Record<Rarity, number> = {
  common: 5 * 60 * 1000,
  rare: 10 * 60 * 1000,
  epic: 15 * 60 * 1000,
  legendary: 20 * 60 * 1000,
};

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
  expiresAt: number;
};

/**
 * Get all fish from storage
 */
export async function getFish(): Promise<Fish[]> {
  return await getFishWithNow();
}

/**
 * Internal helper to allow injecting a custom 'now' for tests.
 */
export async function getFishWithNow(now = Date.now()): Promise<Fish[]> {
  try {
    const json = await AsyncStorage.getItem(FISH_LIST_KEY);
    const list: Fish[] = json ? JSON.parse(json) : [];
    const filtered = list.filter((f) => f.expiresAt > now);

    if (filtered.length !== list.length) {
      await AsyncStorage.setItem(FISH_LIST_KEY, JSON.stringify(filtered));
    }

    return filtered;
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
  const now = Date.now();
  const fish: Fish = {
    id: now.toString(),
    type,
    name,
    rarity,
    timestamp: now,
    expiresAt: now + FISH_LIFESPAN_MS[rarity],
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
 * Update the user's streak based on the last completion date.
 *
 * A completion on the same day does not change the streak. Completing a
 * task on the day immediately following the last recorded completion
 * increments the streak; otherwise the streak resets to 1.
 */
async function updateStreak(now = new Date()) {
  const today = now.toDateString();
  const last = await AsyncStorage.getItem(STREAK_LAST_DATE_KEY);

  let count = parseInt((await AsyncStorage.getItem(STREAK_COUNT_KEY)) || '0', 10);

  if (last === today) {
    // already counted today
    return;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (last === yesterday.toDateString()) {
    count += 1;
  } else {
    count = 1;
  }

  await AsyncStorage.setItem(STREAK_COUNT_KEY, count.toString());
  await AsyncStorage.setItem(STREAK_LAST_DATE_KEY, today);
}

export async function getStreak(): Promise<number> {
  const count = await AsyncStorage.getItem(STREAK_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

export async function getStreakInfo(): Promise<{
  count: number;
  lastDate: string | null;
}> {
  const [count, lastDate] = await Promise.all([
    AsyncStorage.getItem(STREAK_COUNT_KEY),
    AsyncStorage.getItem(STREAK_LAST_DATE_KEY),
  ]);
  return { count: count ? parseInt(count, 10) : 0, lastDate };
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
  await updateStreak();
}

/**
 * Determine if a task is still on its cooldown period
 */
export function isTaskOnCooldown(
  completions: TaskCompletions,
  task: string,
  cooldownMs = TASK_COOLDOWN_MS
): boolean {
  const last = completions[task];
  return last ? Date.now() - last < cooldownMs : false;
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}
