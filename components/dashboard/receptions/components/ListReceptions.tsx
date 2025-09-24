import { receptionAttemptAction, receptionFailureAction, receptionGetAllSuccessAction, receptionLoadMoreSuccessAction } from "@flux/Actions/ReceptionActions";
import { ReceptionService } from "@flux/services/Receptions/ReceptionService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useReceptionStore } from "@flux/stores/useReceptionStore";
import { FlatList, Alert, View, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import LoadingIndicator from "./LoadingIndicator";
import React, { useEffect, useCallback, useState, Suspense, useRef } from "react";
import { Reception } from "@flux/entities/Reception";
import { Provider } from "@flux/entities/Provider";
import { IconAdjust } from "svgs/IconAdjust";
import { useFilters } from "@hooks/useFilter";
import { FilterModal } from "shared/components/FilterModal";
import { IconDate } from "svgs/IconDate";
import { IconProviders } from "svgs/IconProviders";
import { IconOrder } from "svgs/IconOrder";
import ProviderFilterModal from "./ProviderFilterModal";
const ReceptionCard = React.lazy(() => import("./ReceptionCard"));

const receptionsFilterConfig = [
    {
        title: 'Fecha de recepción',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Hoy', key: 'today' },
            { label: 'Esta semana', key: 'thisWeek' },
            { label: 'Este mes', key: 'thisMonth' },
            { label: 'Rango de fechas', key: 'dateRange', type: 'dateRange' },
        ]
    },
    {
        title: 'Proveedor',
        icon: <IconProviders width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Seleccionar proveedor', key: 'provider' },
        ]
    },
    {
        title: 'Estado de la recepción',
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
    }
];

export default function ListReceptions({ onPress }: { onPress: (reception: Reception) => void }) {
    const { currentStore } = useGlobalStore();
    const { receptions, skip, take, hasMore, dispatch, loading } = useReceptionStore();
    const [fc, setFc] = useState<number>(0);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
    const { filters, openFilterModal, showFilters, closeFilterModal, setFilters, queryParams } = useFilters({
        today: false, thisWeek: false, thisMonth: false, dateRange: { startDate: null, endDate: null }, deleted: false, dateDesc: true, provider: ''
    })

    const loadReceptions = useCallback(async (isRefresh = false) => {
        if (loading || !currentStore.id) return;
        if (!isRefresh && receptions.length > 0) return;
        if (isRefresh && receptions.length > 0 && !queryParams) return;

        dispatch(receptionAttemptAction());
        const { data, error } = await ReceptionService.getAllReceptions(currentStore.id, isRefresh ? 0 : skip, take, queryParams);

        if (error) {
            Alert.alert(error);
            dispatch(receptionFailureAction(error));
        }
        if (data) {
            dispatch(receptionGetAllSuccessAction(data));
        }
    }, [currentStore.id, skip, take, queryParams, dispatch, loading, receptions.length]);

    useEffect(() => {
        if (receptions.length === 0) {
            loadReceptions(true);
        }
    }, [fc]);

    const handleLoadMore = useCallback(async () => {
        if (!hasMore || loading || !currentStore.id) return;
        
        dispatch(receptionAttemptAction());
        const { data, error } = await ReceptionService.getAllReceptions(currentStore.id, receptions.length, take, queryParams);

        if (error) {
            Alert.alert(error);
            dispatch(receptionFailureAction(error));
        }
        if (data) {
            dispatch(receptionLoadMoreSuccessAction(data));
        }
    }, [hasMore, loading, currentStore.id, skip, take, queryParams, dispatch]);

    const handleRefresh = useCallback(() => {
        setFc(prevFc => prevFc + 1);
    }, []);
    
    const handlePressCard = useCallback((item: Reception) => {
        onPress(item);
    }, [onPress]);

    const handleProviderSelect = useCallback((provider: Provider | null) => {
        setSelectedProvider(provider);
        if (provider) {
            setFilters({ ...filters, provider: provider.id });
        } else {
            const { provider, ...restFilters } = filters;
            setFilters(restFilters);
        }
    }, [filters, setFilters]);

    const handleOpenProviderModal = useCallback(() => {
        setShowProviderModal(true);
    }, []);

    const handleCloseProviderModal = useCallback(() => {
        setShowProviderModal(false);
    }, []);

    const renderFooter = useCallback(() => {
        if (loading && receptions.length > 0) {
            return <LoadingIndicator type="footer" />;
        }
        if (!hasMore && receptions.length > 0) {
            return (
                <View style={{ paddingTop: 10, alignItems: 'center' }}>
                    <CustomText style={{ color: 'gray', fontSize: 12 }}>
                        No hay más recepciones para cargar.
                    </CustomText>
                </View>
            );
        }
        return null;
    }, [loading, hasMore, receptions.length]);

    const lastQueryParams = useRef(queryParams);
    useEffect(() => {
        const dbc = setTimeout(() => {
            if (queryParams !== lastQueryParams.current && (receptions.length > 0 || queryParams)) {
                console.log(queryParams)
                loadReceptions(true);
                lastQueryParams.current = queryParams;
            }
        }, 500);

        return () => clearTimeout(dbc);
    }, [queryParams, receptions.length]);

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
                    <View style={styles.skeletonUserProvider}>
                        <View style={styles.skeletonUserInfo} />
                        <View style={styles.skeletonProviderInfo} />
                    </View>
                    <View style={styles.skeletonFooter}>
                        <View style={styles.skeletonItems} />
                        <View style={styles.skeletonTotal} />
                    </View>
                </View>
            </View>
        );
    });
    
    const renderItem = useCallback(({ item }: { item: Reception }) => (
        <Suspense fallback={<CardFallBack />}> 
            <ReceptionCard reception={item} onPress={handlePressCard} />
        </Suspense>
    ), [handlePressCard]);

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
        <View style={{ height: '92%'}}>
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 15, paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<HeaderFilter />}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                            No hay recepciones disponibles
                        </CustomText>
                    </View>
                )}
                data={receptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={handleLoadMore}
                onRefresh={handleRefresh}
                refreshing={loading && receptions.length > 0}
                onEndReachedThreshold={0.5}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={11}
            />

            <FilterModal
                visible={showFilters}
                onClose={closeFilterModal}
                filterConfig={receptionsFilterConfig}
                appliedFilters={filters}
                onFiltersChange={setFilters}
                onProviderFilterPress={handleOpenProviderModal}
            />

            <ProviderFilterModal
                visible={showProviderModal}
                onClose={handleCloseProviderModal}
                onProviderSelect={handleProviderSelect}
                selectedProvider={selectedProvider}
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
    cardFallback: {
        marginBottom: 15,
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
    skeletonUserProvider: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    skeletonUserInfo: {
        width: 100,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
    },
    skeletonProviderInfo: {
        width: 100,
        height: 32,
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
    skeletonItems: {
        width: 80,
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
});