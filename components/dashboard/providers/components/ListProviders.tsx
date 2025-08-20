import { DimensionValue, FlatList, View } from "react-native";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useEffect } from "react";
import { getAllProvidersAttemptAction, getAllProvidersFailureAction, getAllProvidersSuccessAction } from "@flux/Actions/ProviderActions";
import { ProviderService } from "@flux/services/Providers/ProviderService";
import { ProviderItem } from "./ProviderItem";
import { Provider } from "@flux/entities/Provider";
import FooterComponentList from "shared/components/FooterComponentList";

export default function ListProviders({ height, onSelectProvider }: { height?: DimensionValue | undefined, onSelectProvider: (item: Provider) => void}) {
    const { dispatch, providers, loading, hasMore, page, limit, clearStore } = useProviderStore()
    const { currentStore } = useGlobalStore()

    const getAllProviders = async () => {
        if (providers.length !== 0) return;
        dispatch(getAllProvidersAttemptAction())
        const { data, error } = await ProviderService.getAllProviders(currentStore.id, page, limit)

        if (error) {
            dispatch(getAllProvidersFailureAction(error))
        }

        if (data) {
            dispatch(getAllProvidersSuccessAction(data.value))
        }
    };

    useEffect(() => {
        getAllProviders();
    }, [currentStore]);

    const handleLoadMore = async () => {
        if (!hasMore || loading) return;
        dispatch(getAllProvidersAttemptAction())
        const { data, error } = await ProviderService.getAllProviders(currentStore.id, page, limit)

        if (error) {
            dispatch(getAllProvidersFailureAction(error))
        }
        if (data) {
            dispatch(getAllProvidersSuccessAction(data.value))
        }
    }

    return (
        <View>
            <FlatList
                data={providers}
                contentContainerStyle={{ gap: 0 }}
                style={{ height: height || '92%' }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onRefresh={() => {clearStore()}}
                refreshing={loading && page === 1}
                onEndReached={() => { handleLoadMore() }}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                    <ProviderItem item={item} onClose={() => { }} onSelectProvider={(item) => onSelectProvider(item)} />
                )}
                ListFooterComponent={
                    <FooterComponentList 
                        message="Has llegado al final de la lista."
                        isVisible={hasMore}
                    /> 
                }
            />
        </View>
    )
}