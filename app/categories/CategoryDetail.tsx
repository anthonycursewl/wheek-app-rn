import { View, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Category } from "@flux/entities/Category";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, DataTable, Text } from "react-native-paper";
import { ButtonWithoutTitle } from "@components/Buttons/ButtonWithoutTitle";

// Components
import CustomText from "@components/CustomText/CustomText";
import { MaterialIcons } from "@expo/vector-icons";
import { useCategoryStore } from "@flux/stores/useCategoryStore";
import { categoryAttemptAction, categoryFailureAction, categorySuccessDeleteAction } from "@flux/Actions/CategoryAction";
import { CategoryService } from "@flux/services/Categories/CategoryService";
import LogoPage from "@components/LogoPage/LogoPage";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import CustomAlert from "shared/components/CustomAlert";

const formatDate = (date: Date | string) => {
  if (!date) return "N/A";
  return format(new Date(date), "PPPpp", { locale: es });
};

export default function CategoryDetail() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { dispatch, loading } = useCategoryStore();
  const { showResponse, alertState, hideAlert, showSuccess, showError } = useGlobalStore()

  const memoizedHideAlert = useCallback(() => {
    hideAlert();
  }, [hideAlert]);

  const categoryParsed: Category = useMemo(
    () => JSON.parse(decodeURIComponent(category)),
    [category]
  );

  const handleUpdateCategory = () => {
    router.push(`/categories/create?category=${encodeURIComponent(JSON.stringify(categoryParsed))}&mode=update`);
  };

  const handleSoftDeleteCategory = async () => {
      const categoryUpdated = { ...categoryParsed, is_active: !categoryParsed.is_active  };
      showSuccess('¿Estás seguro de que deseas eliminar esta categoría?', {
        requiresConfirmation: true,
        icon: 'info',
        onConfirm: async () => {
          dispatch(categoryAttemptAction());
          showSuccess('Eliminando categoría...', {
            icon: 'info',
            isLoading: true,
            autoHide: true,
          });

          const { data, error } = await CategoryService.updateCategory(
            categoryParsed.id, 
            categoryUpdated, 
            categoryParsed.store_id
          );
          
          if (data) {
            dispatch(categorySuccessDeleteAction(data));
            showResponse(`La categoría ${categoryParsed.name} se ha ${!categoryParsed.is_active ? 'activado' : 'desactivado'} correctamente!`, {
              icon: 'success',
              duration: 1000,
              autoHide: true,
              onClose: () => {
                router.back();
              },
            });
          } else if (error) {
            dispatch(categoryFailureAction(error));
            showError(error, { icon: 'error' })
          }
        },
        isLoading: loading
      });  
  };

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
        <View>
          <LogoPage width={80} height={20}/>
        </View>
        <CustomText style={{ fontSize: 12 }}>Categorias</CustomText>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        <ButtonWithoutTitle icon={<MaterialIcons name="edit" size={22} color="black" />} onPress={handleUpdateCategory} />
        <ButtonWithoutTitle icon={<MaterialIcons name="delete" size={22} color="black" />} onPress={() => handleSoftDeleteCategory()} />
      </View>

      <Card style={styles.card}>
        <Card.Title
          title={categoryParsed.name}
          titleStyle={styles.cardTitle}
          subtitle="Detalles de la Categoría"
        />
        <Card.Content>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.label}>ID</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.value}>{categoryParsed.id}</Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.label}>Nombre</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.value}>{categoryParsed.name}</Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.label}>ID de Tienda</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.value}>{categoryParsed.store_id}</Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.label}>Creado</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.value}>
                  {formatDate(categoryParsed.created_at)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.label}>Última actualización</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.value}>
                  {formatDate(categoryParsed.updated_at)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>

        <View style={{ marginTop: 20 }}>
            <CustomText style={{ fontSize: 12,
                color: 'rgb(97, 84, 29)',
                backgroundColor: 'rgba(211, 211, 211, 0.17)',
                padding: 10,
                borderWidth: 1, 
                borderColor: 'rgb(145, 124, 32)',
                borderStyle: 'dashed',
                borderRadius: 8,
              }}>Esta categoría solo puede ser editada/borrada con los permisos requeridos. Más info en la sección de ayuda.</CustomText>
        </View>
    </ScrollView>

    <CustomAlert {...alertState} onClose={memoizedHideAlert} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingTop: 60,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
    fontSize: 15,
    color: '#333',
  },
  value: {
    fontSize: 15,
    color: '#555',
  },
});