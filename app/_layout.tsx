import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import useAuthStore from 'flux/stores/AuthStore';

SplashScreen.preventAutoHideAsync();
const { width } = Dimensions.get('window');

const AnimatedSplashScreen = ({ onAnimationFinish }: { onAnimationFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ])
    ]);

    sequence.start(() => {
      onAnimationFinish();
    });
  }, [fadeAnim, scaleAnim, onAnimationFinish]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          position: 'relative',
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View style={styles.decorationRight} />
        <Image
          source={require('../assets/images/wheek/wheek.png')} 
          style={styles.logo}
        />
        <View style={styles.decorationLeft} />
      </Animated.View>
    </View>
  )
};

function RootLayoutContent() {
  const { isAuthenticated } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    'Onest-Regular': require('../assets/fonts/Onest-Regular.ttf'),
  });

  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationFinished, setIsSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  const handleAnimationFinish = () => {
    setIsSplashAnimationFinished(true);
  };

  if (!isAppReady) {
    return null;
  }
  
  if (isAppReady && !isSplashAnimationFinished) {
    return (
      <>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={styles.appContainer}>
        <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="store/manage/[id]" 
              options={{
                headerShown: true,
                title: 'Administrar Tienda',
                headerBackTitle: 'Atrás',
              }}
            />
            <Stack.Screen 
              name="profile/edit" 
              options={{
                headerShown: true,
                title: 'Editar Perfil',
                headerBackTitle: 'Atrás',
              }}
            />
            <Stack.Screen 
              name="settings/index" 
              options={{
                headerShown: true,
                title: 'Configuración',
                headerBackTitle: 'Atrás',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="index" />
        )}
        </Stack>
      </View>
    </>
  );
}

export default function RootLayout() {
  return <RootLayoutContent />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  decorationRight: {
    position: 'absolute',
    right: 0,
    top: 15,
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor: 'rgb(207, 148, 255)',
    borderRadius: width * 0.2,
    filter: 'blur(40px)',
  },
  decorationLeft: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor: 'rgb(255, 143, 99)',
    borderRadius: width * 0.2,
    filter: 'blur(40px)',
  }
});
