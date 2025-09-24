import BottomTabs from '@components/BottomTabs';
import { useEffect } from 'react';
import useAuthStore from '@flux/stores/AuthStore';
import { loginAttemptAction, loginFailureAction, verifySuccessAction } from '@flux/Actions/LoginActions';
import { AuthService } from '@flux/services/Auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// dependencies for tabs
import { tabs } from '@components/BottomTabs/Tabs/Tabs';
import { mainStyles } from '@components/dashboard/mainStyles';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default function Dashboard() {
  const { dispatch, authToken, error: errAuth } = useAuthStore()

  const verifyToken = async () => {
    dispatch(loginAttemptAction())
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      dispatch(loginFailureAction('Se ha vencido tu sesión. Por favor, vuelve a iniciar sesión.'))
      Alert.alert('Wheek | Error', errAuth || 'Ha ocurrido un error al verificar tu sesión.')
      await AsyncStorage.removeItem('token')
      router.replace('/')
      return
    }

    const { data, error } = await AuthService.verifyToken(token || authToken.access_token) 
    if (error) {
      dispatch(loginFailureAction(error))
      Alert.alert('Wheek | Error', error)
      await AsyncStorage.removeItem('token')
      router.replace('/')
      return
    }
    if (data) {
      dispatch(verifySuccessAction(data.value))
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  return (
    <BottomTabs 
      tabs={tabs}
      initialTab="home"
      style={mainStyles.container}
      tabBarStyle={mainStyles.tabBar}
      tabItemStyle={mainStyles.tabItem}
      activeTabItemStyle={mainStyles.activeTabItem}
      textStyle={mainStyles.tabText}
      activeTextStyle={mainStyles.activeTabText}
    />
  );
}

