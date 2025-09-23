// shared/components/Modals/FilterModal.js
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Switch, ScrollView, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalOptions from "@components/Modals/ModalOptions";
import CustomText from "@components/CustomText/CustomText";
import { IconFilter } from "svgs/IconFilter";

export type FilterItem = {
    label: string;
    key: string;
};

export type DateFilterItem = {
    label: string;
    key: string;
    type: 'dateRange';
};

export type FilterItemBase = FilterItem | DateFilterItem;

export type FilterSection = {
    title: string;
    icon: React.ReactNode;
    items: FilterItemBase[];
};

export type FilterConfig = FilterSection[];
export type AppliedFilters = {
    [key: string]: boolean | {
        startDate: Date | null;
        endDate: Date | null;
    } | string;
};


export function FilterModal({ 
    visible, 
    onClose, 
    filterConfig, 
    appliedFilters, 
    onFiltersChange,
    onProviderFilterPress
}: {
    visible: boolean;
    onClose: () => void;
    filterConfig: FilterConfig;
    appliedFilters: AppliedFilters;
    onFiltersChange: (filters: AppliedFilters) => void;
    onProviderFilterPress?: () => void;
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentDateKey, setCurrentDateKey] = useState('');
    const [isStartDate, setIsStartDate] = useState(true);

    const handleFilterChange = (key: string, value: boolean) => {
        onFiltersChange({
            ...appliedFilters,
            [key]: value
        });
    };

    const handleDateFilterChange = (key: string, date: Date, isStart: boolean) => {
        const currentFilter = appliedFilters[key];
        let dateRange;
        
        if (typeof currentFilter === 'object' && currentFilter !== null) {
            dateRange = { ...currentFilter };
        } else {
            dateRange = { startDate: null, endDate: null };
        }
        
        if (isStart) {
            dateRange.startDate = date;
        } else {
            dateRange.endDate = date;
        }
        
        onFiltersChange({
            ...appliedFilters,
            [key]: dateRange
        });
    };

    const handleClearDateFilter = (key: string) => {
        onFiltersChange({
            ...appliedFilters,
            [key]: { startDate: null, endDate: null }
        });
    };

    const handleDatePress = (key: string, isStart: boolean) => {
        setCurrentDateKey(key);
        setIsStartDate(isStart);
        setShowDatePicker(true);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Seleccionar fecha';
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isDateFilter = (item: FilterItemBase): item is DateFilterItem => {
        return 'type' in item && item.type === 'dateRange';
    };

    const isProviderFilterActive = (key: string) => {
        const filter = appliedFilters[key];
        return typeof filter === 'string' && filter !== '';
    };

    const isDateFilterActive = (key: string) => {
        const filter = appliedFilters[key];
        return typeof filter === 'object' && filter !== null && 
               (filter.startDate !== null || filter.endDate !== null);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleDateFilterChange(currentDateKey, selectedDate, isStartDate);
        }
    };

    return (
        <ModalOptions visible={visible} onClose={onClose}>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                <View style={modalStyles.container}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-start', marginBottom: 24 }}>
                        <IconFilter width={20} height={20} fill="rgb(94, 36, 255)"/>
                        <CustomText style={modalStyles.title}>Filtros</CustomText>
                    </View>
                    
                    {filterConfig.map((section, index) => (
                        <View key={index}>
                            <View style={modalStyles.section}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 }}>
                                    {section.icon}
                                    <CustomText style={modalStyles.sectionTitle}>{section.title}</CustomText>
                                </View>

                                {section.items.map((item) => {
                                    if (isDateFilter(item)) {
                                        const dateRange = appliedFilters[item.key];
                                        const isActive = isDateFilterActive(item.key);
                                        const startDate = typeof dateRange === 'object' && dateRange !== null ? dateRange.startDate : null;
                                        const endDate = typeof dateRange === 'object' && dateRange !== null ? dateRange.endDate : null;
                                        
                                        return (
                                            <View key={item.key} style={modalStyles.dateFilterContainer}>
                                                <View style={modalStyles.dateFilterHeader}>
                                                    <CustomText style={modalStyles.filterLabel}>{item.label}</CustomText>
                                                    {isActive && (
                                                        <TouchableOpacity
                                                            style={modalStyles.clearButton}
                                                            onPress={() => handleClearDateFilter(item.key)}
                                                        >
                                                            <CustomText style={modalStyles.clearButtonText}>Limpiar</CustomText>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                <View style={modalStyles.dateInputsContainer}>
                                                    <TouchableOpacity
                                                        style={[modalStyles.dateButton, isActive && modalStyles.dateButtonActive]}
                                                        onPress={() => handleDatePress(item.key, true)}
                                                    >
                                                        <CustomText style={isActive ? [modalStyles.dateButtonText, modalStyles.dateButtonTextActive] : modalStyles.dateButtonText}>
                                                            Desde: {formatDate(startDate)}
                                                        </CustomText>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[modalStyles.dateButton, isActive && modalStyles.dateButtonActive]}
                                                        onPress={() => handleDatePress(item.key, false)}
                                                    >
                                                        <CustomText style={isActive ? [modalStyles.dateButtonText, modalStyles.dateButtonTextActive] : modalStyles.dateButtonText}>
                                                            Hasta: {formatDate(endDate)}
                                                        </CustomText>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    } else if (item.key === 'provider' && onProviderFilterPress) {
                                        const isActive = isProviderFilterActive(item.key);
                                        return (
                                            <View style={modalStyles.filterItem} key={item.key}>
                                                <CustomText style={modalStyles.filterLabel}>{item.label}</CustomText>
                                                <TouchableOpacity
                                                    style={[
                                                        modalStyles.providerButton,
                                                        isActive && modalStyles.providerButtonActive
                                                    ] as any}
                                                    onPress={onProviderFilterPress}
                                                >
                                                    <CustomText style={[
                                                        modalStyles.providerButtonText,
                                                        isActive && modalStyles.providerButtonTextActive
                                                    ] as any}>
                                                        {isActive ? 'Seleccionado' : 'Seleccionar'}
                                                    </CustomText>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <View style={modalStyles.filterItem} key={item.key}>
                                                <CustomText style={modalStyles.filterLabel}>{item.label}</CustomText>
                                                <View style={modalStyles.switchContainer}>
                                                    <Switch
                                                        value={!!appliedFilters[item.key]}
                                                        onValueChange={(value) => handleFilterChange(item.key, value)}
                                                        trackColor={{ false: '#e0e0e0', true: '#5E24FF' }}
                                                        thumbColor={'#ffffff'}
                                                        ios_backgroundColor="#e0e0e0"
                                                    />
                                                </View>
                                            </View>
                                        );
                                    }
                                })}
                            </View>
                            {index < filterConfig.length - 1 && <View style={modalStyles.divider} />}
                        </View>
                    ))}
                </View>
            </ScrollView>
            
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}
        </ModalOptions>
    );
}

const modalStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    filterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },
    filterLabel: {
        fontSize: 15,
        color: '#2c2c2c',
        flex: 1,
        fontWeight: '400',
    },
    switchContainer: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginVertical: 20,
    },
    dateFilterContainer: {
        backgroundColor: '#fafafa',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderColor: 'rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
    },
    dateInputsContainer: {
        flexDirection: 'column',
        gap: 8,
        marginVertical: 10
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginHorizontal: 12,
        marginVertical: 4,
    },
    dateButtonActive: {
        borderColor: '#5E24FF',
        backgroundColor: 'rgba(94, 36, 255, 0.05)',
    },
    dateButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    dateButtonTextActive: {
        color: '#5E24FF',
        fontWeight: '500',
    },
    dateFilterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clearButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(94, 36, 255, 0.1)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#5E24FF',
    },
    clearButtonText: {
        fontSize: 12,
        color: '#5E24FF',
        fontWeight: '500',
    },
    providerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    providerButtonActive: {
        borderColor: '#5E24FF',
        backgroundColor: 'rgba(94, 36, 255, 0.05)',
    },
    providerButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    providerButtonTextActive: {
        color: '#5E24FF',
        fontWeight: '500',
    },
});

