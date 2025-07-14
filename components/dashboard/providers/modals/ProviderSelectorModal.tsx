import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ModalOptions from '@components/Modals/ModalOptions';
import CustomText from '@components/CustomText/CustomText';
import { Provider } from '@flux/entities/Provider';

interface ProviderSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  providers: Provider[];
  onSelectProvider: (providerId: string, providerName: string) => void;
}

const ProviderSelectorModal = ({ 
  visible, 
  onClose, 
  providers, 
  onSelectProvider 
}: ProviderSelectorModalProps) => {

  const renderItem = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={styles.providerItem}
      onPress={() => {
        onSelectProvider(item.id, item.name);
        onClose();
      }}
    >
      <CustomText style={styles.providerName}>{item.name}</CustomText>
    </TouchableOpacity>
  );

  return (
    <ModalOptions visible={visible} onClose={onClose}>
      <View>
        <CustomText style={styles.modalTitle}>Selecciona un proveedor</CustomText>
        <FlatList
          data={providers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ModalOptions>
  );
};

export default React.memo(ProviderSelectorModal);

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  providerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  providerName: {
    fontSize: 16,
  },
});