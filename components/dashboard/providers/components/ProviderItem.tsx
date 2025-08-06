import { Provider } from "@flux/entities/Provider";
import CustomText from "@components/CustomText/CustomText";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export const ProviderItem = ({ item, short = false, onSelectProvider, onClose }: { item: Provider, short?: boolean, onSelectProvider: (id: string, name: string) => void, onClose?: () => void }) => {
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <TouchableOpacity onPress={() => {
            onSelectProvider(item.id, item.name)
            onClose && onClose()
        }}
        activeOpacity={0.9}
        >
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
                
                {!short && (
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
                )}
            </View>
        </TouchableOpacity>
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