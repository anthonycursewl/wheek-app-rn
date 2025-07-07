import { TouchableOpacity, View } from "react-native";
import CustomText from "../CustomText/CustomText";
import IconStores from "svgs/IconStores";
import { StyleSheet } from "react-native";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { StoreData } from "@flux/entities/Store";

export default function TypeStore({ store, setModalVisible }: { store: StoreData, setModalVisible: (visible: boolean) => void }) {
    const { currentStore, setCurrentStore } = useGlobalStore()

    const handlePress = () => {
        setCurrentStore(store)
        setModalVisible(false)
    }

    return (
        <TouchableOpacity onPress={() => handlePress()}
            style={currentStore.id === store.id ? {...styleTypeStore.container, ...styleTypeStore.selected} : styleTypeStore.container}>
            <View style={currentStore.id === store.id ? styleTypeStore.selectedLabel : {}}></View>
            <View style={currentStore.id === store.id ? styleTypeStore.selectedLabel2 : {}}></View>

            <IconStores width={40} height={40} />
            <CustomText style={styleTypeStore.title}>{store.name}</CustomText>
        </TouchableOpacity>
    )
}

const styleTypeStore = StyleSheet.create({
    container: { 
        padding: 10, 
        backgroundColor: 'rgb(243, 243, 243)', 
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        height: 100,
        position: 'relative',
        overflow: 'hidden'
    },
    selected: {
        borderColor: 'rgb(222, 203, 252)',
        borderWidth: 1,
    },
    title: {
        fontSize: 14,
        textAlign: 'center'
    }, 
    selectedLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 20,
        width: 50,
        backgroundColor: 'rgb(207, 148, 255)',
        filter: 'blur(10px)',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    selectedLabel2: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 20,
        width: 50,
        backgroundColor: 'rgb(255, 143, 99)',
        filter: 'blur(10px)',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
    }
})