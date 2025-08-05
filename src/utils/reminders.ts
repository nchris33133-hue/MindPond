import * as Notifications from 'expo-notifications';

export async function scheduleTaskReminder(task: string, minutes: number) {
  await Notifications.requestPermissionsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MindPond Reminder',
      body: `Time for your ${task} task`,
    },
    trigger: {
      seconds: minutes * 60,
    },
  });
}
