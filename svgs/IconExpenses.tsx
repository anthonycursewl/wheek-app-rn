import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconExpensesProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const IconExpenses: React.FC<IconExpensesProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#000000' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M19 14V6C19 4.9 18.1 4 17 4H3C1.9 4 1 4.9 1 6V14C1 15.1 1.9 16 3 16H17C18.1 16 19 15.1 19 14ZM17 14H3V6H17V14Z" 
        fill={color}
      />
      <Path 
        d="M21 8H23V16H21V8Z" 
        fill={color}
      />
      <Path 
        d="M13 9H5V11H13V9Z" 
        fill={color}
      />
      <Path 
        d="M5 12H11V14H5V12Z" 
        fill={color}
      />
    </Svg>
  );
};

export default IconExpenses;
