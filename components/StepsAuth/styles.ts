import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const stylesSteps = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    stepContainer: {
        width: '100%',
        alignItems: 'flex-start',
        transform: [{ scale: 1 }],
    },
    successContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        transform: [{ scale: 1 }],
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
        transform: [{ scale: 1 }],
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
        opacity: 1,
        marginTop: 50,
        transform: [{ scale: 1 }],
    },
    label: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
    },
    errorText: {
        color: '#ff3b30',
        marginTop: 5,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    secondaryButton: {
        marginRight: 10,
        flex: 1,
    },
    fullWidthButton: {
        width: '100%',
        marginTop: 20,
    },
    hintText: {
        color: '#666',
        fontSize: 12,
        marginTop: 15,
        marginBottom: 8,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    successText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
        lineHeight: 24,
    },
    linkText: {
        color: 'rgb(108, 94, 131)',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'right',
    },
    successSubtext: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    decorationRight: {
        position: 'absolute',
        right: -30,
        top: 15,
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: 'rgb(207, 148, 255)',
        borderRadius: width * 0.2,
        filter: 'blur(80px)',
    },
    decorationLeft: {
        position: 'absolute',
        left: -30,
        top: 30,
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: 'rgb(255, 143, 99)',
        borderRadius: width * 0.2,
        filter: 'blur(80px)',
    },
    linkTextContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
});