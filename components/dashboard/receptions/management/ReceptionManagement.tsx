import { View, StyleSheet } from "react-native";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import ListReceptions from "../components/ListReceptions";
import { useCallback } from "react";
import { Reception } from "@flux/entities/Reception";

export default function ReceptionManagement() {
    const handleTapToCreate = useCallback(() => {
        router.push('/receptions/create?mode=create');
    }, []);

    const handleTapCard = useCallback((reception: Reception) => {
        router.push(`/receptions/ReceptionDetail?reception=${encodeURIComponent(JSON.stringify(reception))}`);
    }, []);

    return (    
        <View style={styles.container}>
            <View style={styles.content}>
                <Button title="Crear recepción" onPress={handleTapToCreate} />

                <ListReceptions onPress={(reception) => handleTapCard(reception)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        gap: 10,
        marginTop: 15,
    },
})