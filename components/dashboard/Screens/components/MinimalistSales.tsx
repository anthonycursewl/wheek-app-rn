import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import IconArrow from "svgs/IconArrow";

// --- Datos de ejemplo (En una app real, vendrían de una API) ---
const mockSalesData = [
    { month: 'Septiembre', amount: 125.40, currency: 'USD', change: 5.2 },
    { month: 'Agosto', amount: 119.20, currency: 'USD', change: -1.5 },
    { month: 'Julio', amount: 121.00, currency: 'USD', change: 10.1 },
    { month: 'Septiembre', amount: 2450.50, currency: 'MXN', change: 8.3 },
    { month: 'Agosto', amount: 2262.10, currency: 'MXN', change: 2.1 },
    { month: 'Julio', amount: 2215.00, currency: 'MXN', change: -0.8 },
];

// --- Componente Principal ---
export const MinimalistSales = () => {
    // --- ESTADOS ---
    const [selectedDateFilter, setSelectedDateFilter] = useState('Este Mes');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [filteredData, setFilteredData] = useState<{ month: string; amount: number; currency: string; change: number; }[]>([]);
    const [totalSales, setTotalSales] = useState(0);

    // --- LÓGICA DE FILTRADO ---
    // Este efecto se ejecuta cada vez que cambia el filtro de fecha o divisa
    useEffect(() => {
        // Aquí iría tu lógica de filtrado real. Por ahora, simulamos con los datos mock.
        const data = mockSalesData.filter(sale => sale.currency === selectedCurrency);
        
        // Calculamos el total de ventas para el mes actual (en este caso, el primer item)
        const currentMonthTotal = data.length > 0 ? data[0].amount : 0;

        setFilteredData(data);
        setTotalSales(currentMonthTotal); // El total principal mostrará las ventas del período seleccionado
    }, [selectedDateFilter, selectedCurrency]);


    // --- HELPERS ---
    const getCurrencySymbol = (currency: string) => {
        const symbols: Record<string, string> = {
            'USD': '$',
            'MXN': 'MXN $',
        };
        return symbols[currency] || '$';
    };


    return (
      <View style={{ width: '100%', marginTop: 15, gap: 10 }}>

        {/* --- SECCIÓN DE FILTROS --- */}
        <View style={styles.filtersContainer}>
            {/* Filtro de Fecha */}
            <TouchableOpacity style={styles.filterButton}>
                <CustomText style={styles.filterLabel}>Filtro</CustomText>
                <View style={styles.filterValueContainer}>
                    <CustomText style={styles.filterValue}>{selectedDateFilter}</CustomText>
                    <IconArrow height={14} width={14} fill={'rgb(15, 15, 15)'} transform="rotate(270)"/>
                </View>
            </TouchableOpacity>

            {/* Filtro de Divisa */}
            <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setSelectedCurrency(c => c === 'USD' ? 'MXN' : 'USD')}
            >
                <CustomText style={styles.filterLabel}>Divisa</CustomText>
                <View style={styles.filterValueContainer}>
                    <CustomText style={styles.filterValue}>{selectedCurrency}</CustomText>
                    <IconArrow height={14} width={14} fill={'rgb(15, 15, 15)'} transform="rotate(270)"/>
                </View>
            </TouchableOpacity>
        </View>

        {/* --- CONTENEDOR PRINCIPAL DE DATOS --- */}
        <View style={styles.container}>
            {/* Total Principal */}
            <View style={{ alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderColor: 'rgb(223, 223, 223)',
                padding: 15,
             }}>
                <CustomText style={styles.totalAmount}>{getCurrencySymbol(selectedCurrency)}{totalSales.toFixed(2)}</CustomText>
                <CustomText style={styles.totalLabel}>Total de ventas ({selectedDateFilter})</CustomText>
            </View>

            {/* Lista detallada de ventas */}
            <View>
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <View key={index} style={styles.dataRow}>
                            <View style={styles.monthInfo}>
                                <CustomText style={styles.monthText}>{item.month}</CustomText>
                            </View>
                            <View style={styles.salesInfo}>
                                <CustomText style={styles.salesAmount}>
                                    {getCurrencySymbol(item.currency)}{item.amount.toFixed(2)}
                                </CustomText>
                                <CustomText style={[
                                    styles.percentageText, 
                                    { color: item.change >= 0 ? 'rgb(34, 154, 34)' : 'rgb(202, 50, 50)' }
                                ]}>
                                    {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                                </CustomText>
                            </View>
                        </View>
                    ))
                ) : (
                    <CustomText style={styles.noDataText}>No hay ventas para mostrar.</CustomText>
                )}
            </View>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    filterButton: {
      alignItems: 'flex-start',
      gap: 4,
    },
    filterLabel: {
      fontSize: 13,
      color: 'rgb(87, 87, 87)',
    },
    filterValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2
    },
    filterValue: {
      fontSize: 13,
      fontWeight: '500',
      color: 'rgb(15, 15, 15)',
    },
    container: {
      backgroundColor: '#f7f7f7',
      borderRadius: 12, 
      borderWidth: 1,
      borderColor: 'rgb(223, 223, 223)',
      width: '100%',
    },
    totalAmount: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    totalLabel: {
      fontSize: 13,
      color: 'rgb(87, 87, 87)',
      marginTop: 4,
    },
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    monthInfo: {
      flex: 1,
    },
    monthText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    salesInfo: {
      alignItems: 'flex-end',
    },
    salesAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    percentageText: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 2,
    },
    noDataText: {
      textAlign: 'center',
      paddingVertical: 10,
      color: 'gray',
    },
});