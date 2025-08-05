import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { getStreakInfo } from '@/src/utils/storage';

export default function ProgressScreen() {
  const [data, setData] = useState<number[]>(Array(7).fill(0));
  const [labels, setLabels] = useState<string[]>(Array(7).fill(''));

  useEffect(() => {
    async function load() {
      const { count, lastDate } = await getStreakInfo();
      const today = new Date();
      const last = lastDate ? new Date(lastDate) : null;
      const start = last ? new Date(last) : null;
      if (start) start.setDate(start.getDate() - count + 1);
      const result: number[] = [];
      const labelArr: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const active = start && last ? d >= start && d <= last : false;
        result.push(active ? 1 : 0);
        labelArr.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      setData(result);
      setLabels(labelArr);
    }
    load();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Card style={{ width: '100%' }}>
        <Card.Title title="Weekly Streak" />
        <Card.Content>
          <LineChart
            data={{ labels, datasets: [{ data }] }}
            width={Dimensions.get('window').width - 64}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            fromZero
            withInnerLines={false}
            withOuterLines={false}
            bezier
          />
        </Card.Content>
      </Card>
    </View>
  );
}
