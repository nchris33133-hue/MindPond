import * as Calendar from 'expo-calendar';

export async function scheduleTaskReminder(task: string, date: Date) {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  const calendar = await Calendar.getDefaultCalendarAsync();
  const endDate = new Date(date.getTime() + 5 * 60000);

  await Calendar.createEventAsync(calendar.id, {
    title: `MindPond Reminder: ${task}`,
    startDate: date,
    endDate,
  });
}
