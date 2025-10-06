import React from 'react';
import Svg, { Path, Polyline, Line } from 'react-native-svg';

type Props = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export const IconDownload = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  ...props
}: Props) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Polyline points="7 10 12 15 17 10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  );
};

export default IconDownload;
