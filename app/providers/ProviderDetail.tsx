import { ScrollView, Share, View } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { useAlert } from "shared/hooks/useAlert";
import CustomAlert from "shared/components/CustomAlert";
import { useProviderStore } from "@flux/stores/useProviderStore";
import LogoPage from "@components/LogoPage/LogoPage";
import { DetailRow } from "shared/components/DetailRow";
import { ButtonWithoutTitle } from "@components/Buttons/ButtonWithoutTitle";
import { MaterialIcons } from "@expo/vector-icons";
import { useShopStore } from "@flux/stores/useShopStore";
import { router } from "expo-router";
import { ProviderService } from "@flux/services/Providers/ProviderService";
import { softDeleteProviderSuccessAction } from "@flux/Actions/ProviderActions";
import useAuthStore from "@flux/stores/AuthStore";
import { useCallback } from "react";

export default function ProviderDetail() {
    const { stores } = useShopStore()
    const { user } = useAuthStore() 
    const { selectedProvider, dispatch } = useProviderStore()
    const { alertState, hideAlert, showSuccess, showError } = useAlert()

    const formatDate = (date: string | Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const dateFormated = new Date(date).toLocaleDateString('es-ES', options);
        return dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
    };

    const storeName = stores.find(store => store.id === selectedProvider?.store_id)?.name || 'Sin tienda'

    const handleUpdateProvider = () => {
        router.push(`/providers/create?mode=update`)
    }

    const handleSoftDelete = async () => {
        if (!selectedProvider?.id) return;

        showSuccess('¿Estas seguro de eliminar este proveedor?', {
            requiresConfirmation: true,
            onConfirm: async () => {
                const { data, error } = await ProviderService.delete(selectedProvider.id, selectedProvider.store_id)
                if (data) {
                    dispatch(softDeleteProviderSuccessAction(data))
                    showSuccess(`El proveedor ${selectedProvider.name} se ha eliminado correctamente!`)
                    router.back()
                }
                if (error) {
                    showError(error, { icon: 'error' })
                    return
                }
            }
        })
    }

    const handleShare = useCallback(async () => {
        if (!selectedProvider?.id) return;

        try {
            await Share.share({
                title: `Hola soy ${user?.name}! Comparto contigo el detalle de un proveedor.`,
                message: `Hola soy ${user?.name}! Comparto contigo el detalle de un proveedor.\n\n` +
                `Detalles del proveedor:\n\n` +
                    `Nombre: ${selectedProvider.name}\n` +
                        `Código de proveedor: ${selectedProvider.id}\n` +
                        `Tienda de registro: ${storeName}\n` +
                        `Telefono: ${selectedProvider.contact_phone}\n` +
                        `Correo: ${selectedProvider.contact_email}\n`
            });
        } catch (error) {
            console.error('Error sharing provider:', error);
        }
    }, [selectedProvider, user, storeName]);

    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View>
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                    <View>
                        <LogoPage height={20} width={80}/>
                    </View>
                    <CustomText style={{ fontSize: 14 }}>Proveedores</CustomText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
                        <ButtonWithoutTitle icon={<MaterialIcons name="edit" size={24} color="black" />} onPress={handleUpdateProvider} />
                        <ButtonWithoutTitle icon={<MaterialIcons name="delete" size={24} color="black" />} onPress={handleSoftDelete} />
                        <ButtonWithoutTitle icon={<MaterialIcons name="share" size={24} color="black" />} onPress={handleShare} />
                    </View>
                </View>

                <View style={{ marginTop: 20, padding: 20 }}>
                    <DetailRow label="Nombre" value={selectedProvider?.name || 'Sin nombre'}/>
                    <DetailRow label="Descripción" value={selectedProvider?.description || 'Sin descripción'} />
                    <DetailRow label="Tienda de registro" value={storeName}/>
                    <DetailRow label="Telefono" value={selectedProvider?.contact_phone || 'Sin telefono'} />
                    <DetailRow label="Correo" value={selectedProvider?.contact_email || 'Sin correo'} />
                    <DetailRow label="Fecha de creación" 
                    value={formatDate(selectedProvider?.created_at || '') || 'Sin fecha'} 
                    />
                    <DetailRow label="Fecha de actualización" 
                    value={selectedProvider?.updated_at ? formatDate(selectedProvider?.updated_at) : 'Sin fecha'} 
                    />
                    <DetailRow label="Fecha de eliminación" 
                    value={selectedProvider?.deleted_at ? formatDate(selectedProvider?.deleted_at) : 'Sin fecha'} 
                    />
                    <DetailRow label="Estado" 
                    value={selectedProvider?.is_active ? 'Activo' : 'Inactivo'} 
                    />
                </View>
            </View>
        </ScrollView>

        <CustomAlert {...alertState} onClose={hideAlert} />
        </>
    )
}