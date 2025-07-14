import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ModalOptions from '@components/Modals/ModalOptions';
import CustomText from '@components/CustomText/CustomText';
import { Category } from '@flux/entities/Category';

interface CategorySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (categoryId: string, categoryName: string) => void;
}

const CategorySelectorModal = ({ 
  visible, 
  onClose, 
  categories, 
  onSelectCategory 
}: CategorySelectorModalProps) => {

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        onSelectCategory(item.id, item.name);
        onClose();
      }}
    >
      <CustomText style={styles.categoryName}>{item.name}</CustomText>
    </TouchableOpacity>
  );

  return (
    <ModalOptions visible={visible} onClose={onClose}>
      <View>
        <CustomText style={styles.modalTitle}>Selecciona una categoría</CustomText>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ModalOptions>
  );
};

export default React.memo(CategorySelectorModal);

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryName: {
    fontSize: 16,
  },
});