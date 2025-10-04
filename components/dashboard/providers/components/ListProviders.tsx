import { DimensionValue, FlatList, StyleSheet, TouchableOpacity, View, RefreshControl } from "react-native";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useCallback, useEffect, useState, useRef } from "react";
import { getAllProvidersAttemptAction, getAllProvidersFailureAction, getAllProvidersSuccessAction, loadMoreProvidersSuccessAction } from "@flux/Actions/ProviderActions";
import { ProviderService } from "@flux/services/Providers/ProviderService";
import { ProviderItem } from "./ProviderItem";
import ProviderSkeleton from "./ProviderSkeleton";
import { Provider } from "@flux/entities/Provider";
import FooterComponentList from "shared/components/FooterComponentList";
import { FilterModal } from "shared/components/FilterModal";
import { useFilters } from "@hooks/useFilter";
import { IconDate } from "svgs/IconDate";
import { IconProviders } from "svgs/IconProviders";
import { IconOrder } from "svgs/IconOrder";
import { IconAdjust } from "svgs/IconAdjust";
import CustomText from "@components/CustomText/CustomText";

const providersFilterConfig = [
    {
        title: 'Fecha de creación',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Hoy', key: 'today' },
            { label: 'Esta semana', key: 'thisWeek' },
            { label: 'Este mes', key: 'thisMonth' },
        ]
    },
    {
        title: 'Estado del Proveedor',
        icon: <IconProviders width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Mostrar borrados', key: 'deleted' },
        ]
    },
    {
        title: 'Ordenar por fecha',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Más nuevo a más viejo', key: 'dateDesc' },
        ]
    },
    {
        title: 'Ordenar por nombre',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'A-Z', key: 'nameAsc' },
            { label: 'Z-A', key: 'nameDesc' },

        ]
    },
];

