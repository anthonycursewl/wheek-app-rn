import Svg, { Path, G, SvgProps } from 'react-native-svg'

export default function IconSearch({ ...props }: SvgProps) {
    return (
        <Svg
          fill="none"
          viewBox="0 0 24 24"
          {...props}
        >
          <G fill="rgb(113, 84, 150)">
            <Path
              d="M11.01 20.02a9.01 9.01 0 1 0 0-18.02 9.01 9.01 0 0 0 0 18.02Z"
              opacity={0.4}
            />
            <Path d="M21.99 18.95c-.33-.61-1.03-.95-1.97-.95-.71 0-1.32.29-1.68.79-.36.5-.44 1.17-.22 1.84.43 1.3 1.18 1.59 1.59 1.64.06.01.12.01.19.01.44 0 1.12-.19 1.78-1.18.53-.77.63-1.54.31-2.15Z" />
          </G>
        </Svg>
      )
}