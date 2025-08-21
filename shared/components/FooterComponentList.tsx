import { View } from "react-native";
import CustomText from "@components/CustomText/CustomText";

interface FooterComponentListProps {
    message?: string;
    isVisible?: boolean;
    icon?: string;
}

export default function FooterComponentList({ message, isVisible = true, icon }: FooterComponentListProps) {
    return (
        !isVisible ? (
            <View style={{ alignItems: 'center' }}>
                <CustomText style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{message}</CustomText>
            </View>
        ) : null
    )
}