import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { colors } from 'shared/constants/manager-store';

interface StoreHeaderProps {
  name: string;
  description?: string | null;
}

const StoreHeader = ({ name, description }: StoreHeaderProps) => (
  <View style={styles.header}>
    <View style={{ gap: 5 }}>
      <CustomText style={styles.storeName}>{name}</CustomText>
      <CustomText style={styles.storeDescription}>
        {description || 'Sin descripción'}
      </CustomText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 10,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  storeDescription: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default StoreHeader;