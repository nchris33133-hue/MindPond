import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐋'];

export default function HatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fishId = params.fishId ? parseInt(params.fishId as string, 10) : null;
  const fish = fishId !== null ? fishTypes[fishId] : null;

  const [showFish, setShowFish] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setShowFish(false);

    const eggTimer = setTimeout(() => {
      setShowFish(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      const fishTimer = setTimeout(() => {
        router.push('/aquarium');
      }, 1500);

      return () => clearTimeout(fishTimer);
    }, 1500);

    return () => clearTimeout(eggTimer);
  }, [params.key]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!showFish ? (
        <Text style={{ fontSize: 50 }}>🥚</Text>
      ) : (
        <Animated.Text
          style={{
            fontSize: 50,
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
              }
            ]
          }}
        >
          {fish ?? '❓'}
        </Animated.Text>
      )}

      <Text style={{ fontSize: 20, marginTop: 20 }}>
        {!showFish ? 'Egg is hatching...' : 'Your fish hatched!'}
      </Text>
    </View>
  );
}
