import { addFish, setCurrentFish, setTaskCompleted, Rarity } from './storage';
import { Router } from 'expo-router';

const fishNames = ['Nemo', 'Dory', 'Bubbles', 'Finley', 'Coral', 'Gill', 'Splash'];

type FishReward = { emoji: string; species: string; fact: string; rarity: Rarity };

const TASK_FISH: Record<string, FishReward> = {
  Meditate: {
    emoji: '🐟',
    species: 'Koi',
    fact: 'Koi fish are symbols of calm and balance.',
    rarity: 'rare',
  },
  Walk: {
    emoji: '🐠',
    species: 'Clownfish',
    fact: 'Clownfish form symbiotic bonds with sea anemones.',
    rarity: 'common',
  },
  'Digital Detox': {
    emoji: '🐡',
    species: 'Pufferfish',
    fact: 'Pufferfish inflate to deter predators.',
    rarity: 'epic',
  },
  Read: {
    emoji: '🐬',
    species: 'Dolphin',
    fact: 'Dolphins use echolocation to navigate and communicate.',
    rarity: 'rare',
  },
  Journal: {
    emoji: '🐳',
    species: 'Whale',
    fact: 'Whales sing complex songs that travel great distances.',
    rarity: 'rare',
  },
  'Boredom Challenge': {
    emoji: '🦈',
    species: 'Shark',
    fact: 'Sharks have roamed oceans for over 400 million years.',
    rarity: 'legendary',
  },
};

function getRandomName() {
  const index = Math.floor(Math.random() * fishNames.length);
  return fishNames[index];
}

export async function completeTask(task: string, router: Router) {
  await setTaskCompleted(task);
  const reward =
    TASK_FISH[task] ?? {
      emoji: '🐠',
      species: 'Fish',
      fact: 'Fish are friends, not food.',
      rarity: 'common' as Rarity,
    };
  const name = getRandomName();
  const fishRecord = await addFish(reward.emoji, name, reward.rarity);
  await setCurrentFish(reward.emoji);
  router.push({
    pathname: '/hatch',
    params: {
      emoji: reward.emoji,
      species: reward.species,
      fact: reward.fact,
      name,
      rarity: reward.rarity,
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
