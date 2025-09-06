import LayoutScreen from "@components/Layout/LayoutScreen"
import LogoPage from "@components/LogoPage/LogoPage"
import { ActivityIndicator, View, Animated, Easing } from "react-native"
import { useEffect, useRef, useState } from "react"

export default function LoadingScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const [currentText, setCurrentText] = useState('Verificando sesión');
    const [isExiting, setIsExiting] = useState(false);

    const startExitAnimation = (onComplete?: () => void) => {
        setIsExiting(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease)
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 600,
                useNativeDriver: true
            })
        ]).start(onComplete);
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease)
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            })
        ]).start();

        const textTimer = setTimeout(() => {
            setCurrentText('Cargando datos');
        }, 1500);

        const exitTimer = setTimeout(() => {
            startExitAnimation();
        }, 3000);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(exitTimer);
        };
    }, [fadeAnim, scaleAnim]);

    return (
        <LayoutScreen>
            <Animated.View 
                style={[{
                    flex: 1, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }]}
            >
                <LogoPage height={50} width={80 * 2} />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                    <ActivityIndicator size="small" color="rgb(165, 133, 255)" />
                    <Animated.Text 
                        style={{
                            fontSize: 12,
                            color: isExiting ? '#999999' : '#a583ff',
                            opacity: fadeAnim
                        }}
                    >
                        {currentText}
                    </Animated.Text>
                </View>
            </Animated.View>
        </LayoutScreen>
    )
}