import CustomText from "@components/CustomText/CustomText";
import LayoutScreen from "@components/Layout/LayoutScreen";
import LogoPage from "@components/LogoPage/LogoPage";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Input from "@components/Input/Input";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import IconCross from "svgs/IconCross";
import ModalOptions from "@components/Modals/ModalOptions";
import ListProviders from "@components/dashboard/providers/components/ListProviders";
import { useState, useEffect, useMemo } from "react";
import useAuthStore from "@flux/stores/AuthStore";
import { ProductSearchResult } from "@flux/entities/Product";
import { ProductService } from "@flux/services/Products/ProductService";
import IconManage from "svgs/IconManage";
import { IconCamera } from "svgs/IconCamera";
import Button from "@components/Buttons/Button";


// Interfaz para gestionar los items en la lista de la UI
// Extiende el resultado de la búsqueda y añade la cantidad
interface ReceptionLineItem extends ProductSearchResult {
    quantity: number;
}

// Interfaz para el payload final de la API
interface ReceptionItemPayload {
    product_id: string;
    quantity: number;
    cost_price: number; // Renombrado para coincidir con el schema
}

interface ReceptionPayload {
    store_id: string;
    user_id: string;
    provider_id?: string;
    notes?: string;
    items: ReceptionItemPayload[];
}

