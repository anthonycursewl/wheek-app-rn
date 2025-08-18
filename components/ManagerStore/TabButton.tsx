import React from 'react';
import { TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { TAB_WIDTH, colors } from 'shared/constants/manager-store';

interface TabButtonProps {
  label: string;
  Icon: React.FC<any>;
  isActive: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

const TabButton = ({ label, Icon, isActive, onPress, onLayout }: TabButtonProps) => {
  const color = isActive ? colors.primary : colors.gray;

  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Icon width={20} height={20} color={color} />
      <CustomText style={[
        styles.tabText, 
        isActive ? styles.activeTabText : {}
      ] as any}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 1.2,
    borderBottomColor: colors.primary,
    borderStyle: 'dashed',
  },
  tabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default TabButton;