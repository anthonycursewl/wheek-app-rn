// components
import CustomText from "@/components/CustomText/CustomText";
import Input from "@/components/Input/Input";
import Button from "@/components/Buttons/Button";
import LogoPage from "@/components/LogoPage/LogoPage";
// layout
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { StyleSheet, View } from "react-native";

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
                    <Input placeholder="Descripción del Producto..."/>
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

const stylesCreateProduct = StyleSheet.create({
    decorationRight: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: -12,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(255, 143, 99)',
        borderRadius: 12,
        filter: 'blur(24px)'
    }, 
    decorationLeft: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: 12,
        left: '50%',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(207, 148, 255)',
        borderRadius: 12,
        filter: 'blur(24px)'
    }
})