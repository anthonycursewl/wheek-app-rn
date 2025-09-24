import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProviderSkeleton() {
    return (
        <View style={styles.container}>
            <View style={styles.skeletonCard}>
                <View style={styles.skeletonHeader}>
                    <View style={styles.skeletonAvatar} />
                    <View style={styles.skeletonHeaderInfo}>
                        <View style={styles.skeletonTitle} />
                        <View style={styles.skeletonSubtitle} />
                    </View>
                </View>
                
                <View style={styles.skeletonContent}>
                    <View style={styles.skeletonRow}>
                        <View style={styles.skeletonLabel} />
                        <View style={styles.skeletonValue} />
                    </View>
                    <View style={styles.skeletonRow}>
                        <View style={styles.skeletonLabel} />
                        <View style={styles.skeletonValue} />
                    </View>
                    <View style={styles.skeletonRow}>
                        <View style={styles.skeletonLabel} />
                        <View style={styles.skeletonValue} />
                    </View>
                </View>
                
                <View style={styles.skeletonFooter}>
                    <View style={styles.skeletonButton} />
                    <View style={styles.skeletonButton} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    skeletonCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    skeletonAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f1f5f9',
    },
    skeletonHeaderInfo: {
        marginLeft: 12,
        flex: 1,
    },
    skeletonTitle: {
        height: 20,
        width: '60%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonSubtitle: {
        height: 14,
        width: '40%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
    },
    skeletonContent: {
        marginBottom: 16,
    },
    skeletonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    skeletonLabel: {
        height: 14,
        width: '30%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
    },
    skeletonValue: {
        height: 16,
        width: '50%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
    },
    skeletonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    skeletonButton: {
        height: 32,
        width: 80,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
    },
});
