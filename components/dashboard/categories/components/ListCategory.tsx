import { Alert, View } from "react-native"
import { FlatList } from "react-native"
import { CategoryItem } from "./CategoryItem"
import { useCategoryStore } from "@flux/stores/useCategoryStore"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { categoryAttemptAction, categoryFailureAction, categorySuccessAllAction } from "@flux/Actions/CategoryAction"
import { CategoryService } from "@flux/services/Categories/CategoryService"
import { useEffect } from "react"
import { DimensionValue } from "react-native"
import { Category } from "@flux/entities/Category"
import FooterComponentList from "shared/components/FooterComponentList"

export default function ListCategory({ height, onSelectCategory }: { height?: DimensionValue, onSelectCategory: (item: Category) => void }) {
    const { categories, loading, error, dispatch, skip, take, hasMore, clearStore } = useCategoryStore()
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

    const handleLoadMore = async () => {
        if (!hasMore || loading) return;

        dispatch(categoryAttemptAction())
        const { data, error } = await CategoryService.getAllCategories(currentStore.id, skip, take)
        if (error) {
            dispatch(categoryFailureAction(error))
            Alert.alert(error || 'Error al cargar las categorías')
        }
        if (data) {
            dispatch(categorySuccessAllAction(data)) 
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <View style={{ width: '100%' }}>
            <FlatList
                contentContainerStyle={{ gap: 15, paddingBottom: 15 }}
                data={categories}
                style={{ width: '100%', height: height || '100%' }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <CategoryItem item={item} onSelectCategory={(item) => onSelectCategory(item)} />}
                onEndReached={() => {
                    handleLoadMore()
                }}
                onRefresh={() => {
                    clearStore()
                    getAllCategories()
                }}
                refreshing={loading}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    <FooterComponentList message="Has llegado al final de la lista." isVisible={hasMore} />
                }
                />
        </View> 
    )
}