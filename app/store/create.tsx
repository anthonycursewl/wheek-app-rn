import LayoutScreen from "@components/Layout/LayoutScreen"
import CustomText from "@components/CustomText/CustomText"
import LogoPage from "@components/LogoPage/LogoPage"
import { View, StyleSheet } from "react-native"
import { Alert } from "react-native"

// components
import Input from "@components/Input/Input"
import { useEffect, useState } from "react"
import { StoreData } from "@flux/entities/Store"
import useAuthStore from "@flux/stores/AuthStore"
import Button from "@components/Buttons/Button"
import { StoreService } from "@flux/services/StoreS/StoreService"
import { createStoreAttemptAction, createStoreFailureAction, createStoreSuccessAction } from "@flux/Actions/StoreActions"
import { useShopStore } from "@flux/stores/useShopStore"
import { router } from "expo-router"

export default function CreateStore() {
    const { user } = useAuthStore()
    const { dispatch, loading, error } = useShopStore()

    /**
     * Skipping data because backend handle id generation and created_at field.
     */
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
            <View style={styles.headerContainer}>
                <LogoPage />
                <CustomText>Crear Tienda</CustomText>
            </View>

            <View style={styles.formContainer}>
                <View>
                    <CustomText>Estás creando esta tienda como <CustomText style={styles.userNameText}>{user?.name}</CustomText></CustomText>
                </View>

                <View style={styles.inputGroup}>
                    <CustomText>Nombre de la tienda</CustomText>
                    <Input placeholder="Nombre de la tienda" 
                    value={storeData.name} 
                    onChangeText={(name) => setStoreData((prev) => ({ ...prev, name }))} />
                </View>

                <View style={styles.inputGroup}>
                    <CustomText>Descripción de la tienda</CustomText>
                    <Input placeholder="Descripción de la tienda" multiline={true} 
                    value={storeData.description || ''} 
                    onChangeText={(description) => setStoreData((prev) => ({ ...prev, description }))} />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button title='Crear Tienda' onPress={checkDataToSend} disabled={loading}/>
            </View>
        </LayoutScreen>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%'
    },
    formContainer: {
        width: '100%',
        gap: 18,
        marginTop: 20
    },
    userNameText: {
        color: 'rgb(255, 152, 0)'
    },
    inputGroup: {
        gap: 10
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        position: 'absolute',
        bottom: 0
    }
})
