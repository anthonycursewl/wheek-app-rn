import LayoutScreen from "@/components/Layout/LayoutScreen"
import CustomText from "@/components/CustomText/CustomText"
import LogoPage from "@/components/LogoPage/LogoPage"
import { View } from "react-native"
import { Alert } from "react-native"

// components
import Input from "@/components/Input/Input"
import { useEffect, useState } from "react"
import { StoreData } from "@/flux/entities/Store"
import useAuthStore from "@/flux/stores/AuthStore"
import Button from "@/components/Buttons/Button"
import { StoreService } from "@/flux/services/StoreS/StoreService"
import { createStoreAttemptAction, createStoreFailureAction, createStoreSuccessAction } from "@/flux/Actions/StoreActions"
import { useShopStore } from "@/flux/stores/useShopStore"
import { router } from "expo-router"

export default function CreateStore() {
    const { user } = useAuthStore()
    const { dispatch, loading, error } = useShopStore()

    const [storeData, setStoreData] = useState<Omit<StoreData, 'id' | 'created_at' | 'is_active'>>({
        name: '',
        description: '',
        owner: user?.id || ''
    })

    const checkDataToSend = async () => {
        dispatch(createStoreAttemptAction())
        const { data, error } = await StoreService.createStore(storeData)
        if (error) {
            dispatch(createStoreFailureAction(error))
        }

        if (data) {
            dispatch(createStoreSuccessAction(data))
            Alert.alert('Wheek | Éxito!', `La tienda ${storeData.name} se ha creado correctamente!`)
            router.replace('/dashboard')
        }
    }

    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])

    return (
        <LayoutScreen>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                <LogoPage />
                <CustomText>Crear Tienda</CustomText>
            </View>

            <View style={{ width: '100%', gap: 18, marginTop: 20 }}>
                <View style={{ gap: 10 }}>
                    <CustomText>Nombre de la tienda</CustomText>
                    <Input placeholder="Nombre de la tienda" 
                    value={storeData.name} 
                    onChangeText={(text) => setStoreData({ ...storeData, name: text })} />
                </View>

                <View style={{ gap: 10 }}>
                    <CustomText>Descripción de la tienda</CustomText>
                    <Input placeholder="Descripción de la tienda" multiline={true} 
                    value={storeData.description || ''} 
                    onChangeText={(text) => setStoreData({ ...storeData, description: text })} />
                </View>
            </View>

            <View style={{ width: '100%', marginTop: 20, position: 'absolute', bottom: 0 }}>
                <Button title='Crear Tienda' onPress={checkDataToSend} disabled={loading}/>
            </View>
        </LayoutScreen>
    )
}