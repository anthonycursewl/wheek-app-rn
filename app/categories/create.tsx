import { View, StyleSheet, ActivityIndicator } from "react-native"
import CustomText from "@components/CustomText/CustomText"
import LayoutScreen from "@components/Layout/LayoutScreen"
import LogoPage from "@components/LogoPage/LogoPage"
import Input from "@components/Input/Input"
import Button from "@components/Buttons/Button"
import { Picker } from "@react-native-picker/picker"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { useShopStore } from "@flux/stores/useShopStore"
import { useEffect, useState } from "react"
import { Category } from "@flux/entities/Category"
import { useCategoryStore } from "@flux/stores/useCategoryStore"
import { categoryAttemptAction, categorySuccessAction, categoryFailureAction, categorySuccessUpdateAction } from "@flux/Actions/CategoryAction"
import { CategoryService } from "@flux/services/Categories/CategoryService"
import { useLocalSearchParams, useRouter } from "expo-router"
import IconCross from "svgs/IconCross"
import CustomAlert from "shared/components/CustomAlert"
import { useAlert } from "shared/hooks/useAlert"

export default function CreateCategory() {
    const router = useRouter()
    const { currentStore } = useGlobalStore()
    const { stores } = useShopStore()
    const [category, setCategory] = useState<Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'deleted_at'>>({
        name: '',
        store_id: currentStore?.id || '',
    })
    const [categoryUpdate, setCategoryUpdate] = useState<Omit<Category, 'deleted_at'>   >({
        id: '',
        name: '',
        store_id: '',
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
    })
    const { alertState, showSuccess, showError, hideAlert } = useAlert()
    const { category: categoryRaw, mode } = useLocalSearchParams<{ category: string, mode: string }>()

    const { dispatch, loading } = useCategoryStore()

    const handleSumbit = async () => {
        dispatch(categoryAttemptAction())
        const { data, error } = await CategoryService.createCategory(category)
        if (data) {
            dispatch(categorySuccessAction(data))
            showSuccess(`La categoría ${category.name} se ha creado correctamente!`, {
                onClose: () => {
                    router.back()
                },
                icon: 'success'
            })
        }
        if (error) {
            showError(error, { icon: 'error' })
            dispatch(categoryFailureAction(error))
        }
    }

    const onClose = () => {
        hideAlert()
    }

    useEffect(() => {
        if (mode === 'update') {
            const categoryParsed: Category = JSON.parse(decodeURIComponent(categoryRaw))
            setCategory({
                name: categoryParsed.name,
                store_id: categoryParsed.store_id,
            })
            setCategoryUpdate(categoryParsed)
        }
    }, [categoryRaw, mode])
    
    const handleUpdateCategory = async () => {
        dispatch(categoryAttemptAction())
        const { data, error } = await CategoryService.updateCategory(categoryUpdate.id, { name: category.name, is_active: true, deleted_at: new Date() }, currentStore.id) 
        if (data) {
            dispatch(categorySuccessUpdateAction(data))
            showSuccess(`La categoría ${category.name} se ha actualizado correctamente!`, {
                onClose: () => {
                    router.back()
                    router.replace(`/categories/CategoryDetail?category=${encodeURIComponent(JSON.stringify(data))}`)
                },
                icon: 'success'
            })
        }
        if (error) {
            showError(error, { icon: 'error' })
            dispatch(categoryFailureAction(error))
        }
    }

    const titleButton = mode === 'update' ? 'Actualizar categoría' : 'Crear categoría'

    return (
        <>
        <LayoutScreen>
            <View style={{
                width: '100%', alignItems: 'center',
                justifyContent: 'space-between', flexDirection: 'row'
            }}>
                <LogoPage />
                <CustomText>Crear Categoría</CustomText>
            </View>

            <View style={stylesRegisterCategory.containerFields}>
                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Nombre de la categoría</CustomText>
                    <Input placeholder="Nombre de la categoría"
                        value={category.name}
                        onChangeText={(text) => setCategory({ ...category, name: text })} />
                </View>

                <View style={stylesRegisterCategory.containerFields}>
                    {
                        mode === 'update' ? (
                            <>
                            <CustomText>Tienda Asignada</CustomText>
                            <View 
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 5,
                                    borderColor:'rgba(226, 60, 60, 0.74)', 
                                    borderWidth: 1, borderRadius: 15, padding: 10, borderStyle: 'dashed' }}>
                                    <IconCross height={12} width={12} fill={'rgb(202, 50, 50)'} />
                                    <CustomText style={{ fontSize: 12, color: 'rgb(202, 50, 50)' }}>
                                        La categoría no puede ser cambiada de tienda.
                                    </CustomText>
                            </View>
                            <Input placeholder="Tienda"
                                value={stores.find((store) => store.id === category.store_id)?.name || ''}
                                editable={false}
                            />
                            </>
                        ) : (
                            <>
                                <CustomText style={{ fontSize: 16, color: 'gray' }}>
                                    Se está creando el registro en la tienda actual: <CustomText style={{ fontWeight: 'bold' }}>{currentStore?.name}</CustomText>
                                </CustomText>
                            </>
                        )
                    }
                </View>

                <View style={{ width: '100%', marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        loading ? (
                            <ActivityIndicator size={"small"} color={'rgb(255, 152, 0)'} />
                        ) : (
                            <Button title={titleButton} onPress={mode === 'update' ? handleUpdateCategory : handleSumbit} style={{ width: '100%' }} />
                        )
                    }
                </View>
            </View>
        </LayoutScreen>
    
        <CustomAlert {...alertState} onClose={onClose} />
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
