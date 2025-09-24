import React from 'react';
import { Canvas, Circle, Group, Blur } from '@shopify/react-native-skia';

interface BlurryCircleProps {
  width: number;
  height: number;
  color: string;
}

export const BlurryCircle = ({ width, height, color }: BlurryCircleProps) => {
  const radius = width / 2;
  // El desenfoque debe ser una fracción del radio para que se vea bien
  const blurValue = radius * 0.7; 

  return (
    <Canvas style={{ width, height }}>
      {/* Usamos un Grupo para aplicar el filtro de desenfoque a todo lo que contenga */}
      <Group>
        {/* El filtro que se aplicará a los elementos del Grupo */}
        <Blur blur={blurValue} />
        
        {/* El círculo que queremos desenfocar */}
        <Circle 
          cx={radius} // Coordenada X del centro
          cy={radius} // Coordenada Y del centro
          r={radius}  // Radio del círculo
          color={color}
        />
      </Group>
    </Canvas>
  );
};