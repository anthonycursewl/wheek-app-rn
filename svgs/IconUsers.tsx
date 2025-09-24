import Svg, { SvgProps, Path, G } from "react-native-svg"

export const IconUsers = ({ ...props }: SvgProps) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G fill={props.fill || "currentColor"}>
      <Path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity={0.4} />
      <Path d="M15 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity={0.4} />
      <Path d="M17 13c-1.1 0-2.1.4-2.8 1.1-.7.7-1.2 1.6-1.2 2.6v1.3h-2v-1.3c0-1-.5-1.9-1.2-2.6-.7-.7-1.7-1.1-2.8-1.1-2.2 0-4 1.8-4 4v2h16v-2c0-2.2-1.8-4-4-4z" />
    </G>
  </Svg>
)
