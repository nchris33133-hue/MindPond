import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTaskCompletions, isTaskOnCooldown, TaskCompletions } from '../../src/utils/storage';

const tasks = [
  { key: 'Walk', label: 'Walk in Nature', route: 'walk' },
  { key: 'Read', label: 'Reading', route: 'read' },
  { key: 'Journal', label: 'Journaling', route: 'journal' },
  { key: 'Meditate', label: 'Mindfulness Meditation', route: 'meditate' },
  { key: 'Digital Detox', label: 'Digital Detox', route: 'digital-detox' },
  { key: 'Boredom Challenge', label: 'Boredom Challenge', route: 'boredom' },
];

export default function TaskScreen() {
  const router = useRouter();
  const [completions, setCompletions] = useState<TaskCompletions>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getTaskCompletions();
        setCompletions(data);
      })();
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Complete a Task to Hatch an Egg 🐣
      </Text>
      {tasks.map((task) => {
        const disabled = isTaskOnCooldown(completions, task.key);
        return (
          <Button
            key={task.key}
            title={disabled ? `${task.label} (Done)` : task.label}
            onPress={() => router.push(`/tasks/${task.route}`)}
            disabled={disabled}
          />
        );
      })}
    </View>
  );
}
