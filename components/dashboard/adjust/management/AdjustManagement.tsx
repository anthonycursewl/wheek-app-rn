import React, { Suspense, useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Button from "@components/Buttons/Button";

// Custom debounce implementation
const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    const debounced = (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };

    debounced.cancel = () => {
        clearTimeout(timeout);
    };

    return debounced;
};

import { router } from "expo-router";
import CustomText from "@components/CustomText/CustomText";
import { useAdjustmentStore } from "@flux/stores/useAdjustmentStore";
import { AdjustmentService } from "@flux/services/Adjustments/AdjustmentService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useFilters } from "@hooks/useFilter";
import { IconDate } from "svgs/IconDate";
import { IconProviders } from "svgs/IconProviders";
import { IconOrder } from "svgs/IconOrder";
import { IconAdjust } from "svgs/IconAdjust";
import { FilterModal } from "shared/components/FilterModal";
const AdjustmentCard = React.lazy(() => import("../components/AdjustmentCard"));

const adjustmentFilterConfig = [
    {
        title: 'Fecha de ajuste',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Hoy', key: 'today' },
            { label: 'Esta semana', key: 'thisWeek' },
            { label: 'Este mes', key: 'thisMonth' },
        ]
    },
    {
        title: 'Rango de Fechas',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Rango de Fechas', key: 'adjustmentDateRange', type: 'dateRange' },
        ],
    },
    {
        title: 'Tipo de ajuste',
        icon: <IconProviders width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Dañado', key: 'DAMAGED' },
            { label: 'Perdido', key: 'LOST' },
            { label: 'Vencido', key: 'EXPIRED' },
            { label: 'Uso interno', key: 'INTERNAL_USE' },
            { label: 'Devolución a proveedor', key: 'RETURN_TO_SUPPLIER' },
            { label: 'Otro', key: 'OTHER' }
        ]
    },
    {
        title: 'Modo de Ordenamiento',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Fecha: Más nuevo a más viejo', key: 'dateDesc' },
        ]
    },
];

