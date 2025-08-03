import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { addFish, setCurrentFish } from '../../src/utils/storage';

export default function TaskScreen() {
  const router = useRouter();
  const tasks = ['Walk', 'Read', 'Meditate', 'Journal', 'Digital Detox'];
  const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐋'];

function getRandomFish() {
  const index = Math.floor(Math.random() * fishTypes.length);
  return { id: index, emoji: fishTypes[index] };
}

async function handleTaskComplete(task: string) {
  const randomFish = getRandomFish();
  console.log('Generated fish:', randomFish.emoji);

  await addFish(randomFish.emoji);
  await setCurrentFish(randomFish.emoji);

  // Pass only the ID, not the emoji
  router.push({ 
    pathname: '/hatch', 
    params: { fishId: randomFish.id.toString(), key: Date.now().toString() }
  });
}


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Complete a Task to Hatch an Egg 🐣
      </Text>
      {tasks.map((task) => (
        <Button
          key={task}
          title={task}
          onPress={() => handleTaskComplete(task)}
        />
      ))}
    </View>
  );
}
