import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { Fish, getFish, getStreak } from '../../src/utils/storage';

const { width, height } = Dimensions.get('window');

export default function AquariumScreen() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [animations, setAnimations] = useState<Animated.ValueXY[]>([]);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadFish = async () => {
        const storedFish = await getFish();
        setFish(storedFish);
        const s = await getStreak();
        setStreak(s);

        // create new animations for each fish
        const anims = storedFish.map(
          () => new Animated.ValueXY({ x: Math.random() * width, y: Math.random() * height * 0.7 })
        );
        setAnimations(anims);
        anims.forEach((anim) => startSwimming(anim));
      };

      loadFish();
    }, [])
  );

  function startSwimming(anim: Animated.ValueXY) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: { x: Math.random() * width, y: Math.random() * height * 0.7 },
          duration: 6000 + Math.random() * 4000,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: { x: Math.random() * width, y: Math.random() * height * 0.7 },
          duration: 6000 + Math.random() * 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#87CEEB' }}>
      {fish.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>No fish yet. Complete a task to hatch one!</Text>
        </View>
      ) : (
        animations.map((anim, index) => (
          <Animated.View
            key={fish[index].id}
            style={{
              position: 'absolute',
              transform: [{ translateX: anim.x }, { translateY: anim.y }],
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>{fish[index].type}</Text>
            <Text style={{ fontSize: 12 }}>{fish[index].name}</Text>
          </Animated.View>
        ))
      )}
      {streak >= 7 && (
        <>
          <Text style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 30 }}>🪸</Text>
          <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 30 }}>🌿</Text>
          <Text style={{ position: 'absolute', top: 10, left: width / 2 - 10, fontSize: 20 }}>🫧</Text>
        </>
      )}
    </View>
  );
}
