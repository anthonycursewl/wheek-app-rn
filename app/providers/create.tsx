import { View, StyleSheet, ActivityIndicator, Switch } from "react-native"
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
import { router, useLocalSearchParams } from "expo-router"
import { useProviderStore } from "@flux/stores/useProviderStore"
import { providerAttemptAction, providerSuccessAction, providerFailureAction, updateProviderSuccessAction } from "@flux/Actions/ProviderActions"
import { ProviderService } from "@flux/services/Providers/ProviderService"
import { useAlert } from "shared/hooks/useAlert"
import CustomAlert from "shared/components/CustomAlert"
import IconCross from "svgs/IconCross"

export default function CreateProvider() {
    const { currentStore } = useGlobalStore()
    const { stores } = useShopStore()
    const { alertState, hideAlert, showSuccess, showError} = useAlert()
    // obtener el proveedor seleccionado desde la lista de proveedores
    // Más tarde se usara para todos los casos de actualizción.
    const { selectedProvider, setSelectedProvider } = useProviderStore()

    // obtener el modo en el que se esta haciendo la acción
    const { mode } = useLocalSearchParams<{ mode: string }>()

    const [provider, setProvider] = useState<Omit<Provider, 'created_at' | 'updated_at' | 'deleted_at'>>({
        id: '',
        name: '',
        description: '',
        store_id: currentStore?.id || '',
        contact_phone: '',
        contact_email: '',
        is_active: true,
    })

    const { dispatch, loading } = useProviderStore()

    const handleSumbit = async () => {
        dispatch(providerAttemptAction())
        const { data, error } = await ProviderService.createProvider(provider)
        if (data) {
            dispatch(providerSuccessAction(data))
            showSuccess(`El proveedor ${provider.name} se ha creado correctamente!`)
            router.back()
        }
        if (error) {
            showError(error)
            dispatch(providerFailureAction(error))
        }
    }

    const handleUpdate = async () => {
        if (!provider.id) return;
        dispatch(providerAttemptAction())
        const { data, error } = await ProviderService.update(provider, currentStore?.id || '')
        if (data) {
            dispatch(updateProviderSuccessAction(data))
            showSuccess(`El proveedor ${provider.name} se ha actualizado correctamente!`, {
                requiresConfirmation: true,
                onConfirm: () => {
                    router.back()
                    setSelectedProvider(data)
                    console.log(data)
                }
            })
        }
        if (error) {
            showError(error)
            dispatch(providerFailureAction(error))
            return
        }
    }

    useEffect(() => {
        if (mode === 'update') {
            setProvider(selectedProvider as Omit<Provider, 'created_at' | 'updated_at' | 'deleted_at'>)
        }

        return () => {
            setProvider({
                id: '',
                name: '',
                description: '',
                store_id: currentStore?.id || '',
                contact_phone: '',
                contact_email: '',
                is_active: true,
            })

            dispatch(providerFailureAction(''))
        }       
    }, [mode])

    const colorInSwitch = provider.is_active ? 'rgba(111, 243, 166, 0.88)' : 'rgba(255, 194, 194, 0.88)'
    const colorFont = provider.is_active ? 'rgb(27, 160, 82)' : 'rgb(201, 50, 50)'

    return (
        <>
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
                    <CustomText>Correo del proveedor</CustomText>
                    <Input placeholder="Correo del proveedor.." 
                    value={provider.contact_email || ''}
                    onChangeText={(text) => setProvider({ ...provider, contact_email: text })}/>
                </View>

                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Telefono del proveedor</CustomText>
                    <Input placeholder="Telefono del proveedor.." 
                    value={provider.contact_phone || ''}
                    onChangeText={(text) => setProvider({ ...provider, contact_phone: text })}/>
                </View>

                <View>
                    <CustomText>Estado del proveedor</CustomText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'space-between' }}>
                        <CustomText style={{ 
                            backgroundColor: colorInSwitch,
                            color: colorFont,
                            paddingHorizontal: 10, 
                            paddingVertical: 4, 
                            borderRadius: 15 }}>
                                {provider.is_active ? 'Activo' : 'Inactivo'}
                            </CustomText>
                        <Switch
                        value={provider.is_active}
                        onValueChange={(value) => setProvider({ ...provider, is_active: value })}
                        />
                    </View>
                </View>
                
                {
                    mode === 'create' ? (
                        <CustomText style={{ fontSize: 16, color: 'gray', marginBottom: 10 }}>
                            Se está creando el registro en la tienda actual: <CustomText style={{ fontWeight: 'bold' }}>{currentStore?.name}</CustomText>
                        </CustomText>
                    ) : 
                    <>
                        <CustomText>Tienda Asignada</CustomText>
                        <View 
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 5,
                                borderColor:'rgba(226, 60, 60, 0.74)', 
                                borderWidth: 1, borderRadius: 15, padding: 10, borderStyle: 'dashed' }}>
                                <IconCross height={12} width={12} fill={'rgb(202, 50, 50)'} />
                                <CustomText style={{ fontSize: 12, color: 'rgb(202, 50, 50)' }}>
                                    El proveedor no puede ser cambiado de tienda.
                                    </CustomText>
                        </View>
                        <Input placeholder="Tienda Asignada"
                            value={stores.find((store) => store.id === provider.store_id)?.name || ''}
                            editable={false}
                        />
                    </>
                }

                <View style={{ width: '100%', marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        loading ? (
                            <ActivityIndicator size={"small"} color={'rgb(255, 152, 0)'} />
                        ) : (
                            mode === 'update' ? (
                                <Button title="Actualizar proveedor" onPress={handleUpdate} style={{ width: '100%' }}/>
                            ) : (
                                <Button title="Crear proveedor" onPress={handleSumbit} style={{ width: '100%' }}/>
                            )
                        )
                    }
                </View>
            </View>


        </LayoutScreen>
        <CustomAlert {...alertState} onClose={hideAlert} />
        </>
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
