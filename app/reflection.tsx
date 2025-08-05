import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function ReflectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const task = params.task as string | undefined;
  const [note, setNote] = useState('');

  const continueToHatch = () => {
    router.push({ pathname: '/hatch', params: { ...params } });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>
        How did this {task ?? 'task'} make you feel?
      </Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Your thoughts..."
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Continue" onPress={continueToHatch} />
    </View>
  );
}
