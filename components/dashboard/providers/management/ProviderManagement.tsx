import { View, FlatList, ActivityIndicator } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useEffect } from "react";
import { getAllProvidersAttemptAction, getAllProvidersFailureAction, getAllProvidersSuccessAction } from "@flux/Actions/ProviderActions";
import { ProviderService } from "@flux/services/Providers/ProviderService";
import { ProviderItem } from "../components/ProviderItem"; 

export default function ProviderManagement() {
    const { dispatch, providers, loading, error, hasMore, page, limit, resetPagination } = useProviderStore()
    const { currentStore } = useGlobalStore()
    
    useEffect(() => {
        const verifyStore = async () => {
          if (!hasMore || loading || providers.length !== 0) return;
          dispatch(getAllProvidersAttemptAction())
          const { data, error } = await ProviderService.getAllProviders(currentStore.id, page, limit) 
    
          if (error) {
            dispatch(getAllProvidersFailureAction(error))
          }
    
          if (data) {
            dispatch(getAllProvidersSuccessAction(data.value))
          }
        };
        
        verifyStore();
      }, [currentStore, page]);

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
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ width: '100%', marginTop: 15, gap: 10 }}>
                <Button title="Crear proveedor" 
                onPress={() => router.push('/providers/create')}/>
                
                {loading && (
                    <ActivityIndicator size="large" color="blue" />
                )}
                
                {error && (
                    <CustomText style={{ color: 'red' }}>{error}</CustomText>
                )}
                
                <FlatList 
                data={providers}
                contentContainerStyle={{ gap: 0 }}
                style={{ height: '92%' }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onRefresh={() => {
                    resetPagination()
                    }}
                refreshing={loading && page === 1}
                onEndReached={() => {handleLoadMore()}}
                onEndReachedThreshold={0.1}
                renderItem={({item}) => (
                    <ProviderItem item={item} />
                )}
                />
            </View>
        </View>
    );
}