import { View, FlatList, DimensionValue, ActivityIndicator, Image } from "react-native"
import { RoleItem } from "./RoleItem"
import { useRoleStore } from "@flux/stores/useRoleStore"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { roleAttemptAction, roleFailureAction, roleSuccessAllAction } from "@flux/Actions/RoleActions"
import { RoleService } from "@flux/services/Roles/RoleService"
import { useEffect, useState } from "react"
import { Role } from "@flux/entities/Role"

export default function ListRoles({ height, onPress }: { height: DimensionValue, onPress: (item: Role) => void }) {
    const { dispatch, skip, take, roles, hasMore, clearStore, loading } = useRoleStore();
    const { currentStore } = useGlobalStore();
    const [fcd, setFcd] = useState(0)

    const getAllRoles = async () => {
        if (loading || roles.length !== 0) return;
        
        dispatch(roleAttemptAction());
        const { data, error } = await RoleService.getAllRoles(currentStore.id, take, skip);
        
        if (error) return dispatch(roleFailureAction(error));
        if (data) return dispatch(roleSuccessAllAction(data, false));
    };

    useEffect(() => {
        getAllRoles();
    }, [fcd]);

    const handleRefresh = () => {
        clearStore();
        setFcd(fcd + 1);
    };

    const handleLoadMore = async () => {
        if (!hasMore || loading) return;
        dispatch(roleAttemptAction())
        const { data, error } = await RoleService.getAllRoles(currentStore.id, take, roles.length)
        if (error) return dispatch(roleFailureAction(error))
        if (data) return dispatch(roleSuccessAllAction(data, false))
    };
    
    return (
        <View style={{ height: height, marginTop: 16, position: 'relative' }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
                data={roles}
                renderItem={({ item }) => <RoleItem item={item} onPress={() => onPress(item)} />}
                keyExtractor={(item) => item.id}
                onEndReached={() => {handleLoadMore()}}
                onEndReachedThreshold={0.1}
                onRefresh={handleRefresh}
                refreshing={loading && roles.length === 0}
            />

            {loading && roles.length !== 0 && 
            <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 60, 
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
                borderWidth: 1,
                backgroundColor: 'rgb(245, 245, 245)',
                borderColor: 'rgb(173, 156, 199)',
                borderStyle: 'dashed',
                padding: 20,
                pointerEvents: 'none',   
                }}>
                    <Image source={require('@assets/images/wheek/wheek.png')} style={{ width: 80, height: 25, objectFit: 'contain' }} />
                    <ActivityIndicator size="small" color="rgb(136, 111, 207)" />
            </View>
            }
        </View>
    )
}