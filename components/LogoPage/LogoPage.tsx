import { Image, StyleSheet, View } from "react-native";

export default function LogoPage({ height = 50, width = 80 }: { height?: number, width?: number }) {
    return (
        <View style={{ position: 'relative' }}>
            <View style={stylesCreateProduct.decorationRight}></View>
            <Image source={require('@assets/images/wheek/wheek.png')} style={{ width: width, height: height }} resizeMode="contain" />
            <View style={stylesCreateProduct.decorationLeft}></View>
        </View>
    )
}

const stylesCreateProduct = StyleSheet.create({
    decorationRight: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: -12,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(255, 143, 99)',
        borderRadius: 12,
        filter: 'blur(24px)'
    }, 
    decorationLeft: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: 12,
        left: '50%',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(207, 148, 255)',
        borderRadius: 12,
        filter: 'blur(24px)'
    }
})