import { Category } from "@flux/entities/Category";
import CustomText from "@components/CustomText/CustomText";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { IconCategories } from "svgs/IconCategories";
import { useMemo, useCallback } from "react";
import IconArrow from "svgs/IconArrow";

interface CategoryItemProps {
    item: Category;
    onSelectCategory: (item: Category) => void;
    onClose?: () => void;
}

export const CategoryItem = ({ item, onSelectCategory, onClose }: CategoryItemProps) => {
    const formattedDate = useMemo(() => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(item.created_at).toLocaleDateString('es-ES', options);
    }, [item.created_at]);

    const handlePress = useCallback(() => {
        onSelectCategory(item);
        onClose?.();
    }, [onSelectCategory, onClose, item]);

    return (
        <TouchableOpacity 
            style={styles.categoryCard}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.categoryIcon}>
                <IconCategories width={24} height={24} fill="rgb(24, 22, 26)" />
            </View>

            <View style={styles.categoryInfo}>
                <CustomText style={styles.categoryName}>
                    {item.name}
                </CustomText>
                <CustomText style={styles.categoryDate}>
                    {formattedDate}
                </CustomText>
            </View>
            
            <View style={styles.arrowContainer}>
                <IconArrow width={20} height={20} fill="rgb(161, 161, 161)" transform="rotate(180)" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 72,
        borderWidth: 1,
        borderColor: 'rgb(223, 223, 223)',
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 24,
    },
    categoryDate: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    arrowContainer: {
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 20,
        color: '#D1D5DB',
        fontWeight: '300',
    },
});