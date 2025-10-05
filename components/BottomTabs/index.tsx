import React, { ReactNode, useEffect, useCallback } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle, BackHandler } from 'react-native';
import CustomText from '../CustomText/CustomText';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { useFocusEffect } from 'expo-router';

type TabItem = {
  id: string;
  label: string;    
  icon: ReactNode;
  component?: ReactNode;
};

type BottomTabsProps = {
  tabs: TabItem[];
  initialTab?: string;
  children?: ReactNode;
  style?: ViewStyle;
  tabBarStyle?: ViewStyle;
  tabItemStyle?: ViewStyle;
  activeTabItemStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
};

export default function BottomTabs({ 
  tabs, 
  initialTab, 
  children, 
  style,
  tabBarStyle,
  tabItemStyle,
  activeTabItemStyle,
  textStyle,
  activeTextStyle
}: BottomTabsProps) {
  const { activeTab, setActiveTab, showExitAlert } = useGlobalStore();
  const currentTab = activeTab || initialTab || tabs[0]?.id || 'home';

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(currentTab);
    }
  }, [activeTab, currentTab, setActiveTab]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showExitAlert();
        return true; 
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [showExitAlert])
  );

  return (
    <View style={[styles.container, style]}>
      {/* Contenido principal */}
      <View style={styles.content}>
        {tabs.map(tab => (
          <View
            key={`content-${tab.id}`}
            style={[styles.tabContent, { display: currentTab === tab.id ? 'flex' : 'none' }]}
          >
            {tab.component}
          </View>
        ))}
      </View>
      
      {/* Barra de navegación inferior */}
      <View style={[styles.tabBarContainer, tabBarStyle]}>
        <View style={[styles.tabBar]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                tabItemStyle,
                currentTab === tab.id ? [styles.activeTabItem, activeTabItemStyle] : undefined,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <CustomText style={{
                ...styles.tabText,
                ...(textStyle || {}),
                ...(currentTab === tab.id ? styles.activeTabText : {}),
                ...(currentTab === tab.id && activeTextStyle ? activeTextStyle : {})
              }}>
                {tab.icon}
              </CustomText>
              <CustomText style={{
                ...styles.tabLabel,
                ...(textStyle || {}),
                ...(currentTab === tab.id ? styles.activeTabText : {}),
                ...(currentTab === tab.id && activeTextStyle ? activeTextStyle : {})
              }}>
                {tab.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  tabText: {
    fontSize: 22,
    marginBottom: 2,
    color: '#666',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
  },
});
