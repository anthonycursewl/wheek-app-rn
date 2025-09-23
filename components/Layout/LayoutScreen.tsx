import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LayoutScreen({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView style={styles.layout}>
            <View style={styles.layoutContent}>
                {children}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        backgroundColor: 'rgb(253, 253, 253)',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }, 
    layoutContent: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 12,
        flex: 1
    }
})
