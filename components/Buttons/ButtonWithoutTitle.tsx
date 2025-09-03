import { TouchableOpacity } from "react-native"

export const ButtonWithoutTitle = ({ icon, onPress }: { icon: React.ReactNode, onPress: () => void}) => {
    return (
        <TouchableOpacity onPress={onPress}
        style={{
            padding: 10,
            borderRadius: 100,
            backgroundColor: 'rgba(192, 192, 192, 0.17)',
            borderWidth: 1, 
            borderColor: 'rgb(145, 124, 32)',
            borderStyle: 'dashed',
        }}
        >
            {icon}
        </TouchableOpacity> 
    )
  }