import Svg, { SvgProps, Path, G } from "react-native-svg"

export const IconStore = ({ ...props }: SvgProps) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G fill={props.fill || "currentColor"}>
      <Path d="M4 6h16v2H4z" opacity={0.4} />
      <Path d="M20 8H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm0-4H6v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-4H6V6h12v4z" />
    </G>
  </Svg>
)
