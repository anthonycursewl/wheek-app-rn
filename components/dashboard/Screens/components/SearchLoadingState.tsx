import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from '@components/CustomText/CustomText';

interface SearchLoadingStateProps {
  message?: string;
}

export const SearchLoadingState: React.FC<SearchLoadingStateProps> = ({
  message = 'Buscando...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color="rgb(165, 132, 255)" 
        style={styles.spinner}
      />
      <CustomText style={styles.message}>
        {message}
      </CustomText>
      
      <View style={styles.skeletonContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View key={index} style={styles.skeletonCard}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonSubtitle} />
              <View style={styles.skeletonDescription} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: 'rgb(117, 117, 117)',
    marginBottom: 32,
    fontWeight: '500',
  },
  skeletonContainer: {
    width: '100%',
    gap: 12,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonTitle: {
    height: 20,
    width: '70%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
  },
  skeletonSubtitle: {
    height: 16,
    width: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  },
  skeletonDescription: {
    height: 14,
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 4,
  },
});
