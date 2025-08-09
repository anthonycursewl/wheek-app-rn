import { FlatList, View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useCategoryStore } from "@flux/stores/useCategoryStore";
import { CategoryService } from "@flux/services/Categories/CategoryService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useEffect } from "react"
import { categoryAttemptAction, categoryFailureAction, categorySuccessAllAction } from "@flux/Actions/CategoryAction";
import { CategoryItem } from "../components/CategoryItem";

export default function CategoryManagement() {
    const { categories, loading, error, dispatch, skip, take, hasMore } = useCategoryStore()
    const { currentStore } = useGlobalStore()

    const getAllCategories = async () => {
        if (loading || !hasMore || categories.length !== 0) return;
        dispatch(categoryAttemptAction())
        const { data, error } = await CategoryService.getAllCategories(currentStore.id, skip, take)
        if (error) {
            dispatch(categoryFailureAction(error))
        }
        if (data) {
            dispatch(categorySuccessAllAction(data))
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ width: '100%', marginTop: 20, gap: 10 }}>
                <Button title="Crear categoría" 
                onPress={() => router.push('/categories/create')}/>

                {error && <CustomText style={{ color: 'red' }}>{error}</CustomText>}

                <FlatList
                contentContainerStyle={{ gap: 15 }}
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CategoryItem item={item} onSelectCategory={() => {console.log(item)}} />}
                onEndReached={() => {
                    getAllCategories()
                }}
                onEndReachedThreshold={0.1}
                />
            </View>

        </View>
    );
}