import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import Input from '@components/Input/Input';
import IconSearch from '@svgs/IconSearch';
import { IconFilter } from '@svgs/IconFilter';
import { colors } from 'shared/constants/manager-store';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
  placeholder = 'Buscar productos, categorías, proveedores...'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <IconSearch width={20} height={20} fill="rgb(146, 146, 146)" style={styles.searchIcon} />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={styles.searchInput}
          multiline={false}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <IconFilter width={20} height={20} fill={colors.primary} />
        <CustomText style={styles.filterText}>Filtros</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 44,
    paddingRight: 16,
    height: 44,
    fontSize: 16,
    fontFamily: 'Onest-Regular',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(165, 132, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(165, 132, 255, 0.3)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(165, 132, 255)',
  },
});
