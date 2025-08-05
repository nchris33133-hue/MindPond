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
