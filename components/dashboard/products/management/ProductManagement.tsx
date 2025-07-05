import Button from "@components/Buttons/Button";
import { View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { useState } from "react";
import { router } from "expo-router";

export default function ProductManagement() {
    const [products, setProducts] = useState([
        {

        }
    ])

    return (
        <View style={{ marginTop: 20, gap: 10 }}>
            <Button title="Crear producto" 
            onPress={() => router.push('/products/create')}
            />

            <View>
                <CustomText>
                    Simulación de una lista owo
                </CustomText>
            </View>
        </View>
    )
}