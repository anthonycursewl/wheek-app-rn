import { Alert, DimensionValue, View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { useInventoryStore } from "@flux/stores/useInventoryStore";
import { FlatList } from "react-native";
import InventoryCard from "./InventoryCard";
import { Inventory } from "@flux/entities/Inventory";
import { InventoryService } from "@flux/services/Inventory/InventoryService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { inventoryAttemptAction, inventoryFailureAction, inventoryGetAllSuccessAction } from "@flux/Actions/InventoryActions";
import { useEffect } from "react";
import { useState } from "react";

export const ListInventories = ({ onPress, height }: { onPress: (inventory: Inventory) => void, height: DimensionValue }) => {
    const { currentStore } = useGlobalStore()
    const { inventories, loading, hasMore, take, dispatch, clearStore } = useInventoryStore()
    const [fc, setFc] = useState<number>(0)

    const getAllInventories = async () => {
        if (inventories.length !== 0 || loading || !hasMore) return;
        
        dispatch(inventoryAttemptAction())
        const { data, error } = await InventoryService.getInventory(currentStore.id, inventories.length, take)
        if (error) {
            Alert.alert(error)
            dispatch(inventoryFailureAction(error))
        }
        if (data) return dispatch(inventoryGetAllSuccessAction(data))
    }

    useEffect(() => {
        getAllInventories()
    }, [fc])

    const handleLoadMore = () => {
        if (!hasMore || loading || inventories.length === 0) {
            console.log("[INVENTORIES] Petición rechazada. Razón:", { hasMore, loading, length: inventories.length })
            return
        };
        getAllInventories()
    }

    const handleRefresh = () => {
        clearStore()
        setFc(fc + 1)
    }

    return (
            <FlatList
                data={inventories}
                showsVerticalScrollIndicator={false}
                style={{ height: height }}
                contentContainerStyle={{ gap: 15, paddingBottom: 10 }}
                renderItem={({ item }) => (
                    <InventoryCard inventory={item} onPress={onPress}/>
                )}
                keyExtractor={(item) => item.id}
                onEndReached={handleLoadMore}
                onRefresh={handleRefresh}
                refreshing={loading}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <CustomText style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                            No hay inventarios disponibles
                        </CustomText>
                    </View>
                )}
            />
    )
}