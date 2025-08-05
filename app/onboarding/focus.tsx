import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';

const options = [
  {
    key: 'stress',
    title: 'Stress reduction',
    description: 'Nature walks improve attention and mood.',
  },
  {
    key: 'focus',
    title: 'Focus',
    description: 'Journaling reduces mental distress.',
  },
  {
    key: 'creativity',
    title: 'Creativity',
    description: 'Reading can spark new ideas and insights.',
  },
];

export default function FocusScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 20 }}>
        Choose your focus
      </Text>
      {options.map((opt) => (
        <View
          key={opt.key}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
        >
          <Checkbox
            status={selected[opt.key] ? 'checked' : 'unchecked'}
            onPress={() => toggle(opt.key)}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{opt.title}</Text>
            <Text>{opt.description}</Text>
          </View>
        </View>
      ))}
      <Button title="Next" onPress={() => router.push('/onboarding/reminders')} />
    </View>
  );
}
