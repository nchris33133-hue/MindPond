import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

export default function HatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emoji = params.emoji as string | undefined;
  const species = params.species as string | undefined;
  const fact = params.fact as string | undefined;
  const name = params.name as string | undefined;
  const rarity = (params.rarity as string | undefined) ?? 'common';
  const hatchedAt = params.hatchedAt ? new Date(parseInt(params.hatchedAt as string, 10)) : null;

  const rarityStyles: Record<string, { color: string; scale: number }> = {
    common: { color: '#000', scale: 1 },
    rare: { color: '#2196F3', scale: 1.2 },
    epic: { color: '#9C27B0', scale: 1.5 },
    legendary: { color: '#FF9800', scale: 2 },
  };

  const rarityStyle = rarityStyles[rarity] ?? rarityStyles.common;

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
            color: rarityStyle.color,
            transform: [
              {
                scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, rarityStyle.scale] })
              }
            ]
          }}
        >
          {emoji ?? '❓'}
        </Animated.Text>
      )}

      <Text style={{ fontSize: 20, marginTop: 20, textAlign: 'center' }}>
        {!showFish
          ? 'Egg is hatching...'
          : `Your ${rarity} ${species ?? 'fish'} ${
              name ?? ''
            } hatched on ${hatchedAt ? hatchedAt.toLocaleString() : ''}!`}
      </Text>
      {showFish && fact && (
        <Text style={{ marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>{fact}</Text>
      )}
    </View>
  );
}
