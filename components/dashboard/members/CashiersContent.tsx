import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import CashiersList from '../../../app/members/CashiersList';

const CashiersContent: React.FC = () => {
    const handleAddCashier = () => {
        Alert.alert('Agregar Cajero', 'Funcionalidad para agregar nuevos cajeros próximamente');
    };

    return (
        <View style={styles.contentContainer}>
            <CashiersList onAddCashier={handleAddCashier} />
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});

export default CashiersContent;
