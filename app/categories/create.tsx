import { View, StyleSheet, Alert, ActivityIndicator } from "react-native"
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
import { categoryAttemptAction, categorySuccessAction, categoryFailureAction } from "@flux/Actions/CategoryAction"
import { CategoryService } from "@flux/services/Categories/CategoryService"
import { useRouter } from "expo-router"

export default function CreateCategory() {
    const router = useRouter()
    const { currentStore } = useGlobalStore()
    const { stores } = useShopStore()
    const [category, setCategory] = useState<Omit<Category, 'id' | 'created_at' | 'updated_at'>>({
        name: '',
        store_id: currentStore?.id || '',
    })

    const { dispatch, loading, error } = useCategoryStore()

    const handleSumbit = async () => {
        dispatch(categoryAttemptAction())
        const { data, error } = await CategoryService.createCategory(category)
        if (data) {
            dispatch(categorySuccessAction(data.value))
            Alert.alert('Wheek | Éxito!', `La categoría ${category.name} se ha creado correctamente!`)
            router.back()
        }
        if (error) {
            dispatch(categoryFailureAction(error))
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
                <CustomText>Crear Categoría</CustomText>
            </View>

            <View style={stylesRegisterCategory.containerFields}>
                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Nombre de la categoría</CustomText>
                    <Input placeholder="Nombre de la categoría" 
                    value={category.name}
                    onChangeText={(text) => setCategory({ ...category, name: text })}/>
                </View>

                <View style={stylesRegisterCategory.containerFields}>
                    <CustomText>Selecciona la tienda</CustomText>
                    <Picker selectedValue={category.store_id} 
                    onValueChange={(itemValue) => setCategory({ ...category, store_id: itemValue })}
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
                            <Button title="Crear categoría" onPress={handleSumbit} style={{ width: '100%' }}/>
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