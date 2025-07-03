import BottomTabs from '@components/BottomTabs';
import { useEffect } from 'react';
import useAuthStore from '@flux/stores/AuthStore';
import { loginAttemptAction, loginFailureAction, verifySuccessAction } from '@flux/Actions/LoginActions';
import { AuthService } from '@flux/services/Auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// dependencies for tabs
import { tabs } from '@components/BottomTabs/Tabs/Tabs';
import { mainStyles } from '@components/dashboard/mainStyles';

export default function Dashboard() {
  const { dispatch, authToken } = useAuthStore()

  const verifyToken = async () => {
    dispatch(loginAttemptAction())
    const token = await AsyncStorage.getItem('token')

    const { data, error } = await AuthService.verifyToken(token || authToken.access_token) 
    if (error) {
      dispatch(loginFailureAction(error))
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

