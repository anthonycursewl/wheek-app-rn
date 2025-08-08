import useAuthStore from "@flux/stores/AuthStore"
import LayoutScreen from "@components/Layout/LayoutScreen"
import Button from "@components/Buttons/Button"
import { router } from "expo-router"
import CustomText from "@components/CustomText/CustomText"
import { useProviderStore } from "@flux/stores/useProviderStore"
import { useGlobalStore } from "@flux/stores/useGlobalStore"
import { useCategoryStore } from "@flux/stores/useCategoryStore"
import { useShopStore } from "@flux/stores/useShopStore"

export const ProfileScreen = () => {
    const { clearStore: lgprov } = useProviderStore()
    const { clearStore: lguser } = useAuthStore()
    const { clearStore: lggl } = useGlobalStore()
    const { clearStore: lgcat } = useCategoryStore()
    const { clearStore: lgshop } = useShopStore()

    const handleLogout = () => {
        lgprov()
        lguser()
        lggl()
        lgcat()
        lgshop()
        router.replace('/')
    }
  
    return (
      <LayoutScreen>
        <Button title='Cerrar sesión' onPress={handleLogout} variant='binary-square' />
  
      <CustomText>Perfil</CustomText>
    </LayoutScreen>
    )
  }