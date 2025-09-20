import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface IconReceiptsProps extends Omit<SvgProps, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
}

const IconReceipts: React.FC<IconReceiptsProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#000000' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2V22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5ZM19 19.09H5V4.91H19V19.09Z" 
        fill={color}
      />
      <Path 
        d="M16 9.61H8V7.61H16V9.61Z" 
        fill={color}
      />
      <Path 
        d="M14 13.61H8V11.61H14V13.61Z" 
        fill={color}
      />
      <Path 
        d="M8 17.61H16V15.61H8V17.61Z" 
        fill={color}
      />
    </Svg>
  );
};

export default IconReceipts;
