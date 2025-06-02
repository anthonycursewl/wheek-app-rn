// components
import CustomText from "@/components/CustomText/CustomText";
import Input from "@/components/Input/Input";
import Button from "@/components/Buttons/Button";
import LogoPage from "@/components/LogoPage/LogoPage";
// layout
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { View } from "react-native";

export default function CreateProduct() {
    return (
        <LayoutScreen>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                <LogoPage />
                
                <CustomText>Crear Producto</CustomText>
            </View>

            <View style={{ width: '100%', marginTop: 30, gap: 20 }}>
                <View style={{ width: '100%', gap: 8 }}>
                    <CustomText style={{ fontSize: 18 }}>Nombre del Producto</CustomText>
                    <Input placeholder="Nombre del Producto"/>
                </View>

                <View style={{ width: '100%', gap: 8 }}>
                    <CustomText style={{ fontSize: 18 }}>Descripción del Producto</CustomText>
                    <Input placeholder="Descripción del Producto..." multiline={true} />
                </View>

                <View style={{ width: '100%', gap: 8 }}>
                    <CustomText style={{ fontSize: 18 }}>Categoría</CustomText>
                    <Input placeholder="Elije una categoría..."/>
                </View>
            </View>

            <View style={{ width: '100%', marginTop: 30, flex: 1, justifyContent: 'flex-end' }}>
                <Button title="Crear Producto" variant='primary' />
            </View>
        </LayoutScreen>
    )
}

