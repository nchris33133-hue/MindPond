import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import ReminderButton from '@/components/ReminderButton';
import { useRouter } from 'expo-router';
import { completeTask, formatTime } from '../../src/utils/taskHelpers';

const durations = [10, 15];

export default function BoredomScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(10);
  const [seconds, setSeconds] = useState(duration * 60);
  const [running, setRunning] = useState(false);
  const [reflect, setReflect] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      setRunning(false);
      setFinished(true);
    }
    return () => clearTimeout(timer);
  }, [running, seconds]);

  const start = () => {
    setSeconds(duration * 60);
    setRunning(true);
  };

  const complete = () => {
    completeTask('Boredom Challenge', router);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ReminderButton task="Boredom Challenge" />
      {!finished ? (
        <>
          <Text style={{ marginBottom: 20 }}>
            Spend 10–15 minutes with no stimulation. Let your mind wander.
          </Text>
          {!running && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
              {durations.map((d) => (
                <Button key={d} title={`${d}m`} onPress={() => setDuration(d)} />
              ))}
            </View>
          )}
          {running ? (
            <Text style={{ fontSize: 32, textAlign: 'center' }}>{formatTime(seconds)}</Text>
          ) : (
            <Button title="Start" onPress={start} />
          )}
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 10 }}>
            Reflect on any ideas or insights that arose:
          </Text>
          <TextInput
            value={reflect}
            onChangeText={setReflect}
            multiline
            style={{ borderWidth: 1, padding: 8, height: 200, marginBottom: 20, textAlignVertical: 'top' }}
          />
          <Button title="Complete" onPress={complete} />
        </>
      )}
    </View>
  );
}
