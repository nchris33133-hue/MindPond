import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import ReminderButton from '@/components/ReminderButton';
import { useRouter } from 'expo-router';
import { completeTask, formatTime } from '../../src/utils/taskHelpers';

export default function WalkScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      completeTask('Walk', router);
    }
    return () => clearTimeout(timer);
  }, [running, seconds]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <ReminderButton task="Walk" />
      <Text style={{ marginBottom: 20 }}>
        Take a 15-minute walk in a natural environment. Notice the sights,
        sounds and smells around you.
      </Text>
      {running ? (
        <Text style={{ fontSize: 32, textAlign: 'center' }}>{formatTime(seconds)}</Text>
      ) : (
        <Button title="Start Walk" onPress={() => setRunning(true)} />
      )}
    </View>
  );
}
