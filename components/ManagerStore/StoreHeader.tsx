import React, { useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { colors } from 'shared/constants/manager-store';
import { IconInfo } from 'svgs/IconInfo';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { router } from 'expo-router';

interface StoreHeaderProps {
  name: string;
  description?: string | null;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const StoreHeader = ({ name, description }: StoreHeaderProps) => {
  const  { currentStore } = useGlobalStore() 
  const { width } = useWindowDimensions();

  const nameMaxLength = Math.floor(width / 16);
  const descriptionMaxLength = Math.floor(width / 9);

  const goToStoreInfo = useCallback(() => {
      router.push(`/members/members?store_id=${currentStore?.id}`)
  }, [currentStore]);

  return (
    <TouchableOpacity onPress={goToStoreInfo}>
      <View style={styles.header}>
      <View style={{ gap: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, width: '100%', justifyContent: 'space-between' }}>
          <CustomText style={styles.storeName}>{truncateText(name || '', nameMaxLength)}</CustomText>
          <IconInfo width={28} height={28} fill={colors.primary}/>
        </View>
        <CustomText style={styles.storeDescription}>
          {truncateText(description || 'Sin descripción', descriptionMaxLength)}
        </CustomText>
      </View>
      </View>
    </TouchableOpacity>
);
}

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