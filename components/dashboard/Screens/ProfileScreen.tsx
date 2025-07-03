import useAuthStore from "@flux/stores/AuthStore"
import LayoutScreen from "@components/Layout/LayoutScreen"
import Button from "@components/Buttons/Button"
import { logoutAttemptAction } from "@flux/Actions/LoginActions"
import { router } from "expo-router"
import CustomText from "@components/CustomText/CustomText"

export const ProfileScreen = () => {
    const { dispatch } = useAuthStore()
  
    return (
      <LayoutScreen>
        <Button title='Cerrar sesión' onPress={() => {
            dispatch(logoutAttemptAction())
            router.replace('/')
        }} variant='binary-square' />
  
      <CustomText>Perfil</CustomText>
    </LayoutScreen>
    )
  }