import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import {
  addFish,
  setCurrentFish,
  getTaskCompletions,
  setTaskCompleted,
  isTaskOnCooldown,
  TaskCompletions,
} from '../../src/utils/storage';

export default function TaskScreen() {
  const router = useRouter();
  const tasks = ['Walk', 'Read', 'Meditate', 'Journal', 'Digital Detox'];
  const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐋'];
  const [completions, setCompletions] = useState<TaskCompletions>({});

  useEffect(() => {
    (async () => {
      const data = await getTaskCompletions();
      setCompletions(data);
    })();
  }, []);

  function getRandomFish() {
    const index = Math.floor(Math.random() * fishTypes.length);
    return { id: index, emoji: fishTypes[index] };
  }

  async function handleTaskComplete(task: string) {
    if (isTaskOnCooldown(completions, task)) {
      Alert.alert('Task already completed', 'Please try again tomorrow.');
      return;
    }

    await setTaskCompleted(task);
    setCompletions({ ...completions, [task]: Date.now() });

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
      {tasks.map((task) => {
        const disabled = isTaskOnCooldown(completions, task);
        return (
          <Button
            key={task}
            title={disabled ? `${task} (Done)` : task}
            onPress={() => handleTaskComplete(task)}
            disabled={disabled}
          />
        );
      })}
    </View>
  );
}
