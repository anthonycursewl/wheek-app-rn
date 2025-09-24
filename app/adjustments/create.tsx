import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState, useEffect, useMemo } from "react";

// SVGs
import IconManage from "svgs/IconManage";
import { IconCamera } from "svgs/IconCamera";
import IconCross from "svgs/IconCross";

// Stores & Services
import useAuthStore from "@flux/stores/AuthStore";
import { useAdjustmentStore } from "@flux/stores/useAdjustmentStore";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { AdjustmentService } from "@flux/services/Adjustments/AdjustmentService";
import { ProductService } from "@flux/services/Products/ProductService";

// Actions
import { adjustmentAttemptAction, adjustmentCreateSuccessAction, adjustmentFailureAction } from "@flux/Actions/AdjustmentActions";

// Custom components
import CustomText from "@components/CustomText/CustomText";
import Input from "@components/Input/Input";
import ModalOptions from "@components/Modals/ModalOptions";
import LogoPage from "@components/LogoPage/LogoPage";
import Button from "@components/Buttons/Button";
import CustomAlert from "shared/components/CustomAlert";

// Interfaces
import { ProductSearchResult, AdjustmentLineItem, AdjustmentPayload } from "@flux/entities/Adjustment";
import { router } from "expo-router";
import { useInventoryStore } from "@flux/stores/useInventoryStore";

export const AdjustmentReason = {
  DAMAGED: 'DAMAGED',
  LOST: 'LOST',
  EXPIRED: 'EXPIRED',
  INTERNAL_USE: 'INTERNAL_USE',
  RETURN_TO_SUPPLIER: 'RETURN_TO_SUPPLIER',
  OTHER: 'OTHER'
} as const;

type AdjustmentReasonType = keyof typeof AdjustmentReason;

const REASON_LABELS: Record<AdjustmentReasonType, string> = {
  DAMAGED: 'Dañado',
  LOST: 'Perdido',
  EXPIRED: 'Caducado',
  INTERNAL_USE: 'Uso Interno',
  RETURN_TO_SUPPLIER: 'Devolución a Proveedor',
  OTHER: 'Otro'
};

const ProductCardReduced = ({ product, addProductToAdjustment }: { product: ProductSearchResult, addProductToAdjustment: (product: ProductSearchResult) => void }) => (
    <TouchableOpacity onPress={() => addProductToAdjustment(product)} style={styles.productCard}>
        <View style={styles.productCardHeader}>
            <IconManage height={25} width={25} fill={'rgb(165, 132, 255)'} />
            <CustomText style={{ fontSize: 18, flex: 1 }}>{product.name}</CustomText>
        </View>
        <View style={styles.productCardBody}>
            <View style={styles.productInfoRow}>
                <CustomText style={styles.productInfoLabel}>Cod. Barra</CustomText>
                <CustomText style={styles.productInfoValue}>{product.barcode}</CustomText>
            </View>
        </View>
        <View style={styles.productCardFooter}>
            <CustomText style={styles.productCost}>${product.cost.toFixed(2)}</CustomText>
            <CustomText style={styles.productInfoLabel}>Costo</CustomText>
        </View>
    </TouchableOpacity>
);

