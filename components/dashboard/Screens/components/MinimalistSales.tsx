import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
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

// Datos de ejemplo para hoy
const todaySalesData = {
    total: 89.50,
    currency: 'USD',
    transactions: 12,
    change: 3.2
};

// Datos de ejemplo para producto más vendido
const topProductData = {
    name: 'Camiseta Premium',
    quantity: 8,
    revenue: 56.00,
    currency: 'USD'
};

// Datos de ejemplo para ventas del mes
const monthSalesData = {
    total: 2450.50,
    currency: 'USD',
    goal: 3000,
    progress: 82
};

// --- Componente Principal ---
export const MinimalistSales = () => {
    // --- ESTADOS ---
    const [selectedDateFilter, setSelectedDateFilter] = useState('Hoy');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    // --- HELPERS ---
    const getCurrencySymbol = (currency: string) => {
        const symbols: Record<string, string> = {
            'USD': '$',
            'MXN': 'MXN $',
        };
        return symbols[currency] || '$';
    };

    return (
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
        
        {/* --- FILA 1: Ventas de hoy con filtros --- */}
        <View style={styles.gridRow}>
          <View style={[styles.gridItem, styles.fullWidthItem]}>
            <View style={styles.cardHeader}>
              <CustomText style={styles.cardTitle}>Ventas de hoy</CustomText>
              <View style={styles.filtersContainer}>
                <TouchableOpacity style={styles.filterButton}>
                  <CustomText style={styles.filterValue}>{selectedDateFilter}</CustomText>
                  <IconArrow height={12} width={12} fill={'rgb(15, 15, 15)'} transform="rotate(270)"/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setSelectedCurrency(c => c === 'USD' ? 'MXN' : 'USD')}
                >
                  <CustomText style={styles.filterValue}>{selectedCurrency}</CustomText>
                  <IconArrow height={12} width={12} fill={'rgb(15, 15, 15)'} transform="rotate(270)"/>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.todaySalesContent}>
              <View style={styles.salesMainInfo}>
                <CustomText style={styles.todaySalesAmount}>
                  {getCurrencySymbol(todaySalesData.currency)}{todaySalesData.total.toFixed(2)}
                </CustomText>
                <CustomText style={[
                  styles.salesChange,
                  { color: todaySalesData.change >= 0 ? 'rgb(34, 154, 34)' : 'rgb(202, 50, 50)' }
                ]}>
                  {todaySalesData.change >= 0 ? '▲' : '▼'} {Math.abs(todaySalesData.change)}%
                </CustomText>
              </View>
              <View style={styles.salesDetails}>
                <CustomText style={styles.salesDetailText}>
                  {todaySalesData.transactions} transacciones
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* --- FILA 2: Producto más vendido del día --- */}
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <CustomText style={styles.cardTitle}>Producto más vendido</CustomText>
            <View style={styles.topProductContent}>
              <CustomText style={styles.productName}>{topProductData.name}</CustomText>
              <View style={styles.productStats}>
                <CustomText style={styles.productQuantity}>
                  {topProductData.quantity} unidades
                </CustomText>
                <CustomText style={styles.productRevenue}>
                  {getCurrencySymbol(topProductData.currency)}{topProductData.revenue.toFixed(2)}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* --- FILA 3: Ventas del mes --- */}
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <CustomText style={styles.cardTitle}>Ventas del mes</CustomText>
            <View style={styles.monthSalesContent}>
              <CustomText style={styles.monthSalesAmount}>
                {getCurrencySymbol(monthSalesData.currency)}{monthSalesData.total.toFixed(2)}
              </CustomText>
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressBar, { width: `${monthSalesData.progress}%` }]} />
                </View>
                <CustomText style={styles.progressText}>
                  {monthSalesData.progress}% de {getCurrencySymbol(monthSalesData.currency)}{monthSalesData.goal.toFixed(2)}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
    // Estilos de scroll
    scrollContainer: {
      width: '100%',
    },
    
    // Estilos de cuadrícula
    gridContainer: {
      width: '100%',
      gap: 15,
    },
    gridRow: {
      flexDirection: 'row',
      gap: 15,
    },
    gridItem: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgb(165, 132, 255)',
      padding: 16,
      minHeight: 120,
    },
    fullWidthItem: {
      width: '100%',
    },

    // Estilos de tarjeta
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: 'rgb(133, 87, 206)',
    },

    // Estilos de filtros
    filtersContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(219, 180, 255, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgb(165, 132, 255)',
    },
    filterValue: {
      fontSize: 12,
      fontWeight: '500',
      color: 'rgb(133, 87, 206)',
    },

    // Estilos de ventas de hoy
    todaySalesContent: {
      gap: 8,
    },
    salesMainInfo: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    todaySalesAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'rgb(49, 49, 49)',
    },
    salesChange: {
      fontSize: 14,
      fontWeight: '500',
    },
    salesDetails: {
      marginTop: 4,
    },
    salesDetailText: {
      fontSize: 12,
      color: 'rgb(129, 129, 129)',
    },

    // Estilos de producto más vendido
    topProductContent: {
      gap: 8,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: 'rgb(49, 49, 49)',
    },
    productStats: {
      gap: 4,
    },
    productQuantity: {
      fontSize: 14,
      fontWeight: '500',
      color: 'rgb(129, 129, 129)',
    },
    productRevenue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'rgb(165, 132, 255)',
    },

    // Estilos de ventas del mes
    monthSalesContent: {
      gap: 12,
    },
    monthSalesAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'rgb(49, 49, 49)',
    },
    progressContainer: {
      gap: 4,
    },
    progressBackground: {
      height: 8,
      backgroundColor: 'rgba(200, 200, 200, 0.3)',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: 'rgb(165, 132, 255)',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 11,
      color: 'rgb(129, 129, 129)',
    },
});