import { View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { ListInventories } from "../components/ListInventories";
import { useWindowDimensions } from "react-native";

export default function InventoryManagement() {
    const { height } = useWindowDimensions()
    return (
        <View style={{ paddingTop: 16, flex: 1 }}>
            <View style={{ flex: 1, gap: 16 }}>
                <CustomText>InventoryManagement</CustomText>
            
                <ListInventories onPress={(inventory) => console.log(inventory)} height={height / 1.35}/>
            </View>
        </View>
    )
}