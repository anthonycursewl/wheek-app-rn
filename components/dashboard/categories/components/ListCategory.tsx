import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native"
import { CategoryItem } from "./CategoryItem"
import { useCategoryStore } from "@flux/stores/useCategoryStore"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { categoryAttemptAction, categoryFailureAction, categoryRefreshSuccessAction, categoryLoadMoreSuccessAction } from "@flux/Actions/CategoryAction"
import { CategoryService } from "@flux/services/Categories/CategoryService"
import { useCallback, useEffect, useRef, useState } from "react"
import { DimensionValue } from "react-native"
import { Category } from "@flux/entities/Category"
import FooterComponentList from "shared/components/FooterComponentList"
import { FilterModal } from "shared/components/FilterModal"
import { useFilters } from "@hooks/useFilter"
import { IconDate } from "svgs/IconDate"
import { IconProviders } from "svgs/IconProviders"
import { IconOrder } from "svgs/IconOrder"
import CustomText from "@components/CustomText/CustomText"
import { IconAdjust } from "svgs/IconAdjust"
import { ActivityIndicator } from "react-native-paper"

const categoryFilterConfig = [
    {
        title: 'Fecha creación',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Hoy', key: 'today' },
            { label: 'Esta semana', key: 'thisWeek' },
            { label: 'Este mes', key: 'thisMonth' },
        ]
    },
    {
        title: 'Estado categoría',
        icon: <IconProviders width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Mostrar borrados', key: 'deleted' },
        ]
    },
    {
        title: 'Ordenar por fecha creación (ASC/DESC)',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Fecha: Más nuevo a más antiguo', key: 'dateDesc' },
        ]
    },
    {
        title: 'Ordenar por nombre (ASC/DESC)',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Nombre: A-Z', key: 'nameAsc' },
            { label: 'Nombre: Z-A', key: 'nameDesc' },
        ]
    }
];

const HeaderFilter = ({ onOpen, filterCount }: { onOpen: () => void, filterCount: number }) => (
    <TouchableOpacity onPress={onOpen} style={styles.filterButton}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IconAdjust width={20} height={20} fill="#5E24FF" />
            <CustomText style={styles.filterText}>Filtros</CustomText>
        </View>
        <CustomText style={{ color: 'gray', fontSize: 12 }}>
            Aplicados: {filterCount}
        </CustomText>
    </TouchableOpacity>
);


export default function ListCategory({ height, onSelectCategory }: { height?: DimensionValue, onSelectCategory: (item: Category) => void }) {
    const { categories, loading, error, dispatch, take, hasMore, clearStore } = useCategoryStore()
    const { currentStore } = useGlobalStore()

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(categories.length === 0);
    
    const lastLoadedParams = useRef<string | null>(null);
    const hasMounted = useRef(false);

    const { openFilterModal, closeFilterModal, showFilters, filters, setFilters, queryParams } = useFilters({
        today: false, thisWeek: false, thisMonth: false, deleted: false, dateDesc: true
    })

    const getAllCategories = useCallback(async (isRefresh = false) => {
        if (loading) return;

        dispatch(categoryAttemptAction());
        const offset = isRefresh ? 0 : categories.length;
        const { data, error } = await CategoryService.getAllCategories(currentStore.id, offset, take, queryParams);
        
        if (error) dispatch(categoryFailureAction(error));
        else if (data) dispatch(categoryRefreshSuccessAction(data)); console.log(`No entiendo la data: ${data}`)

        if (isInitialLoading) setIsInitialLoading(false);
    }, [loading, currentStore.id, take, queryParams, dispatch, clearStore, isInitialLoading, categories.length]);

    useEffect(() => {
        console.log(queryParams)
        const currentParamsString = JSON.stringify(queryParams);

        if (!hasMounted.current) {
            hasMounted.current = true;
            lastLoadedParams.current = currentParamsString;
            if (categories.length === 0) {
                getAllCategories(true);
            }
            return;
        }

        if (currentParamsString !== lastLoadedParams.current) {
            lastLoadedParams.current = currentParamsString;
            getAllCategories(true);
        }
    }, [queryParams]);

    const handleLoadMore = useCallback(async () => {
        if (!hasMore || loading) return;

        dispatch(categoryAttemptAction());
        const offset = categories.length;
        const { data, error } = await CategoryService.getAllCategories(currentStore.id, offset, take, queryParams);
        
        if (error) dispatch(categoryFailureAction(error));
        if (data) dispatch(categoryLoadMoreSuccessAction(data)); 
    }, [dispatch, currentStore.id, categories.length, take, hasMore, loading, queryParams]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        lastLoadedParams.current = JSON.stringify(queryParams);
        await getAllCategories(true);
        setIsRefreshing(false);
    };
    
    useEffect(() => {
        if (error) Alert.alert(error || 'Error al cargar las categorías')
        
        return () => dispatch(categoryFailureAction(''))
    }, [error])
    
    if (isInitialLoading) return <View style={{ height: height || '100%' }}><ActivityIndicator /></View>

    return (
        <View style={{ width: '100%' }}>
            <FlatList
                contentContainerStyle={{ gap: 15, paddingBottom: 15 }}
                data={categories}
                style={{ width: '100%', height: height || '100%' }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<HeaderFilter onOpen={openFilterModal} filterCount={Object.values(filters).filter(Boolean).length}/>}
                renderItem={({ item }) => <CategoryItem item={item} onSelectCategory={(item) => onSelectCategory(item)} />}
                onEndReached={() => {
                    handleLoadMore()
                }}
                onRefresh={() => handleRefresh()}
                refreshing={isRefreshing}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    <FooterComponentList message="Has llegado al final de la lista." isVisible={hasMore} />
                }
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                            No hay categorías disponibles
                        </CustomText>
                    </View>
                )}
                />

                <FilterModal 
                    visible={showFilters}
                    onClose={closeFilterModal}
                    filterConfig={categoryFilterConfig}
                    appliedFilters={filters}
                    onFiltersChange={setFilters}
                />
        </View> 
    )
}

const styles = StyleSheet.create({
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(244, 242, 253)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterText: {
        color: '#5E24FF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Onest-Regular',
    }
})