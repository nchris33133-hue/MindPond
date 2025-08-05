import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleDailyReminder } from '@/src/utils/reminders';
import { setOnboardingComplete } from '@/src/utils/storage';

export default function ReminderScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
    // default 9AM
  });

  const onFinish = async () => {
    if (enabled) {
      await scheduleDailyReminder(time);
    }
    await setOnboardingComplete();
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Set up reminders</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ marginRight: 10 }}>Daily reminder</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      {enabled && (
        <DateTimePicker
          value={time}
          mode="time"
          onChange={(event, date) => {
            if (date) setTime(date);
          }}
        />
      )}
      <Button title="Finish" onPress={onFinish} />
    </View>
  );
}
