import IconHome from "svgs/IconHome"
import IconSearch from "svgs/IconSearch"
import IconHeart from "svgs/IconHeart"
import IconProfile from "svgs/IconProfile"
import { HomeScreen } from "@components/dashboard/Screens/HomeScreen"
import { SearchScreen } from "@components/dashboard/Screens/SearchScreen"
import { FavoritesScreen } from "@components/dashboard/Screens/FavoritesScreen"
import { ProfileScreen } from "@components/dashboard/Screens/ProfileScreen"

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
      id: 'favorites',
      label: 'Favoritos',
      icon: <IconHeart width={20} height={20} />,
      component: <FavoritesScreen />
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <IconProfile width={20} height={20} />,
      component: <ProfileScreen />
    }
]