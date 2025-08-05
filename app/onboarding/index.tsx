import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 32, marginBottom: 20, textAlign: 'center' }}>
        Welcome to MindPond
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 40, textAlign: 'center' }}>
        Build mental capacity through evidence-based micro-activities.
      </Text>
      <Text style={{ fontSize: 64, marginBottom: 40 }}>🐟</Text>
      <Button title="Next" onPress={() => router.push('/onboarding/focus')} />
    </View>
  );
}