export default function AdjustManagement() {
    const { adjustments, error, loading, dispatch, take, skip, hasMore } = useAdjustmentStore()
    const { currentStore } = useGlobalStore()
    const { filters, setFilters, showFilters, openFilterModal, closeFilterModal, queryParams } = useFilters({
        today: false, thisWeek: false, thisMonth: false, deleted: false, dateDesc: true, adjustmentDateRange: { startDate: null, endDate: null }
    });
    
    const [refreshing, setRefreshing] = React.useState(false);
    const hasMounted = useRef(false);
    const isFetching = useRef(false);

    const handleTapOnCreateAdjust = useCallback(() => {
        router.push('/adjustments/create');
    }, []);

    const handleGetAllAdjustments = useCallback(async (isRefresh = false, currentQueryParams: string) => {
        if (isFetching.current) {
            return;
        }
        
        isFetching.current = true;
        
        try {
            dispatch({ type: 'ADJUSTMENT_ATTEMPT'})
            const { data, error: apiError } = await AdjustmentService.getAdjustments(currentStore.id, isRefresh ? 0 : skip, take, currentQueryParams)
            
            if (apiError) {
                dispatch({ type: 'ADJUSTMENT_FAILURE', payload: apiError })
                return
            }
            
            if (isRefresh) {
                dispatch({ type: 'ADJUSTMENT_FETCH_SUCCESS', payload: data! })
            } else {
                dispatch({ type: 'ADJUSTMENT_FETCH_MORE_SUCCESS', payload: data! })
            }
        } catch (catchError) {
            // Handle any unexpected errors
            dispatch({ type: 'ADJUSTMENT_FAILURE', payload: 'Error inesperado al cargar ajustes' })
        } finally {
            isFetching.current = false;
            if (isRefresh) {
                setRefreshing(false);
            }
        }
    }, [currentStore.id, skip, take, dispatch]);

    const handleLoadMore = useCallback(() => {
        // Only load more if not already loading, there's more data, not currently fetching, and there are existing adjustments
        if (!loading && hasMore && !isFetching.current && adjustments.length > 0) {
            handleGetAllAdjustments(false, queryParams);
        }
    }, [loading, hasMore, isFetching, adjustments.length, handleGetAllAdjustments, queryParams]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await handleGetAllAdjustments(true, queryParams);
    }, [handleGetAllAdjustments, queryParams]);

    const handleRetry = useCallback(() => {
        dispatch({ type: 'ADJUSTMENT_ATTEMPT' }); // Clear error and set loading before retrying
        handleGetAllAdjustments(true, queryParams);
    }, [handleGetAllAdjustments, dispatch, queryParams]);

    // Use a ref to always get the latest handleGetAllAdjustments without putting it in useEffect dependencies
    const latestHandleGetAllAdjustments = useRef(handleGetAllAdjustments);
    useEffect(() => {
        latestHandleGetAllAdjustments.current = handleGetAllAdjustments;
    }, [handleGetAllAdjustments]);

    // Create a ref to hold the debounced function
    const debouncedFetchAdjustmentsRef = useRef(
        debounce((currentQueryParams: string) => {
            latestHandleGetAllAdjustments.current(true, currentQueryParams);
        }, 500)
    );

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            latestHandleGetAllAdjustments.current(true, ''); // Initial fetch without debounce, with empty query params
        } else {
            // Fetch adjustments with debounce when queryParams change
            debouncedFetchAdjustmentsRef.current(queryParams);
        }

        // Cleanup debounce on unmount
        return () => {
            debouncedFetchAdjustmentsRef.current.cancel();
        };
    }, [queryParams]); // Only queryParams here to prevent re-running when handleGetAllAdjustments changes

    const CardFallBack = React.memo(() => {
        return (
            <View style={styles.cardFallback}>
                <View style={styles.cardSkeleton}>
                    <View style={styles.skeletonHeader}>
                        <View style={styles.skeletonBadge} />
                        <View style={styles.skeletonDate} />
                    </View>
                    <View style={styles.skeletonContent}>
                        <View style={styles.skeletonLine} />
                        <View style={styles.skeletonLineShort} />
                    </View>
                    <View style={styles.skeletonFooter}>
                        <View style={styles.skeletonUserInfo} />
                        <View style={styles.skeletonTotal} />
                    </View>
                </View>
            </View>
        );
    });

    const HeaderFilter = React.memo(() => {
            const appliedFiltersCount = Object.values(filters).filter(Boolean).length;
            
            return (
                <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <IconAdjust width={20} height={20} fill="#5E24FF" />
                        <CustomText style={styles.filterText}>Filtros</CustomText>
                    </View>
    
                    <View>
                        <CustomText style={{ color: 'gray', fontSize: 12 }}>
                            Aplicados: {appliedFiltersCount}
                        </CustomText>
                    </View>
                </TouchableOpacity>
            );
        });

    return (
        <>
        <View style={styles.container}>
            <View style={styles.content}>
                <Button title="Crear ajuste" onPress={handleTapOnCreateAdjust}/>

                <FlatList
                data={adjustments}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <Suspense fallback={<CardFallBack />}> 
                        <AdjustmentCard 
                            adjustment={item} 
                            onPress={(adjustment) => {
                                router.push({
                                    pathname: '/adjustments/AdjustmentDetail',
                                    params: { 
                                        adjustment: encodeURIComponent(JSON.stringify(adjustment)) 
                                    }
                                });
                            }} 
                            />
                    </Suspense>
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<HeaderFilter />}
                ListFooterComponent={() => (
                    loading && adjustments.length > 0 ? (
                        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                            <CustomText style={{ color: '#6b7280', fontSize: 14 }}>
                                Cargando más ajustes...
                            </CustomText>
                        </View>
                    ) : null
                )}
                ListEmptyComponent={() => {
                    if (loading) {
                        return null;
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
                    
                    if (adjustments.length === 0) {
                        return (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                                    No hay ajustes disponibles
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
        </View>
    </View>

        <FilterModal
            visible={showFilters}
            onClose={closeFilterModal}
            filterConfig={adjustmentFilterConfig}
            appliedFilters={filters}
            onFiltersChange={setFilters}
        />
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        gap: 10,
        marginTop: 15,
    },
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
        marginBottom: 14,
    },
    filterText: {
        color: '#5E24FF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Onest-Regular',
    },
    cardFallback: {
        marginBottom: 8,
    },
    cardSkeleton: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgb(230, 230, 230)',
        padding: 12,
    },
    skeletonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    skeletonBadge: {
        width: 80,
        height: 24,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
    },
    skeletonDate: {
        width: 60,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
    },
    skeletonContent: {
        marginBottom: 12,
    },
    skeletonLine: {
        width: '100%',
        height: 14,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
        marginBottom: 6,
    },
    skeletonLineShort: {
        width: '70%',
        height: 14,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
    },
    skeletonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    skeletonUserInfo: {
        width: 100,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
    },
    skeletonTotal: {
        width: 80,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
    },
});;
