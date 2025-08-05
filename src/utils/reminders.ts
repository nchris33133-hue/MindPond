import * as Notifications from 'expo-notifications';

export async function scheduleTaskReminder(task: string, date: Date) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MindPond Reminder',
      body: task,
    },
    trigger: date,
  });
}

export async function scheduleDailyReminder(time: Date) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MindPond Reminder',
      body: 'Time for your MindPond activity',
    },
    trigger: {
      hour: time.getHours(),
      minute: time.getMinutes(),
      repeats: true,
    },
  });
}
