import { View, StyleSheet } from "react-native";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import ListCategory from "../components/ListCategory";

export default function CategoryManagement() {
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Button title="Crear categoría" 
                onPress={() => router.push('/categories/create')}/>

                <ListCategory height={'93%'} onSelectCategory={(item) => 
                    {
                        router.push(`/categories/CategoryDetail?category=${encodeURIComponent(JSON.stringify(item))}`)
                    }
                } />
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
});