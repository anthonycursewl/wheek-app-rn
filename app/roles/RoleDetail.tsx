import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { View } from "react-native";
import { Role } from "@flux/entities/Role";
import { useRoleStore } from "@flux/stores/useRoleStore";
import { roleAttemptAction, roleFailureAction, roleSuccessGetAction } from "@flux/Actions/RoleActions";
import { RoleService } from "@flux/services/Roles/RoleService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import LogoPage from "@components/LogoPage/LogoPage";
import { ActivityIndicator } from "react-native-paper";

export default function RoleDetail() {
    const { dispatch, loading, error } = useRoleStore()
    const { currentStore } = useGlobalStore()
    const { role } = useLocalSearchParams()
    const roleData: Role = JSON.parse(decodeURIComponent(role as string))
    const [roleDetail, setRoleDetail] = useState<Role>({ 
        id: '',
        name: '',
        store_id: '',
        description: '',
        permissions: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        is_active: false
     })

    const handleLoadRoleDetail = async () => {
        dispatch(roleAttemptAction())
        const { data, error } = await RoleService.getRoleById(roleData.id, currentStore.id)

        if (error) return dispatch(roleFailureAction(error))
        if (data) {
            dispatch(roleSuccessGetAction(data))
            setRoleDetail(data)
            return 
        }
    }

    useEffect(() => {
        handleLoadRoleDetail()
    }, [])

    if (loading) return <ActivityIndicator size="small" color="black" />

    const DetailRole = ({ label, value }: { label: string, value: string }) => {
        return (
            <View style={{ gap: 5, borderBottomWidth: 1, borderBottomColor: 'rgb(226, 226, 226)', paddingVertical: 10 }}>
                <CustomText style={{ fontSize: 15, color: 'rgb(85, 85, 85)' }}>{label}</CustomText>
                <CustomText style={{ fontSize: 16 }}>{value}</CustomText>
            </View>
        )
    }

    const parseDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <SafeAreaView style={style.main}>
            <View style={{ alignItems: 'center', marginTop: 15, marginBottom: 15 }}>
                <LogoPage height={25}/>
                <CustomText style={{ fontSize: 14 }}>Roles</CustomText>
            </View>

            <View style={{ gap: 15 }}>
                <DetailRole label="Nombre" value={roleDetail.name} />
                <DetailRole label="Descripción" value={roleDetail.description || ''} />
                <DetailRole label="ID de la tienda" value={roleDetail.store_id.slice(0, 30) + "..."} />                
                <DetailRole label="Fecha de Creación" value={parseDate(roleDetail.created_at)} />                
                <DetailRole label="Fecha de Actualización" value={parseDate(roleDetail.updated_at || new Date())} />
                                
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    main: {
        flex: 1,
        padding: 16,
        paddingTop: 40,
        paddingHorizontal: 20
    }
})