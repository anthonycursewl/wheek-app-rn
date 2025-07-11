import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconEdit from '@/svgs/IconEdit';
import IconDelete from '@/svgs/IconDelete';

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <CustomText style={styles.productName}>{product.name}</CustomText>
        {product.code && (
          <CustomText style={styles.productCode}>Código: {product.code}</CustomText>
        )}
        <View style={styles.priceContainer}>
          <CustomText style={styles.price}>${product.price.toFixed(2)}</CustomText>
          {product.stock !== undefined && (
            <CustomText style={styles.stock}>
              Stock: {product.stock} {product.unit || 'un'}
            </CustomText>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(product)}
        >
          <IconEdit width={18} height={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(product.id)}
        >
          <IconDelete width={18} height={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8a5cf6',
    marginRight: 12,
  },
  stock: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteButton: {
    marginLeft: 0,
  },
});

export default ProductItem;
