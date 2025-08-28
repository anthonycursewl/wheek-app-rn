import { View, TouchableOpacity } from "react-native"
import CustomText from "@components/CustomText/CustomText"
import { Role } from "@flux/entities/Role"

export const RoleItem = ({ item, onPress }: { item: Role, onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ padding: 12, 
                borderWidth: 1,
                borderColor: 'rgb(223, 222, 222)',
                borderRadius: 8,
                gap: 8
                }}>
                <View> 
                    <CustomText style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</CustomText>
                    <CustomText style={{ fontSize: 13, color: 'rgb(136, 111, 207)' }}>Creado el {new Date(item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</CustomText>
                </View>

                <View>
                    <CustomText>Estado</CustomText>
                    <CustomText style={{ fontSize: 14, color: item.is_active ? 'rgb(62, 189, 119)' : 'rgb(255, 0, 0)' }}>{item.is_active ? 'Activo' : 'Inactivo'}</CustomText>
                </View>

                <CustomText style={{ fontSize: 14, color: 'rgb(119, 119, 119)' }}>{item.description}</CustomText>
            </View> 
        </TouchableOpacity>
    )
}