import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getStreakInfo } from '@/src/utils/storage';

export default function ProgressScreen() {
  const [days, setDays] = useState<boolean[]>(Array(7).fill(false));

  useEffect(() => {
    async function load() {
      const { count, lastDate } = await getStreakInfo();
      const today = new Date();
      const last = lastDate ? new Date(lastDate) : null;
      const start = last ? new Date(last) : null;
      if (start) start.setDate(start.getDate() - count + 1);
      const result: boolean[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const active = start && last ? d >= start && d <= last : false;
        result.push(active);
      }
      setDays(result);
    }
    load();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>Weekly Streak</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {days.map((active, idx) => (
          <View
            key={idx}
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              backgroundColor: active ? '#6ee7b7' : '#e5e7eb',
            }}
          />
        ))}
      </View>
    </View>
  );
}
