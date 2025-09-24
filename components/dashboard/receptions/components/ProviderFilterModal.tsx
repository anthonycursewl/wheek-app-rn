import React from 'react';
import ModalOptions from '@components/Modals/ModalOptions';
import ListProviders from '@components/dashboard/providers/components/ListProviders';
import { Provider } from '@flux/entities/Provider';
import CustomText from '@components/CustomText/CustomText';
import { TouchableOpacity, View } from 'react-native';

interface ProviderFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onProviderSelect: (provider: Provider | null) => void;
    selectedProvider?: Provider | null;
}

export default function ProviderFilterModal({ 
    visible, 
    onClose, 
    onProviderSelect,
    selectedProvider 
}: ProviderFilterModalProps) {
    const handleProviderSelect = (provider: Provider) => {
        onProviderSelect(provider);
        onClose();
    };

    const handleClearSelection = () => {
        onProviderSelect(null);
        onClose();
    };

    return (
        <ModalOptions
            visible={visible}
            onClose={onClose}
        >
                <View style={{ 
                    backgroundColor: 'linear-gradient(135deg, #f3f4ff 0%, #e8eaff 100%)', 
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 16, 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#5E24FF20',
                    marginBottom: 10
                }}>
                    <View style={{ flex: 1 }}>
                        <CustomText style={{ 
                            color: 'rgb(114, 114, 114)', 
                            fontSize: 12,
                        }}>
                            Proveedor seleccionado
                        </CustomText>
                        <CustomText style={{ 
                            color: 'rgb(37, 37, 37)', 
                            fontSize: 14,
                            lineHeight: 24
                        }}>
                            {selectedProvider?.name || 'Sin seleccionar.'}
                        </CustomText>
                    </View>
                    <TouchableOpacity 
                        onPress={handleClearSelection}
                        style={{
                            backgroundColor: '#fee2e2',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#fecaca',
                        }}
                    >
                        <CustomText style={{ 
                            color: '#dc2626', 
                            fontWeight: '600', 
                            fontSize: 14
                        }}>
                            Limpiar
                        </CustomText>
                    </TouchableOpacity>
                </View>
            <ListProviders height={'82%'}
                onSelectProvider={handleProviderSelect}
            />
        </ModalOptions>
    );
}
