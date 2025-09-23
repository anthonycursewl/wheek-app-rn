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
  gesturesEnabled?: boolean;
}

export default function ModalOptions({
  visible,
  onClose,
  children,
  gesturesEnabled = true,
}: ModalOptionsProps) {
  const [isModalRendered, setIsModalRendered] = useState(visible);
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsModalRendered(true);
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
        setIsModalRendered(false);
      });
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => gesturesEnabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gesturesEnabled && gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 110) {
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

  // Objeto de handlers vacío para cuando los gestos están deshabilitados
  const emptyHandlers = {};
  const panHandlers = gesturesEnabled ? panResponder.panHandlers : emptyHandlers;

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={isModalRendered}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, animatedStyles.backdrop]} />
      </TouchableWithoutFeedback>

      {/* // <--- CAMBIO CLAVE 1: El contenedor principal ya NO tiene los panHandlers. */}
      <Animated.View
        style={[styles.modal, animatedStyles.modal]}
      >
        {/* // <--- CAMBIO CLAVE 2: Los panHandlers ahora se aplican SOLO a la cabecera. */}
        <View style={styles.header} {...panHandlers}>
          <View style={styles.dragHandle} />
        </View>

        {/* El contenido ahora es libre de gestionar sus propios gestos de scroll */}
        <View style={styles.content}>
          {children}
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 15,
    // Hacemos el área de toque un poco más ancha para que sea más fácil de agarrar
    paddingHorizontal: 20, 
  },
  dragHandle: {
    width: 40,
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});