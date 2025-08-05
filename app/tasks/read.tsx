import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { completeTask, formatTime } from '../../src/utils/taskHelpers';

export default function ReadScreen() {
  const router = useRouter();
  const [material, setMaterial] = useState('');
  const [mode, setMode] = useState<'minutes' | 'pages'>('minutes');
  const [goal, setGoal] = useState('20');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0 && mode === 'minutes') {
      completeTask('Read', router);
    }
    return () => clearTimeout(timer);
  }, [running, seconds, mode]);

  function start() {
    if (mode === 'minutes') {
      const mins = parseInt(goal, 10) || 20;
      setSeconds(mins * 60);
      setRunning(true);
    } else {
      completeTask('Read', router);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>
        Reading 10 pages (about 20–30 minutes) improves memory and reduces
        stress. Pick something you'd like to read.
      </Text>
      <TextInput
        placeholder="Material"
        value={material}
        onChangeText={setMaterial}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />
      <Button
        title={`Goal: ${mode}`}
        onPress={() => setMode(mode === 'minutes' ? 'pages' : 'minutes')}
      />
      <TextInput
        placeholder={mode === 'minutes' ? 'Minutes' : 'Pages'}
        keyboardType="number-pad"
        value={goal}
        onChangeText={setGoal}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />
      {running && mode === 'minutes' ? (
        <Text style={{ fontSize: 32, textAlign: 'center' }}>{formatTime(seconds)}</Text>
      ) : (
        <Button
          title={mode === 'minutes' ? 'Start Reading' : 'Complete'}
          onPress={start}
        />
      )}
    </View>
  );
}
