import { View, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";


export const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailRow}>
        <CustomText style={styles.detailLabel}>{label}</CustomText>
        <CustomText style={styles.detailValue}>{value}</CustomText>
    </View>
);

const styles = StyleSheet.create({
    detailRow: {
        gap: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingVertical: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        color: '#111',
    }
})