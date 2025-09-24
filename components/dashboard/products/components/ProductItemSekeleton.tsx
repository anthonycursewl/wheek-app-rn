import React from 'react';
import { View, StyleSheet } from 'react-native';

const Placeholder = ({ style }: { style?: any }) => (
    <View style={[styles.placeholder, style]} />
);

export default function ProductItemSkeleton() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Placeholder style={{ width: '60%', height: 20 }} />
                <Placeholder style={{ width: 40, height: 20 }} />
            </View>
            <View style={styles.row}>
                <Placeholder style={{ width: '40%', height: 14 }} />
                <Placeholder style={{ width: '25%', height: 14 }} />
            </View>
            <View style={styles.row}>
                <Placeholder style={{ width: '35%', height: 14 }} />
                <Placeholder style={{ width: '30%', height: 14 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 12,
        padding: 16,
    },
    placeholder: {
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },
});