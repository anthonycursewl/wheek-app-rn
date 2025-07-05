import { FlatList, View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useCategoryStore } from "@flux/stores/useCategoryStore";

export default function CategoryManagement() {
    const { categories, loading, error } = useCategoryStore() 

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ width: '100%', marginTop: 20, gap: 10 }}>
                <Button title="Crear categoría" 
                onPress={() => router.push('/categories/create')}/>

                <FlatList 
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View>
                        <CustomText>{item.name}</CustomText>
                    </View>
                )}
                />
            </View>

        </View>
    );
}