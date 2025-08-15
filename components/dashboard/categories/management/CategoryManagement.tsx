import { View } from "react-native";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import ListCategory from "../components/ListCategory";

export default function CategoryManagement() {
    
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ width: '100%', marginTop: 20, gap: 10 }}>
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