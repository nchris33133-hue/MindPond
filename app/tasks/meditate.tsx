import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { completeTask, formatTime } from '../../src/utils/taskHelpers';

const techniques: Record<string, string> = {
  'Breath Focus': 'Focus gently on the breath and return when distracted.',
  'Body Scan': 'Move attention slowly through your body from head to toe.',
  'Loving Kindness': 'Silently send kind wishes to yourself and others.',
};

export default function MeditateScreen() {
  const router = useRouter();
  const [technique, setTechnique] = useState(Object.keys(techniques)[0]);
  const [seconds, setSeconds] = useState(8 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      completeTask('Meditate', router);
    }
    return () => clearTimeout(timer);
  }, [running, seconds]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        Even an 8-minute meditation can boost short-term memory. Select a
        technique and begin.
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        {Object.keys(techniques).map((k) => (
          <Button key={k} title={k} onPress={() => setTechnique(k)} />
        ))}
      </View>
      <Text style={{ marginBottom: 20 }}>{techniques[technique]}</Text>
      {running ? (
        <Text style={{ fontSize: 32, textAlign: 'center' }}>{formatTime(seconds)}</Text>
      ) : (
        <Button
          title="Start 8-minute Meditation"
          onPress={() => setRunning(true)}
        />
      )}
    </View>
  );
}