export default function CreateReception() {
    const { currentStore } = useGlobalStore();
    const { user } = useAuthStore();
    const { height } = useWindowDimensions();

    // --- ESTADOS ---
    const [modalProviderStuff, setModalProviderStuff] = useState({ visible: false, provider: '' });
    const [modalSearchProduct, setModalSearchProduct] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
    
    // El estado clave: la lista de productos seleccionados para la recepción
    const [receptionItems, setReceptionItems] = useState<ReceptionLineItem[]>([]);
    
    const [notes, setNotes] = useState('');
    const [providerId, setProviderId] = useState<string | undefined>();

    // --- LÓGICA DE BÚSQUEDA (con debounce) ---
    useEffect(() => {
        const searchProducts = async (term: string) => {
            if (!term) {
                setSearchResults([]);
                return;
            }
            const { data, error } = await ProductService.search(currentStore.id, term.trim());
            if (data && !error) {
                setSearchResults(data);
            }
        };

        const timer = setTimeout(() => {
            searchProducts(searchQuery);
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timer);
    }, [searchQuery, currentStore.id]);


    // --- MANEJO DE LA LISTA DE PRODUCTOS ---

    // 1. Añadir un producto a la lista (o incrementar su cantidad si ya existe)
    const addProductToReception = (product: ProductSearchResult) => {
        setReceptionItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem) {
                // Si ya existe, incrementamos su cantidad
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Si no existe, lo añadimos con cantidad 1
            return [...currentItems, { ...product, quantity: 1 }];
        });
        // Cerramos el modal y limpiamos la búsqueda para una mejor UX
        setModalSearchProduct(false);
        setSearchQuery('');
    };

    // 2. Cambiar la cantidad de un producto en la lista
    const handleQuantityChange = (productId: string, amount: number) => {
        setReceptionItems(currentItems =>
            currentItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) } // No permitir menos de 1
                    : item
            )
        );
    };

    // 3. Quitar un producto de la lista
    const removeProductFromReception = (productId: string) => {
        setReceptionItems(currentItems => currentItems.filter(item => item.id !== productId));
    };


    // --- CÁLCULOS (optimizados con useMemo) ---
    const totalReceptionCost = useMemo(() => {
        return receptionItems.reduce((total, item) => total + (item.quantity * item.cost), 0);
    }, [receptionItems]);


    // --- MANEJO DE PROVEEDOR ---
    const handleProviderPress = (name: string, id: string) => {
        setProviderId(id);
        setModalProviderStuff({ visible: false, provider: name });
    };

    const handleSaveReception = () => {
        const reception: ReceptionPayload = {
            store_id: currentStore.id,
            user_id: user?.id || '',
            provider_id: providerId,
            notes: notes,
            items: receptionItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                cost_price: item.cost,
            }))
        }
        console.log(reception)
    }

    // --- RENDERIZADO DE COMPONENTES INTERNOS ---
    const ProductCardReduced = ({ product }: { product: ProductSearchResult }) => (
        <TouchableOpacity onPress={() => addProductToReception(product)} style={styles.productCard}>
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

    const ReceptionItemRow = ({ item }: { item: ReceptionLineItem }) => (
        <View style={styles.receptionItemRow}>
            <View style={{ flex: 1, gap: 4 }}>
                <CustomText style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</CustomText>
                <CustomText style={{ fontSize: 13, color: 'gray' }}>
                    Subtotal: ${(item.quantity * item.cost).toFixed(2)}
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
                <TouchableOpacity onPress={() => removeProductFromReception(item.id)} style={[styles.controlButton, { marginLeft: 10 }]}>
                    <IconCross width={20} height={20} fill={'rgb(202, 50, 50)'} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <ScrollView>
                <View style={{ padding: 20, paddingBottom: 0, paddingTop: 40 }}>
                    {/* ... (Cabecera y selección de Tienda) ... */}
                    <View style={styleReception.main}>
                        <LogoPage />
                        <CustomText>Crear recepción</CustomText>
                    </View>

                    {/* ... (Tu código para el input de Tienda) ... */}
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
                            <CustomText>Proveedor</CustomText>
                            
                            <TouchableOpacity onPress={() => setModalProviderStuff({ ...modalProviderStuff, visible: true })}>
                                <Input 
                                    placeholder="Selecciona un proveedor..." 
                                    value={modalProviderStuff.provider} 
                                    editable={false}
                                    />
                            </TouchableOpacity>
                        </View>

                         <View style={{ gap: 10 }}> 
                            <CustomText>Notas</CustomText>
                            <Input 
                                placeholder="Escribe notas de la recepción..." 
                                value={notes} 
                                onChangeText={setNotes}
                                editable={true}
                                />
                        </View>
                        
                        {/* --- LISTA DE PRODUCTOS DE LA RECEPCIÓN --- */}
                        <View>
                            <CustomText>Productos</CustomText>
                            <CustomText style={{ fontSize: 12, color: 'rgb(130, 130, 130)', marginBottom: 10 }}>
                                {receptionItems.length > 0 ? `${receptionItems.length} productos en la lista.` : 'Selecciona los productos que deseas recibir.'}
                            </CustomText>

                            <View style={styles.receptionItemsContainer}>
                                {receptionItems.length > 0 ? (
                                    receptionItems.map(item => <ReceptionItemRow key={item.id} item={item} />)
                                ) : (
                                    <CustomText style={styles.emptyListText}>La lista de recepción está vacía.</CustomText>
                                )}
                            </View>

                            <TouchableOpacity onPress={() => setModalSearchProduct(true)} style={{ marginTop: 10 }}>
                                <Input
                                    placeholder="+ Añadir producto a la recepción"
                                    value={''}
                                    editable={false}
                                    style={{ textAlign: 'center', color: 'rgb(165, 132, 255)' }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* --- TOTALES --- */}
                        {receptionItems.length > 0 && (
                            <View style={styles.totalsContainer}>
                                <CustomText style={styles.totalText}>Total de la Recepción</CustomText>
                                <CustomText style={styles.totalAmount}>${totalReceptionCost.toFixed(2)}</CustomText>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={{ padding: 20 }}>
                <Button title="Guardar recepción" onPress={handleSaveReception} />
            </View>

            {/* ... (Modales) ... */}
            <ModalOptions visible={modalProviderStuff.visible} onClose={() => setModalProviderStuff({ ...modalProviderStuff, visible: false })}>
                <View style={{ marginBottom: 8 }}>
                    <CustomText>Selecciona el proveedor</CustomText>
                    <CustomText style={{ fontSize: 12, color: 'gray' }}>Si no tienes proveedores, puedes crear uno nuevo.</CustomText>
                </View>

                <ListProviders height={'80%'} onSelectProvider={(item) => handleProviderPress(item.name, item.id)} />
            </ModalOptions>


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
                    renderItem={({ item }) => <ProductCardReduced product={item} />}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<CustomText style={{ textAlign: 'center', marginTop: 20 }}>No se encontraron productos.</CustomText>}
                />
            </ModalOptions>
        </>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    // Estilos para la tarjeta de producto en el modal de búsqueda
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
    
    // Estilos para la lista de productos en la pantalla principal
    receptionItemsContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        gap: 10,
    },
    receptionItemRow: {
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

    // Estilos para los totales
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
        color: 'gray'
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5
    }
});

const styleReception = StyleSheet.create({
    main: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: 7, 
        width: '100%' 
    }
})