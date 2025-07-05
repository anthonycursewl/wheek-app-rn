import { View, StyleSheet, Alert, ActivityIndicator } from "react-native"
import CustomText from "@components/CustomText/CustomText"
import LayoutScreen from "@components/Layout/LayoutScreen"
import LogoPage from "@components/LogoPage/LogoPage"
import Input from "@components/Input/Input"
import Button from "@components/Buttons/Button"
import { Picker } from "@react-native-picker/picker"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { useShopStore } from "@flux/stores/useShopStore"
import {useEffect, useState } from "react"
import { Provider } from "@flux/entities/Provider"
import { router } from "expo-router"
import { useProviderStore } from "@flux/stores/useProviderStore"
import { providerAttemptAction, providerSuccessAction, providerFailureAction } from "@flux/Actions/ProviderActions"
import { ProviderService } from "@flux/services/Providers/ProviderService"


export default function CreateProvider() {
    const { currentStore } = useGlobalStore()
    const { stores } = useShopStore()
    const [provider, setProvider] = useState<Omit<Provider, 'id' | 'created_at'>>({
        name: '',
        description: '',
        store_id: currentStore?.id || '',
    })

    const { dispatch, loading, error } = useProviderStore()

    const handleSumbit = async () => {
        dispatch(providerAttemptAction())
        const { data, error } = await ProviderService.createProvider(provider)
        if (data) {
            console.log(data)
            dispatch(providerSuccessAction(data.value))
            Alert.alert('Wheek | Éxito!', `El proveedor ${provider.name} se ha creado correctamente!`)
            router.back()
        }
        if (error) {
            dispatch(providerFailureAction(error))
        }
    }

    useEffect(() => {
        if (error) Alert.alert('Wheek | Error', error)
    }, [error])

    return (
        <LayoutScreen>
            <View style={{ width: '100%', alignItems: 'center', 
                justifyContent: 'space-between', flexDirection: 'row' }}>
                <LogoPage />
                <CustomText>Crear Proveedor</CustomText>
            </View>

            <View style={stylesRegisterCategory.containerFields}>
                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Nombre del proveedor</CustomText>
                    <Input placeholder="Nombre del proveedor.." 
                    value={provider.name}
                    onChangeText={(text) => setProvider({ ...provider, name: text })}/>
                </View>

                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Descripción (opcional)</CustomText>
                    <Input placeholder="Descripción del proveedor.." 
                    value={provider.description || ''}
                    onChangeText={(text) => setProvider({ ...provider, description: text })}/>
                </View>

                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Selecciona la tienda</CustomText>
                    <Picker selectedValue={provider.store_id} 
                    onValueChange={(itemValue) => setProvider({ ...provider, store_id: itemValue })}
                    style={stylesRegisterCategory.storePicker}>
                        {stores.map((store) => (
                            <Picker.Item 
                            key={store.id} 
                            label={store.name} 
                            value={store.id}
                            color="rgb(100, 100, 100)"
                            style={stylesRegisterCategory.storePickerItem}
                            />
                        ))}
                    </Picker>
                </View>

                <View style={{ width: '100%', marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        loading ? (
                            <ActivityIndicator size={"small"} color={'rgb(255, 152, 0)'} />
                        ) : (
                            <Button title="Crear proveedor" onPress={handleSumbit} style={{ width: '100%' }}/>
                        )
                    }
                </View>
            </View>


        </LayoutScreen>
    )
}

const stylesRegisterCategory = StyleSheet.create({
  containerFields: {
    width: '100%',
    gap: 15
  },
  containerButton: {
    width: '100%',
    marginTop: 12
  },
  storePicker: {
    backgroundColor: 'rgba(199, 189, 183, 0.08)',
    borderColor: 'rgba(80, 80, 80, 0.62)',
    borderWidth: 1,
    borderRadius: 5,
   },
   storePickerItem: {
    backgroundColor: 'rgba(199, 189, 183, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
   },
})