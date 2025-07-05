import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { Provider } from "@flux/entities/Provider";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useEffect } from "react";
import { getAllProvidersAttemptAction, getAllProvidersFailureAction, getAllProvidersSuccessAction } from "@flux/Actions/ProviderActions";
import { ProviderService } from "@flux/services/Providers/ProviderService";

const ProviderItem = ({ item }: { item: Provider }) => {
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    useEffect(() => {
        console.log(item)
    }, [])

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <CustomText style={styles.avatarText}>
                        {item.name.charAt(0).toUpperCase()}
                    </CustomText>
                </View>
                <View style={styles.headerText}>
                    <View style={styles.nameWrapper}>
                        <CustomText style={styles.name}>
                            {item.name}
                        </CustomText>
                    </View>
                    <CustomText style={styles.status}>
                        {item.is_active !== false ? 'Activo' : 'Inactivo'}
                    </CustomText>
                </View>
            </View>
            
            {item.description && (
                <View style={styles.descriptionContainer}>
                    <CustomText style={styles.description}>
                        {item.description}
                    </CustomText>
                </View>
            )}
            
            <View style={styles.footer}>
                <View style={styles.footerSection}>
                    <CustomText style={styles.footerLabel}>Creado el:</CustomText>
                    <CustomText style={styles.footerText}>
                        {formatDate(item.created_at)}
                    </CustomText>
                </View>
                
                <View style={styles.contactInfo}>
                    <CustomText style={styles.contact}>
                        📞 {item.contact_phone}
                    </CustomText>
                    <CustomText style={styles.contact}>
                        ✉️ {item.contact_email}
                    </CustomText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
    },
    nameWrapper: {
        flex: 1,
        marginRight: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    status: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
    },
    descriptionContainer: {
        marginBottom: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    description: {
        fontSize: 14,
        color: '#34495e',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    footerSection: {
        flex: 1,
    },
    footerLabel: {
        fontSize: 10,
        color: '#95a5a6',
        marginBottom: 2,
    },
    footerText: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    contactInfo: {
        alignItems: 'flex-end',
    },
    contact: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 2,
    },
})

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
                onEndReached={() => {console.log('end reached')}}
                onEndReachedThreshold={0.1}
                renderItem={({item}) => (
                    <ProviderItem item={item} />
                )}
                />
            </View>
        </View>
    );
}