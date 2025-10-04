import IconHome from "svgs/IconHome"
import IconSearch from "svgs/IconSearch"
import IconProfile from "svgs/IconProfile"
import { HomeScreen } from "@components/dashboard/Screens/HomeScreen"
import { SearchScreen } from "@components/dashboard/Screens/SearchScreen"
import NotificationsScreen from "@components/dashboard/Screens/NotificationsScreen"
import { ProfileScreen } from "@components/dashboard/Screens/ProfileScreen"
import { IconNotification } from "@svgs/IconNotification"

export const tabs = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <IconHome width={20} height={20} />,
      component: <HomeScreen />
    },
    {
      id: 'search',
      label: 'Buscar',
      icon: <IconSearch width={20} height={20} />,
      component: <SearchScreen />
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: <IconNotification width={20} height={20} fill={'rgb(113, 84, 150)'} />,
      component: <NotificationsScreen />
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <IconProfile width={20} height={20} />,
      component: <ProfileScreen />
    }
]