import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import ReminderButton from '@/components/ReminderButton';
import { useRouter } from 'expo-router';
import { completeTask } from '../../src/utils/taskHelpers';

const prompts = [
  'What are you grateful for today?',
  'Describe a recent emotion and what triggered it.',
  'Write about something that challenged you this week.',
];

export default function JournalScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(prompts[0]);
  const [entry, setEntry] = useState('');

  function newPrompt() {
    const index = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[index]);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ReminderButton task="Journal" />
      <Text style={{ marginBottom: 10 }}>{prompt}</Text>
      <Button title="New Prompt" onPress={newPrompt} />
      <TextInput
        value={entry}
        onChangeText={setEntry}
        placeholder="Write freely..."
        multiline
        style={{
          borderWidth: 1,
          padding: 8,
          height: 200,
          marginVertical: 20,
          textAlignVertical: 'top',
        }}
      />
      <Button title="Complete" onPress={() => completeTask('Journal', router)} />
    </View>
  );
}
