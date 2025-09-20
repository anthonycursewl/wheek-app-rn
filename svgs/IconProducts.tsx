import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface IconProductsProps extends Omit<SvgProps, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
}

const IconProducts: React.FC<IconProductsProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#000000' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 19H4V9H20V19Z" 
        fill={color}
      />
      <Path 
        d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" 
        fill={color}
      />
    </Svg>
  );
};

export default IconProducts;