export default function ListProviders({ height, onSelectProvider }: { height?: DimensionValue | undefined, onSelectProvider: (item: Provider) => void}) {
    const { dispatch, providers, loading, hasMore, limit, error } = useProviderStore()
    const { currentStore } = useGlobalStore()
    const [refreshing, setRefreshing] = useState(false)
    const { openFilterModal, closeFilterModal, filters, setFilters, showFilters, queryParams } = useFilters({
        today: false, 
        thisWeek: false, 
        thisMonth: false, 
        deleted: false, 
        dateDesc: true, 
    })
    
    const hasMounted = useRef(false);
    const isFetching = useRef(false);
    const permissionError = useRef(false);

    const getAllProviders = useCallback(async (isRefresh = false) => {
        if (isFetching.current || permissionError.current) {
            return;
        }
        
        if (!isRefresh && providers.length > 0 && !hasMore) {
            return;
        }
        
        isFetching.current = true;
        
        try {
            dispatch(getAllProvidersAttemptAction())
            const { data, error: apiError } = await ProviderService.getAllProviders(currentStore.id, isRefresh ? 0 : providers.length, limit, queryParams)

            if (apiError) {
                // Check if it's a permission error (403 or similar)
                if (apiError.includes('Permisos insuficientes') || apiError.includes('permisos') || apiError.includes('403') || apiError.includes('permission')) {
                    permissionError.current = true;
                }
                dispatch(getAllProvidersFailureAction(apiError))
                return
            }

            if (data) {
                if (isRefresh) {
                    dispatch(getAllProvidersSuccessAction(data))
                } else {
                    dispatch(loadMoreProvidersSuccessAction(data))
                }
            }
        } catch (catchError) {
            dispatch(getAllProvidersFailureAction('Error inesperado al cargar proveedores'))
        } finally {
            isFetching.current = false;
            if (isRefresh) {
                setRefreshing(false);
            }
        }
    }, [currentStore.id, providers.length, limit, queryParams, hasMore, dispatch]);

    const handleRefresh = useCallback(async () => {
        permissionError.current = false; // Reset permission error on manual refresh
        setRefreshing(true);
        await getAllProviders(true);
    }, [getAllProviders]);

    const handleRetry = useCallback(() => {
        permissionError.current = false; // Reset permission error on manual retry
        getAllProviders(true);
    }, [getAllProviders]);

    useEffect(() => {
        if (!hasMounted.current && !permissionError.current) {
            hasMounted.current = true;
            getAllProviders(true);
        }
    }, [getAllProviders]);

    const handleLoadMore = useCallback(async () => {
        if (!hasMore || loading || isFetching.current || permissionError.current) return;
        
        try {
            dispatch(getAllProvidersAttemptAction())
            const { data, error: apiError } = await ProviderService.getAllProviders(currentStore.id, providers.length, limit, queryParams)

            if (apiError) {
                // Check if it's a permission error (403 or similar)
                if (apiError.includes('Permisos insuficientes') || apiError.includes('permisos') || apiError.includes('403') || apiError.includes('permission')) {
                    permissionError.current = true;
                }
                dispatch(getAllProvidersFailureAction(apiError))
                return
            }
            if (data) {
                dispatch(loadMoreProvidersSuccessAction(data))
            }
        } catch (catchError) {
            dispatch(getAllProvidersFailureAction('Error inesperado al cargar más proveedores'))
        }
    }, [dispatch, currentStore.id, providers.length, limit, hasMore, loading]);

    const lastQueryParams = useRef(queryParams);

    useEffect(() => {
        const dbc = setTimeout(() => {
            if (queryParams !== lastQueryParams.current && !isFetching.current && !permissionError.current) {
                getAllProviders(true); 
                lastQueryParams.current = queryParams;
            }
        }, 500);

        return () => clearTimeout(dbc)
    }, [queryParams, getAllProviders])

    const HeaderFilter = () => (
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <IconAdjust width={20} height={20} fill="#5E24FF" />
                <CustomText style={styles.filterText}>Filtros</CustomText>
            </View>
    
            <View>
                <CustomText style={{ color: 'gray', fontSize: 12 }}>
                    Aplicados: {Object.values(filters).filter(Boolean).length}
                </CustomText>
            </View>
        </TouchableOpacity>
    );



    // Render skeleton items when loading initial data
    const renderSkeletonItems = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <ProviderSkeleton key={`skeleton-${index}`} />
        ));
    };

    return (
        <View>
            <FlatList
                data={loading && providers.length === 0 ? [] : providers}
                ListHeaderComponent={<HeaderFilter />}
                contentContainerStyle={{ gap: 5 }}
                style={{ height: height || '92%' }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onEndReached={() => { handleLoadMore() }}
                onEndReachedThreshold={0.1}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                renderItem={({ item }) => (
                    <ProviderItem item={item} onClose={() => { }} onSelectProvider={(item) => onSelectProvider(item)} />
                )}
                ListFooterComponent={
                    <>
                        {loading && providers.length === 0 && renderSkeletonItems()}
                        <FooterComponentList 
                            message="Has llegado al final de la lista."
                            isVisible={hasMore}
                        /> 
                    </>
                }
                ListEmptyComponent={() => {
                    if (loading) {
                        return null; // Don't show empty state while loading
                    }
                    
                    if (error) {
                        return (
                            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
                                <CustomText style={{ color: '#ef4444', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
                                    Error: {error}
                                </CustomText>
                                <TouchableOpacity 
                                    style={{ 
                                        backgroundColor: '#5E24FF', 
                                        paddingHorizontal: 20, 
                                        paddingVertical: 10, 
                                        borderRadius: 8 
                                    }} 
                                    onPress={handleRetry}
                                >
                                    <CustomText style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                        Reintentar
                                    </CustomText>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    
                    if (providers.length === 0) {
                        return (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                                    No hay proveedores disponibles
                                </CustomText>
                            </View>
                        );
                    }
                    
                    return null;
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#5E24FF']}
                        tintColor="#5E24FF"
                    />
                }
            />

            <FilterModal 
                visible={showFilters}
                onClose={closeFilterModal}
                filterConfig={providersFilterConfig}
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
    },
})