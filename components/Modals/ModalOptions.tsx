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
  gesturesEnabled?: boolean; // Prop para controlar los gestos
}

export default function ModalOptions({
  visible,
  onClose,
  children,
  gesturesEnabled = true, // <-- CAMBIO CLAVE: Ahora es TRUE por defecto
}: ModalOptionsProps) {
  const [isModalRendered, setIsModalRendered] = useState(visible);
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsModalRendered(true);
      // Cuando se abre, animamos a la posición inicial (translateY: 0)
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
      // Cuando se cierra, animamos hacia abajo
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
      onStartShouldSetPanResponder: () => gesturesEnabled, // Solo responde si los gestos están habilitados
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // La condición es: gestos habilitados Y el movimiento es principalmente vertical y hacia abajo.
        return gesturesEnabled && gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Solo mover si el gesto es hacia abajo (dy > 0)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 110) {
          onClose(); // Cierra si el arrastre es suficientemente largo
        } else {
          // Si no, vuelve a la posición inicial
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;
  
  // Si no debe renderizarse, no renderizamos nada
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

      <Animated.View
        style={[styles.modal, animatedStyles.modal]}
        // Aplicamos los handlers solo si gesturesEnabled es true
        {...(gesturesEnabled ? panResponder.panHandlers : emptyHandlers)}
      >
        <View style={styles.header}>
          <View style={styles.dragHandle} />
        </View>

        {/* El View 'content' es crucial para que la FlatList funcione con flexbox */}
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
    paddingTop: 16, // Espacio para agarrar
    paddingBottom: 15,
  },
  dragHandle: {
    width: 40,
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  content: {
    flex: 1, // Esto asegura que el contenido pueda usar flexbox para llenar el espacio
    paddingHorizontal: 16, // Padding para el contenido
    paddingBottom: 16,
    // Quitamos el padding del contenedor principal para dárselo al header y content por separado
  },
});