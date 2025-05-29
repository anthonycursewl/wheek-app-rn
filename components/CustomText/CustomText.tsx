import { Text } from "react-native";

interface CustomTextProps {
    children: string;
    style?: any;
}

export default function CustomText({ children, style }: CustomTextProps) {
    return (
        <Text style={{ fontFamily: 'Onest-Regular', ...style }}>{children}</Text>
    )
}