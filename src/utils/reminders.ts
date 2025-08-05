import * as Calendar from 'expo-calendar';

export async function scheduleTaskReminder(task: string, minutes: number) {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  const calendar = await Calendar.getDefaultCalendarAsync();
  const startDate = new Date(Date.now() + minutes * 60000);
  const endDate = new Date(startDate.getTime() + 5 * 60000);

  await Calendar.createEventAsync(calendar.id, {
    title: `MindPond Reminder: ${task}`,
    startDate,
    endDate,
  });
}
