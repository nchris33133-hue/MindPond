import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import ReminderButton from '@/components/ReminderButton';
import { useRouter } from 'expo-router';
import { completeTask, formatTime } from '../../src/utils/taskHelpers';

const options = [15, 30, 60];

export default function DigitalDetoxScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(15);
  const [seconds, setSeconds] = useState(duration * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      completeTask('Digital Detox', router);
    }
    return () => clearTimeout(timer);
  }, [running, seconds]);

  function start() {
    setSeconds(duration * 60);
    setRunning(true);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ReminderButton task="Digital Detox" />
      <Text style={{ marginBottom: 10 }}>
        Step away from your device for a while. Choose a duration and stay
        on this screen until the timer ends.
      </Text>
      {!running && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          {options.map((o) => (
            <Button key={o} title={`${o}m`} onPress={() => setDuration(o)} />
          ))}
        </View>
      )}
      {running ? (
        <Text style={{ fontSize: 32, textAlign: 'center' }}>{formatTime(seconds)}</Text>
      ) : (
        <Button title="Start Detox" onPress={start} />
      )}
    </View>
  );
}
