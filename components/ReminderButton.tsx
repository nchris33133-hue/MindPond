import React from 'react';
import { Alert, Button } from 'react-native';
import { scheduleTaskReminder } from '@/src/utils/reminders';

export default function ReminderButton({ task }: { task: string }) {
  const askReminder = () => {
    Alert.alert('Set Reminder', 'When should we remind you?', [
      { text: '5 min', onPress: () => scheduleTaskReminder(task, 5) },
      { text: '10 min', onPress: () => scheduleTaskReminder(task, 10) },
      { text: '30 min', onPress: () => scheduleTaskReminder(task, 30) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return <Button title="Set Reminder" onPress={askReminder} />;
}
