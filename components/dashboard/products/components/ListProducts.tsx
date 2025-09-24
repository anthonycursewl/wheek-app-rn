import { DimensionValue, FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { useProductStore } from "@flux/stores/useProductStore";
import { Product } from "@flux/entities/Product";
import { Provider } from "@flux/entities/Provider";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGlobalStore } from "@flux/stores/useGlobalStore";

// Services & Actions
import { ProductService } from "@flux/services/Products/ProductService";
import { productCreateAttemptAction, productCreateFailureAction } from "@flux/Actions/ProductActions";

// Components
import FooterComponentList from "shared/components/FooterComponentList";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSekeleton";
import { IconAdjust } from "../../../../svgs/IconAdjust";
import CustomText from "@components/CustomText/CustomText";
import { IconDate } from "svgs/IconDate";
import { IconProviders } from "svgs/IconProviders";
import { IconOrder } from "svgs/IconOrder";
import { useFilters } from "hooks/useFilter";
import { FilterModal } from "shared/components/FilterModal";
import ProviderFilterModal from "../../receptions/components/ProviderFilterModal";

const productFilterConfig = [
    {
        title: 'Fecha',
        icon: <IconDate width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Hoy', key: 'today' },
            { label: 'Esta semana', key: 'thisWeek' },
            { label: 'Este mes', key: 'thisMonth' },
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
        title: 'Estado',
        icon: <IconProviders width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Mostrar borrados', key: 'deleted' },
        ]
    },
    {
        title: 'Ordenar',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Fecha: Más nuevo a más viejo', key: 'dateDesc' },
        ]
    },
    {
        title: 'Condición',
        icon: <IconOrder width={20} height={20} fill="rgb(146, 146, 146)"/>,
        items: [
            { label: 'Solo productos pesados. (KG)', key: 'KG' },
            { label: 'Solo unidades. (UND)', key: 'UND' },
        ]
    }
];

export default function ListProducts({ height, onPress: onProductPress }: { height: DimensionValue, onPress: (product: Product) => void }) {
    const { products, dispatch, take, hasMore, loading, clearStore } = useProductStore();
    const { currentStore } = useGlobalStore();
    
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(products.length === 0);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
    
    const lastLoadedParams = useRef<string | null>(null);
    const hasMounted = useRef(false);
    const debounceTimeout = useRef<number | null>(null);
    const DEBOUNCE_DELAY = 500;

    const { filters, setFilters, showFilters, openFilterModal, closeFilterModal, queryParams } = useFilters({
        today: false, thisWeek: false, thisMonth: false, deleted: false, dateDesc: true, provider: ''
    });

    const onPress = useCallback((product: Product) => {
        onProductPress(product);
    }, [onProductPress]);

    const getAllProductsData = useCallback(async (isRefresh = false) => {
        if (loading) return;
        if (isRefresh) clearStore();

        dispatch(productCreateAttemptAction());
        const offset = isRefresh ? 0 : products.length;
        const { data, error } = await ProductService.getAllProducts(currentStore.id, offset, take, queryParams);

        if (error) dispatch(productCreateFailureAction(error));
        else if (data) dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: { response: data, isRefreshing: isRefresh } });

        if (isInitialLoading) setIsInitialLoading(false);
    }, [loading, currentStore.id, take, queryParams, dispatch, clearStore, isInitialLoading]);

    useEffect(() => {
        const currentParamsString = JSON.stringify(queryParams);

        if (!hasMounted.current) {
            hasMounted.current = true;
            lastLoadedParams.current = currentParamsString;
            if (products.length === 0) {
                console.log("[PRODUCTS] Montaje inicial sin productos. Cargando...");
                getAllProductsData(true);
            } else {
                console.log("[PRODUCTS] Montaje con productos en memoria. Saltando petición.");
            }
            return;
        }

        if (currentParamsString !== lastLoadedParams.current) {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            debounceTimeout.current = setTimeout(() => {
                console.log("[PRODUCTS] Los filtros han cambiado. Recargando...");
                lastLoadedParams.current = currentParamsString;
                getAllProductsData(true);
            }, DEBOUNCE_DELAY);
        }

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [queryParams]);
            
    const handleLoadMore = async () => {
        if (loading || !hasMore) return;
        dispatch(productCreateAttemptAction());
        const offset = products.length;
        const { data, error } = await ProductService.getAllProducts(currentStore.id, offset, take, queryParams);
        if (error) dispatch(productCreateFailureAction(error));
        else if (data) dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: { response: data, isRefreshing: false } });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        lastLoadedParams.current = JSON.stringify(queryParams);
        await getAllProductsData(true);
        setIsRefreshing(false);
    };

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

    if (isInitialLoading) {
        return (
            <View>
                <HeaderFilter />
                <View style={{ paddingTop: 12 }}>
                    {[...Array(6)].map((_, index) => <ProductItemSkeleton key={index} />)}
                </View>
            </View>
        );
    }

    return (
        <>
            <FlatList
                data={products}
                style={{ height }}
                contentContainerStyle={{ rowGap: 14 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<HeaderFilter />}
                renderItem={({ item }) => (
                    <ProductItem product={item} onPress={onPress} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                ListFooterComponent={
                    <FooterComponentList 
                        message={'Has llegado al final de la lista.'} 
                        isVisible={hasMore && products.length > 0} 
                    />
                }
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                            No hay productos disponibles
                        </CustomText>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <FilterModal 
                visible={showFilters}
                onClose={closeFilterModal}
                filterConfig={productFilterConfig}
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
        </>
    );
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
});