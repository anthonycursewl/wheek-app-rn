import { View, StyleSheet } from 'react-native';
import Button from '@components/Buttons/Button';    
import { useRoleStore } from '@flux/stores/useRoleStore';
import CustomText from '@components/CustomText/CustomText';
import { ActivityIndicator } from 'react-native-paper';
import ListRoles from '../components/ListRoles';
import { Role } from '@flux/entities/Role';
import { router } from 'expo-router'; 

export default function RolesManagement() {
    const { error, loading, roles } = useRoleStore()

    const handleTapOnRole = (item: Role) => {
        router.push(`/roles/RoleDetail?role=${encodeURIComponent(JSON.stringify(item))}`)
    }
    
    return (
        <View style={styles.container}>
            {error && <CustomText style={{ color: 'red', fontSize: 14 }}>{error}</CustomText>}
            <Button title="Crear role"  onPress={() => router.push('/roles/create?mode=create')}/>
            {loading && roles.length === 0 && <ActivityIndicator size="small" color="black" />}
            <ListRoles height={'92%'} onPress={(item: Role) => handleTapOnRole(item)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
});