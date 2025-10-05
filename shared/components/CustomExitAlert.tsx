import React, { useEffect, useRef } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Animated, Easing, BackHandler } from 'react-native';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { BlurView } from 'expo-blur';
import CustomText from '@components/CustomText/CustomText';

const CustomExitAlert = () => {
  const { isExitAlertVisible, hideExitAlert } = useGlobalStore();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExitAlertVisible) {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExitAlertVisible, scaleAnim, opacityAnim]);

  const handleExit = () => {
    hideExitAlert();
    BackHandler.exitApp();
  };

  return (
    <Modal
      transparent
      visible={isExitAlertVisible}
      animationType="none"
      onRequestClose={hideExitAlert}
      statusBarTranslucent
    >
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.darkOverlay} />
        </View>
        <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleAnim }] }]}>
          <CustomText style={styles.title}>¿Seguro que quieres salir?</CustomText>
          <CustomText style={styles.message}>Tendrás que cargar nuevamente todos tus datos.</CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={hideExitAlert}
            >
              <CustomText style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</CustomText>
            </TouchableOpacity>
            <View style={styles.buttonSeparator} />
            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={handleExit}
            >
              <CustomText style={[styles.buttonText, styles.exitButtonText]}>Salir</CustomText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertBox: {
    width: '75%',
    maxWidth: 280,
    backgroundColor: 'rgba(248, 248, 248, 0.92)',
    borderRadius: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 4,
    color: '#000',
  },
  message: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {},
  buttonSeparator: {
    width: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.27)',
  },
  exitButton: {},
  buttonText: {
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  exitButtonText: {
    color: '#FF3B30',
  },
});

export default React.memo(CustomExitAlert);
