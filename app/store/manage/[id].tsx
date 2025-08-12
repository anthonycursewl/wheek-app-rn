import { ScrollView, StyleSheet, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { useRef, useState, useMemo } from 'react';

// Layout & Custom Components
import LayoutScreen from '@components/Layout/LayoutScreen';
import StoreHeader from '@components/ManagerStore/StoreHeader'; 
import TabButton from '@components/ManagerStore/TabButton';

// Constants
import { TabType, TAB_WIDTH, colors } from 'shared/constants/manager-store';
import { TABS_CONFIG } from '@components/ManagerStore/TabConfig';

export default function StoreManagementScreen() {
  const { currentStore } = useGlobalStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const scrollViewRef = useRef<ScrollView>(null);
  const tabPositions = useRef<Record<string, number>>({});
  const { width: windowWidth } = useWindowDimensions();
  
  const scrollToTab = (tabId: TabType) => {
    if (tabPositions.current[tabId] !== undefined && scrollViewRef.current) {
      const offset = tabPositions.current[tabId] - (windowWidth / 2) + (TAB_WIDTH / 2);
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  const handleTabPress = (tabId: TabType) => {
    setActiveTab(tabId);
    scrollToTab(tabId);
  };

  const ActiveTabContent = useMemo(() => {
    return TABS_CONFIG.find(tab => tab.id === activeTab)?.Component || null;
  }, [activeTab]);

  if (!currentStore) {
    return null; 
  }

  return (
    <LayoutScreen>
      <StoreHeader name={currentStore.name} description={currentStore.description} />

      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.tabsContainer}
        onContentSizeChange={() => scrollToTab(activeTab)}
      >
        {TABS_CONFIG.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            Icon={tab.Icon}
            isActive={activeTab === tab.id}
            onPress={() => handleTabPress(tab.id as TabType)}
            onLayout={(event: LayoutChangeEvent) => {
              tabPositions.current[tab.id] = event.nativeEvent.layout.x;
            }}
          />
        ))}
      </ScrollView>

      {ActiveTabContent && <ActiveTabContent />}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    gap: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});