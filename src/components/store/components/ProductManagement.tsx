import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Product } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconPlus from '@/svgs/IconPlus';
import IconSearch from '@/svgs/IconSearch';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';

interface ProductManagementProps {
  storeId: string;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products for the store
  const fetchProducts = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await ProductService.getProductsByStore(storeId);
      // setProducts(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        // Update existing product
        // await ProductService.updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        // await ProductService.createProduct({ ...productData, storeId });
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // await ProductService.deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showProductForm) {
    return (
      <ProductForm
        initialData={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => setShowProductForm(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSearch width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <IconPlus width={20} height={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CustomText>No hay productos registrados</CustomText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8a5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});

export default ProductManagement;
