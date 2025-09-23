import Svg, { Path, SvgProps } from 'react-native-svg'

export default function IconArrow({ ...props }: SvgProps) {
    return (
          <Svg
            fill="none"
            transform={props.transform}
            viewBox="0 0 24 24"
            {...props}
          >
            <Path
              fill={props.fill}
              d="M14.29 5.707a1 1 0 0 0-1.415 0L7.988 10.6a2 2 0 0 0 0 2.828l4.89 4.89a1 1 0 0 0 1.415-1.414l-4.186-4.185a1 1 0 0 1 0-1.415l4.182-4.182a1 1 0 0 0 0-1.414Z"
            />
          </Svg>        
    )
} 

