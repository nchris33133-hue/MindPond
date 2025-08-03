import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { Fish, getFish } from '../../src/utils/storage';

const { width, height } = Dimensions.get('window');

export default function AquariumScreen() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [animations, setAnimations] = useState<Animated.ValueXY[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadFish = async () => {
        const storedFish = await getFish();
        setFish(storedFish);

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
          <Animated.Text
            key={fish[index].id}
            style={{
              position: 'absolute',
              fontSize: 40,
              transform: [{ translateX: anim.x }, { translateY: anim.y }],
            }}
          >
            {fish[index].type}
          </Animated.Text>
        ))
      )}
    </View>
  );
}
