import { StyleSheet } from "react-native";

export const mainStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    screenText: {
      fontSize: 18,
      color: '#333',
    },
    tabBar: {
      backgroundColor: '#ffffff',
      borderTopWidth: 0,
      elevation: 10,
    },
    tabItem: {
      paddingVertical: 8,
    },
    activeTabItem: {
      borderTopColor: 'rgb(170, 125, 241)',
    },
    tabText: {
      fontSize: 12,
      color: '#666',
    },
    activeTabText: {
      color: 'rgb(170, 125, 241)',
      fontWeight: '600',
    },
  });