export default function AdjustCreate() {
    const { currentStore, alertState, hideAlert, showSuccess, showResponse } = useGlobalStore();
    const { user } = useAuthStore();
    const { dispatch, loading: loadingAdjustments } = useAdjustmentStore();
    const { clearStore: clearInventory } = useInventoryStore();

    const [showReasonModal, setShowReasonModal] = useState(false);
    const [modalSearchProduct, setModalSearchProduct] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
    
    const [adjustmentItems, setAdjustmentItems] = useState<AdjustmentLineItem[]>([]);
    const [notes, setNotes] = useState('');
    const [reason, setReason] = useState<AdjustmentReasonType | ''>('');

    useEffect(() => {
        const searchProducts = async (term: string) => {
            if (!term) {
                setSearchResults([]);
                return;
            }

            const { data, error } = await ProductService.search(currentStore.id, term.trim());
            if (data && !error) {
                const mappedResults: ProductSearchResult[] = data.map(product => ({
                    id: product.id,
                    name: product.name,
                    barcode: product.barcode,
                    cost: product.cost,
                    current_stock: 0
                }));
                setSearchResults(mappedResults);
            }
        };

        const timer = setTimeout(() => {
            searchProducts(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, currentStore.id]);
    
    const addProductToAdjustment = (product: ProductSearchResult) => {
        setAdjustmentItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { 
                ...product, 
                quantity: 1,
            }];
        });
        setModalSearchProduct(false);
        setSearchQuery('');
    };

    const handleQuantityChange = (productId: string, amount: number) => {
        setAdjustmentItems(currentItems =>
            currentItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );
    };

    const removeProductFromAdjustment = (productId: string) => {
        setAdjustmentItems(currentItems => currentItems.filter(item => item.id !== productId));
    };

    const totalAdjustmentCost = useMemo(() => {
        return adjustmentItems.reduce((total, item) => total + (item.quantity * item.cost), 0);
    }, [adjustmentItems]);

    const handleSaveAdjustment = async () => {
        if (!reason) {
            showResponse('Por favor selecciona un motivo para el ajuste', { icon: 'error', duration: 2000 });
            return;
        }

        if (adjustmentItems.length === 0) {
            showResponse('Por favor agrega al menos un producto al ajuste', { icon: 'error', duration: 2000 });
            return;
        }

        const adjustment: AdjustmentPayload = {
            store_id: currentStore.id,
            user_id: user?.id || '',
            reason: reason,
            notes: notes.trim(),
            items: adjustmentItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        showSuccess('¿Estás seguro que deseas crear este ajuste?', {
            icon: 'info',
            requiresConfirmation: true,
            isLoading: loadingAdjustments,
            onClose: () => {
                dispatch(adjustmentFailureAction(''));
            },
            onConfirm: async () => {
                dispatch(adjustmentAttemptAction());
                const { data, error } = await AdjustmentService.createAdjustment(adjustment);
                if (error) {
                    dispatch(adjustmentFailureAction(error));
                    showResponse(error, { icon: 'error', duration: 2500 });
                }
                if (data) {
                    clearInventory();
                    hideAlert();
                    dispatch(adjustmentCreateSuccessAction(data));
                    showResponse('Ajuste creado exitosamente!', 
                        { 
                            icon: 'success', 
                            duration: 1000,
                            autoHide: true,
                            onClose: () => {
                                router.back();
                            },
                        });
                }
            }
        });
    };

    

    const AdjustmentItemRow = ({ item }: { item: AdjustmentLineItem }) => (
        <View style={styles.adjustmentItemRow}>
            <View style={{ flex: 1, gap: 4 }}>
                <CustomText style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</CustomText>
                <CustomText style={{ fontSize: 13, color: 'gray' }}>
                    Stock actual: {item.current_stock} | Subtotal: ${(item.quantity * item.cost).toFixed(2)}
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
                <TouchableOpacity onPress={() => removeProductFromAdjustment(item.id)} style={[styles.controlButton, { marginLeft: 10 }]}>
                    <IconCross width={20} height={20} fill={'rgb(202, 50, 50)'} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <ScrollView>
                <View style={{ padding: 20, paddingBottom: 0, paddingTop: 40 }}>
                    <View style={styles.main}>
                        <LogoPage />
                        <CustomText>Crear ajuste</CustomText>
                    </View>

                    <View style={{ gap: 10 }}>
                        <CustomText>Tienda</CustomText>
                        <Input 
                            placeholder="" 
                            value={currentStore.name} 
                            editable={false}
                        />
                    </View>

                    <View style={{ marginTop: 12, gap: 12 }}>
                        <View style={{ gap: 10 }}> 
                            <CustomText>Motivo del ajuste *</CustomText>
                            <TouchableOpacity onPress={() => setShowReasonModal(true)}>
                                <Input 
                                    placeholder="Seleccionar motivo..." 
                                    value={reason ? REASON_LABELS[reason] : ''} 
                                    editable={false}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: 10 }}> 
                            <CustomText>Notas</CustomText>
                            <Input 
                                placeholder="Escribe notas sobre el ajuste..." 
                                value={notes} 
                                onChangeText={setNotes}
                                editable={true}
                                multiline
                            />
                        </View>
                        
                        {/* --- LISTA DE PRODUCTOS DEL AJUSTE --- */}
                        <View>
                            <CustomText>Productos</CustomText>
                            <CustomText style={{ fontSize: 12, color: 'rgb(130, 130, 130)', marginBottom: 10 }}>
                                {adjustmentItems.length > 0 ? `${adjustmentItems.length} productos en la lista.` : 'Selecciona los productos que deseas ajustar.'}
                            </CustomText>

                            <View style={styles.adjustmentItemsContainer}>
                                {adjustmentItems.length > 0 ? (
                                    adjustmentItems.map(item => <AdjustmentItemRow key={item.id} item={item} />)
                                ) : (
                                    <CustomText style={styles.emptyListText}>La lista de ajuste está vacía.</CustomText>
                                )}
                            </View>

                            <TouchableOpacity onPress={() => setModalSearchProduct(true)} style={{ marginTop: 10 }}>
                                <Input
                                    placeholder="+ Añadir producto al ajuste"
                                    value={''}
                                    editable={false}
                                    style={{ textAlign: 'center', color: 'rgb(165, 132, 255)' }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* --- TOTALES --- */}
                        {adjustmentItems.length > 0 && (
                            <View style={styles.totalsContainer}>
                                <CustomText style={styles.totalText}>Total del Ajuste</CustomText>
                                <CustomText style={styles.totalAmount}>${totalAdjustmentCost.toFixed(2)}</CustomText>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={{ padding: 20 }}>
                <Button title="Guardar ajuste" onPress={handleSaveAdjustment} />
            </View>

            {/* Modal para seleccionar motivo */}
            <ModalOptions visible={showReasonModal} onClose={() => setShowReasonModal(false)}>
                <View style={{ marginBottom: 8 }}>
                    <CustomText>Selecciona el motivo del ajuste</CustomText>
                    <CustomText style={{ fontSize: 12, color: 'gray' }}>Elige la razón por la cual estás haciendo este ajuste.</CustomText>
                </View>

                <FlatList 
                    style={{ marginTop: 12, maxHeight: 400 }} 
                    data={Object.entries(REASON_LABELS)}
                    renderItem={({ item: [key, label] }) => (
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setReason(key as AdjustmentReasonType);
                                setShowReasonModal(false);
                            }}
                        >
                            <CustomText style={styles.modalOptionText}>{label}</CustomText>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item[0]}
                />
            </ModalOptions>

            {/* Modal para buscar productos */}
            <ModalOptions visible={modalSearchProduct} onClose={() => setModalSearchProduct(false)}>
                <View style={{ gap: 10 }}>
                    <CustomText>Selecciona el producto.</CustomText>
                    <View style={{ flexDirection: 'row' }}>
                        <Input 
                            placeholder="Buscar por nombre o código de barras..." 
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ flex: 1, textAlign: 'left' }}
                        />
                        <IconCamera height={45} width={45} fill={'rgb(165, 132, 255)'} />
                    </View>
                </View>
                <FlatList 
                    style={{ marginTop: 12, maxHeight: 400 }} 
                    data={searchResults}
                    renderItem={({ item }) => <ProductCardReduced product={item} addProductToAdjustment={addProductToAdjustment}/>}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<CustomText style={{ textAlign: 'center', marginTop: 20 }}>No se encontraron productos.</CustomText>}
                />
            </ModalOptions>

            <CustomAlert {...alertState} onClose={hideAlert} isLoading={loadingAdjustments} />
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        marginBottom: 20,
    },
    productCard: {
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        overflow: 'hidden'
    },
    productCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        backgroundColor: 'white'
    },
    productCardBody: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 4
    },
    productInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productInfoLabel: {
        color: 'gray',
        fontSize: 13
    },
    productInfoValue: {
        fontSize: 13,
        fontWeight: '500'
    },
    productCardFooter: {
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(165, 132, 255, 0.05)',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    productCost: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(165, 132, 255)'
    },
    adjustmentItemsContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        gap: 10,
    },
    adjustmentItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        padding: 8,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'center'
    },
    emptyListText: {
        textAlign: 'center',
        color: 'gray',
        paddingVertical: 20
    },
    totalsContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center'
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgb(165, 132, 255)',
        marginTop: 5
    },
    modalOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
});