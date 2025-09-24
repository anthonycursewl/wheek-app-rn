import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import Input from "@components/Input/Input"; // Asumo que tienes este componente
import ModalOptions from "@components/Modals/ModalOptions"; // Asumo que tienes este componente
import { ProductSearchResult } from "@flux/entities/Product"; // Reutilizamos la interfaz

import { useEffect } from 'react';
import { ProductService } from '@flux/services/Products/ProductService'; // Asumo que tienes este servicio
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import Button from '@components/Buttons/Button';
import { IconTrash } from 'svgs/IconTrash';

// Interfaz para un item dentro del carrito de la UI
interface CartLineItem extends ProductSearchResult {
    quantity: number;
}

// --- Componente Principal ---
export default function CheckoutScreen() {
    const { currentStore } = useGlobalStore();

    // --- ESTADOS ---
    const [cartItems, setCartItems] = useState<CartLineItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | 'OTHER'>('CASH');
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    
    // Estados para la búsqueda de productos
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);

    useEffect(() => {
        const searchProducts = async (term: string) => {
            if (!term.trim()) {
                setSearchResults([]);
                return;
            }
            const { data, error } = await ProductService.search(currentStore.id, term);
            if (data && !error) {
                setSearchResults(data);
            }
        };

        const timer = setTimeout(() => searchProducts(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, currentStore.id]);

    const addProductToCart = (product: ProductSearchResult) => {
        setCartItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { ...product, quantity: 1 }];
        });
        setSearchModalVisible(false);
        setSearchQuery('');
    };

    const handleQuantityChange = (productId: string, amount: number) => {
        setCartItems(currentItems =>
            currentItems.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const handleRemoveItem = (productId: string) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
    };

    // --- CÁLCULOS DE TOTALES (optimizados) ---
    const { subtotal, taxAmount, total } = useMemo(() => {
        const sub = cartItems.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
        const tax = sub * 0.16; 
        const tot = sub + tax;
        return { subtotal: sub, taxAmount: tax, total: tot };
    }, [cartItems]);

    // --- SUBMIT DE LA VENTA ---
    const handleFinalizeSale = () => {
        if (cartItems.length === 0) return;
        
        const salePayload = {
            store_id: currentStore.id,
            // user_id: user.id,
            total_amount: total,
            tax_amount: taxAmount,
            payment_method: paymentMethod,
            items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price_at_sale: item.cost,
            }))
        };
        console.log("ENVIANDO VENTA A LA API:", salePayload);
        // await SaleService.create(salePayload);
        setCartItems([]);
    };

    // --- RENDERIZADO DE SUB-COMPONENTES ---
    const CartItemRow = ({ item }: { item: CartLineItem }) => (
        <View style={styles.cartItemRow}>
            <View style={{ flex: 1, gap: 4 }}>
                <CustomText style={styles.itemName}>{item.name}</CustomText>
                <CustomText style={styles.itemPrice}>
                    {item.quantity} x ${item.cost.toFixed(2)}
                </CustomText>
            </View>
            <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)} style={styles.controlButton}>
                    <CustomText>-</CustomText>
                </TouchableOpacity>
                <CustomText style={styles.quantityText}>{item.quantity}</CustomText>
                <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)} style={styles.controlButton}>
                    <CustomText>+</CustomText>
                </TouchableOpacity>
            </View>
            <CustomText style={styles.itemSubtotal}>
                ${(item.cost * item.quantity).toFixed(2)}
            </CustomText>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={[styles.controlButton, { marginLeft: 10 }]}>
                <IconTrash width={20} height={20} fill={'rgb(165, 132, 255)'} />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.pageContainer}>

                    <View style={styles.header}>
                        <LogoPage />
                        <CustomText>Checkout</CustomText>
                    </View>

                    {/* --- SECCIÓN CARRITO DE COMPRAS --- */}
                    <View style={styles.sectionContainer}>
                        <CustomText style={styles.sectionTitle}>Carrito de Compras</CustomText>
                        <View style={styles.cartList}>
                            {cartItems.length > 0 ? (
                                cartItems.map(item => <CartItemRow key={item.id} item={item} />)
                            ) : (
                                <CustomText style={styles.emptyCartText}>El carrito está vacío.</CustomText>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setSearchModalVisible(true)} style={styles.addButton}>
                            <CustomText style={styles.addButtonText}>+ Añadir Producto</CustomText>
                        </TouchableOpacity>
                    </View>

                    {/* --- SECCIÓN RESUMEN DE LA VENTA --- */}
                    <View style={styles.sectionContainer}>
                        <CustomText style={styles.sectionTitle}>Resumen de la Venta</CustomText>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryRow}>
                                <CustomText style={styles.summaryLabel}>Subtotal</CustomText>
                                <CustomText style={styles.summaryValue}>${subtotal.toFixed(2)}</CustomText>
                            </View>
                            <View style={styles.summaryRow}>
                                <CustomText style={styles.summaryLabel}>Impuestos (16%)</CustomText>
                                <CustomText style={styles.summaryValue}>${taxAmount.toFixed(2)}</CustomText>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <CustomText style={styles.totalLabel}>TOTAL</CustomText>
                                <CustomText style={styles.totalValue}>${total.toFixed(2)}</CustomText>
                            </View>
                        </View>
                    </View>
                    
                    {/* --- SECCIÓN MÉTODO DE PAGO --- */}
                    <View style={styles.sectionContainer}>
                        <CustomText style={styles.sectionTitle}>Método de Pago</CustomText>
                        <View style={styles.paymentOptionsColumn}>
                            {/* Primera fila: Efectivo y Tarjeta */}
                            <View style={styles.paymentRow}>
                                <TouchableOpacity 
                                    style={[styles.paymentButton, ...(paymentMethod === 'CASH' ? [styles.paymentButtonActive] : [])]}
                                    onPress={() => setPaymentMethod('CASH')}>
                                    <CustomText style={[styles.paymentButtonText, ...(paymentMethod === 'CASH' ? [styles.paymentButtonTextActive] : [])]}>Efectivo</CustomText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.paymentButton, ...(paymentMethod === 'CARD' ? [styles.paymentButtonActive] : [])]}
                                    onPress={() => setPaymentMethod('CARD')}>
                                    <CustomText style={[styles.paymentButtonText, ...(paymentMethod === 'CARD' ? [styles.paymentButtonTextActive] : [])]}>Tarjeta</CustomText>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Segunda fila: Transferencia y Otro */}
                            <View style={styles.paymentRow}>
                                <TouchableOpacity 
                                    style={[styles.paymentButton, ...(paymentMethod === 'TRANSFER' ? [styles.paymentButtonActive] : [])]}
                                    onPress={() => setPaymentMethod('TRANSFER')}>
                                    <CustomText style={[styles.paymentButtonText, ...(paymentMethod === 'TRANSFER' ? [styles.paymentButtonTextActive] : [])]}>Transferencia</CustomText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.paymentButton, ...(paymentMethod === 'OTHER' ? [styles.paymentButtonActive] : [])]}
                                    onPress={() => setPaymentMethod('OTHER')}>
                                    <CustomText style={[styles.paymentButtonText, ...(paymentMethod === 'OTHER' ? [styles.paymentButtonTextActive] : [])]}>Otro</CustomText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* --- BOTÓN DE ACCIÓN FIJO --- */}
            <View style={styles.ctaContainer}>
                <Button 
                    onPress={handleFinalizeSale}
                    disabled={cartItems.length === 0}
                    style={{ paddingHorizontal: 30 }}
                    title={`Completar Venta (${total.toFixed(2)})`} 
                    uppercase
                    />
            </View>

            {/* --- MODAL DE BÚSQUEDA --- */}
            <ModalOptions visible={isSearchModalVisible} onClose={() => setSearchModalVisible(false)}>
                <CustomText style={{ marginBottom: 10 }}>Buscar Producto</CustomText>
                <Input
                    placeholder="Buscar por nombre o escanear código..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.searchResultItem} onPress={() => addProductToCart(item)}>
                            <CustomText style={{ flex: 1 }}>{item.name}</CustomText>
                            <CustomText style={{ fontWeight: 'bold' }}>${item.cost.toFixed(2)}</CustomText>
                        </TouchableOpacity>
                    )}
                    style={{ maxHeight: 300, marginTop: 10 }}
                />
            </ModalOptions>
        </>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    pageContainer: { padding: 20, paddingTop: 40, flex: 1, paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
    sectionContainer: { marginBottom: 25 },
    sectionTitle: { 
        fontSize: 16, 
        marginBottom: 15, 
        color: '#333' 
    },
    cartList: { gap: 5 },
    cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
    itemName: { fontSize: 16, flex: 1 },
    itemPrice: { fontSize: 13, color: 'gray' },
    quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 15 },
    controlButton: { padding: 5 },
    quantityText: { fontSize: 16, fontWeight: 'bold' },
    itemSubtotal: { fontSize: 16, fontWeight: 'bold', minWidth: 70, textAlign: 'right' },
    emptyCartText: { 
        textAlign: 'center', 
        color: 'gray', 
        padding: 20, 
        fontStyle: 'italic' 
    },
    addButton: { 
        marginTop: 10, 
        padding: 12, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: 'rgb(165, 132, 255)', 
        borderStyle: 'dashed' 
    },
    addButtonText: { textAlign: 'center', color: 'rgb(165, 132, 255)', fontWeight: 'bold' },
    summaryBox: { backgroundColor: '#f7f7f7', padding: 15, borderRadius: 12, gap: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { 
        fontSize: 15, color: '#555' 
    },
    summaryValue: { 
        fontSize: 15, 
        fontWeight: '500' 
    },
    totalRow: { paddingTop: 10, marginTop: 5, borderTopWidth: 1, borderColor: '#eee' },
    totalLabel: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    totalValue: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    paymentOptions: { flexDirection: 'row', gap: 10 },
    paymentOptionsColumn: { gap: 10 },
    paymentRow: { flexDirection: 'row', gap: 10 },
    paymentButton: { 
        flex: 1, 
        padding: 8, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 20, 
        alignItems: 'center' 
    },
    paymentButtonActive: { backgroundColor: 'rgb(165, 132, 255)', borderColor: 'rgb(165, 132, 255)' },
    paymentButtonText: { fontSize: 16, fontWeight: '500' },
    paymentButtonTextActive: { color: 'white' },
    ctaContainer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 20, 
        backgroundColor: 'white', 
        borderTopWidth: 1, 
        borderColor: 'rgb(200, 200, 200)' 
    },
    ctaButton: { backgroundColor: 'rgb(165, 132, 255)', padding: 18, borderRadius: 12, alignItems: 'center' },
    ctaButtonDisabled: { backgroundColor: '#ccc' },
    ctaButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    searchResultItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
});

// Mock data para simulación
const mockProducts: ProductSearchResult[] = [
    { id: '1', name: 'Laptop Pro X', barcode: '123', cost: 1200, benchmark: 25 },
    { id: '2', name: 'Mouse Inalámbrico', barcode: '456', cost: 25.50, benchmark: 40 },
    { id: '3', name: 'Teclado Mecánico RGB', barcode: '789', cost: 79.99, benchmark: 35 },
];