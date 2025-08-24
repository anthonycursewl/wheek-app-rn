import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import Button from '@components/Buttons/Button';
import CustomText from '@components/CustomText/CustomText';

interface Role {
    id: string;
    name: string;
}

interface Store {
    id: string;
    name: string;
}

const MOCK_STORES: Store[] = [
  { id: '1', name: 'Tienda A' },
  { id: '2', name: 'Tienda B' },
  { id: '3', name: 'Tienda C' },
  { id: '4', name: 'Tienda D' }, 
  { id: '5', name: 'Tienda E' }, 
];

const MOCK_ROLES: { [key: string]: Role[] } = {
  '1': [{ id: 'r1', name: 'Admin' }, { id: 'r2', name: 'Vendedor' }],
  '2': [{ id: 'r3', name: 'Manager' }, { id: 'r4', name: 'Cajero' }],
  '3': [{ id: 'r5', name: 'Supervisor' }],
  '4': [], 
  '5': [{ id: 'r6', name: 'Reponedor' }, { id: 'r7', name: 'Seguridad' }],
};

interface StoreSelectorProps {
    stores: Store[];
    selectedStore: string;
    onSelectStore: (storeId: string) => void;
}

/**
 * Componente optimizado para seleccionar una tienda.
 * Usa un FlatList horizontal para mejor rendimiento y escalabilidad.
 */
const StoreSelector = React.memo(({ stores, selectedStore, onSelectStore }: StoreSelectorProps) => {
    const renderStore: ListRenderItem<Store> = ({ item }) => {
        const isSelected = item.id === selectedStore;
        return (
            <TouchableOpacity
                style={[styles.storeButton, isSelected && styles.selectedStoreButton]}
                onPress={() => onSelectStore(item.id)}
            >
                <CustomText style={[styles.storeButtonText]}>
                    {item.name}
                </CustomText>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                data={stores}
                renderItem={renderStore}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storeSelectorContainer}
            />
        </View>
    );
});


interface RoleCardProps {
    role: Role;
}

/**
 * Componente para mostrar la información de un rol en formato de tarjeta.
 * Memoizado para evitar re-renderizados innecesarios.
 */
const RoleCard = React.memo(({ role }: RoleCardProps) => (
    <View style={styles.roleCard}>
        <CustomText style={styles.roleName}>{role.name}</CustomText>
    </View>
));

export default function RolesManagement() {
    const [selectedStore, setSelectedStore] = useState<string>(MOCK_STORES[0].id);

    const handleSelectStore = useCallback((storeId: string) => {
        setSelectedStore(storeId);
    }, []);

    const rolesForSelectedStore = useMemo(() => MOCK_ROLES[selectedStore] || [], [selectedStore]);

    const renderRole: ListRenderItem<Role> = ({ item }) => <RoleCard role={item} />;

    return (
        <View style={styles.container}>
            <Button title="Crear role" onPress={() => console.log("buenas tardes")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    storeSelectorContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    storeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    selectedStoreButton: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    storeButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    selectedStoreButtonText: {
        color: '#fff',
    },
    roleListContainer: {
        paddingHorizontal: 16,
    },
    roleCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, 
    },
    roleName: {
        fontSize: 16,
        fontWeight: '500',
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});