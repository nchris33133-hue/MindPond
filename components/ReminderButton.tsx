import React from 'react';
import { Button } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { scheduleTaskReminder } from '@/src/utils/reminders';

export default function ReminderButton({ task }: { task: string }) {
  const askReminder = () => {
    const currentDate = new Date();
    DateTimePickerAndroid.open({
      value: currentDate,
      mode: 'date',
      onChange: (_event, selectedDate) => {
        if (selectedDate) {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'time',
            onChange: (_event2, selectedDateTime) => {
              if (selectedDateTime) {
                scheduleTaskReminder(task, selectedDateTime);
              }
            },
          });
        }
      },
    });
  };

  return <Button title="Set Reminder" onPress={askReminder} />;
}
