import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { TABS_CONFIG } from './TabConfig';
import { useOptimizedTabs } from '@hooks/useOptimizedTabs';
import { useLocalSearchParams } from 'expo-router';

interface OptimizedTabBarProps {
  initialTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function OptimizedTabBar({ initialTab = 'products', onTabChange }: OptimizedTabBarProps) {
  const { tab } = useLocalSearchParams<{ tab: string }>()
  const { activeTab, isSwitching, switchTab } = useOptimizedTabs(tab ? tab : initialTab);

  const handleTabPress = useCallback((tabId: string) => {
    if (isSwitching) return;
    switchTab(tabId);
    onTabChange?.(tabId);
  }, [isSwitching, switchTab, onTabChange]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = isSwitching;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive,
                isDisabled && styles.tabItemDisabled,
              ]}
              onPress={() => handleTabPress(tab.id)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <tab.Icon
                {...tab.iconProps}
                fill={isActive ? '#6A4DFF' : 'rgb(85, 85, 85)'}
              />
              <CustomText
                style={[
                  styles.tabText,
                  ...(isActive ? [styles.tabTextActive] : []),
                  ...(isDisabled ? [styles.tabTextDisabled] : []),
                ]}
              >
                {tab.label}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 2,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: '#f7faff',
  },
  tabItemDisabled: {
    opacity: 0.6,
  },
  tabText: {
    fontSize: 12,
    color: 'rgb(85, 85, 85)',
    fontWeight: '500',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#6A4DFF',
    fontWeight: '600',
  },
  tabTextDisabled: {
    color: 'rgb(146, 146, 146)',
  },
});
