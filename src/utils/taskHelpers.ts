import { addFish, setCurrentFish, setTaskCompleted } from './storage';
import { Router } from 'expo-router';

const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐋'];
const fishNames = ['Nemo', 'Dory', 'Bubbles', 'Finley', 'Coral', 'Gill', 'Splash'];

function getRandomFish() {
  const index = Math.floor(Math.random() * fishTypes.length);
  return { id: index, emoji: fishTypes[index] };
}

function getRandomName() {
  const index = Math.floor(Math.random() * fishNames.length);
  return fishNames[index];
}

function getRandomRarity(): 'common' | 'rare' | 'epic' | 'legendary' {
  const r = Math.random();
  if (r < 0.6) return 'common';
  if (r < 0.85) return 'rare';
  if (r < 0.97) return 'epic';
  return 'legendary';
}

export async function completeTask(task: string, router: Router) {
  await setTaskCompleted(task);
  const randomFish = getRandomFish();
  const name = getRandomName();
  const rarity = getRandomRarity();
  const fishRecord = await addFish(randomFish.emoji, name, rarity);
  await setCurrentFish(randomFish.emoji);
  router.push({
    pathname: '/hatch',
    params: {
      fishId: randomFish.id.toString(),
      name,
      rarity,
      hatchedAt: fishRecord.timestamp.toString(),
      key: Date.now().toString(),
    },
  });
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
