import Svg, { Path } from 'react-native-svg'

export default function IconArrow({ ...props }: any) {
    return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            transform="rotate(270)"
            viewBox="0 0 24 24"
            {...props}
          >
            <Path
              fill="#0F0F0F"
              d="M14.29 5.707a1 1 0 0 0-1.415 0L7.988 10.6a2 2 0 0 0 0 2.828l4.89 4.89a1 1 0 0 0 1.415-1.414l-4.186-4.185a1 1 0 0 1 0-1.415l4.182-4.182a1 1 0 0 0 0-1.414Z"
            />
          </Svg>        
    )
} 

