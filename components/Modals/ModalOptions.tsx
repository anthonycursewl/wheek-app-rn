import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PanResponder,
  ViewStyle,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

interface ModalOptionsProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function ModalOptions({
  visible,
  onClose,
  children,
}: ModalOptionsProps) {
  // Estado interno para controlar si el modal debe estar en el árbol de componentes.
  // Esto nos permite ejecutar la animación de salida ANTES de desmontarlo.
  const [isModalRendered, setIsModalRendered] = useState(visible);

  // Usamos useRef para que los valores animados persistan entre renders sin recrearse.
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // El useEffect ahora orquesta las animaciones basado en la prop `visible` del padre.
  useEffect(() => {
    if (visible) {
      // Si el padre quiere que se muestre:
      // 1. Aseguramos que el modal esté en el DOM.
      setIsModalRendered(true);
      // 2. Ejecutamos la animación de entrada.
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Si el padre quiere que se cierre:
      // 1. Ejecutamos la animación de salida.
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: MODAL_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 2. SOLO CUANDO LA ANIMACIÓN TERMINA, lo quitamos del DOM.
        setIsModalRendered(false);
      });
    }
  }, [visible]); // Este efecto se ejecuta cada vez que la prop `visible` cambia.

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 110) {
          // Al soltar, simplemente llamamos a `onClose` para que el padre
          // cambie el estado y el useEffect se encargue de la animación.
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;

  // Si el estado interno indica que no debe renderizarse, retornamos null.
  if (!isModalRendered) {
    return null;
  }

  const animatedStyles = {
    modal: {
      transform: [{ translateY }],
    } as Animated.WithAnimatedObject<ViewStyle>,
    backdrop: {
      opacity,
    } as Animated.WithAnimatedObject<ViewStyle>,
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      // La visibilidad del <Modal> de React Native ahora la controla nuestro estado interno.
      visible={isModalRendered}
      animationType="none"
      // Para el botón de atrás de Android y otros gestos, llamamos a onClose.
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, animatedStyles.backdrop]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.modal, animatedStyles.modal]}
        {...panResponder.panHandlers}
      >
        <View style={styles.header}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  dragHandle: {
    width: 40,
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
});