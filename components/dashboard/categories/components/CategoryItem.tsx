import { Category } from "@flux/entities/Category";
import CustomText from "@components/CustomText/CustomText";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { IconCategories } from "svgs/IconCategories";

export const CategoryItem = ({ item, onSelectCategory, onClose }: { item: Category, onSelectCategory: (item: Category) => void, onClose?: () => void }) => {
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString('es-ES', options);
    };

    return (
        <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => {
                onSelectCategory(item)
                onClose && onClose()
            }}
        >
            <View style={styles.categoryIcon}>
                <IconCategories style={{ width: 38, height: 38 }} />
            </View>

            <View style={styles.categoryInfo}>
                <CustomText style={styles.categoryName}>{item.name}</CustomText>
                <CustomText style={styles.categoryDate}>Creada el {formatDate(item.created_at)}</CustomText>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    categoryCard: {
        backgroundColor: 'rgb(247, 247, 247)',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minHeight: 80,
        borderWidth: 1,
        borderColor: 'rgb(223, 223, 223)',
    },
    categoryIcon: {
        width: 45,
        height: 45,
        borderRadius: 20,
        backgroundColor: 'rgb(223, 223, 223)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 20,
        color: '#007AFF',
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 4,
    },
    categoryDate: {
        fontSize: 12,
        color: '#6B7280',
    },
});