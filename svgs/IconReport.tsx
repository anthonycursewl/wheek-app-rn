import Svg, { SvgProps, Path } from "react-native-svg"

const IconReport = ({ ...props }: SvgProps) => (
    <Svg
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            fill={props.fill}
            d="M16.303 15.336H6.68v4.846a.83.83 0 0 1-.84.818.83.83 0 0 1-.84-.818V3.818A.83.83 0 0 1 5.84 3h10.463c1.1 0 1.948.66 2.37 1.482a2.926 2.926 0 0 1-.06 2.798l-.503.878a2.064 2.064 0 0 0 0 2.02l.502.878c.53.924.485 1.977.062 2.798-.423.823-1.27 1.482-2.371 1.482Z"
        />
    </Svg>
)
export default IconReport
