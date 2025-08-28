// Custom components
import LayoutScreen from "@components/Layout/LayoutScreen"
import CustomText from "@components/CustomText/CustomText"
import LogoPage from "@components/LogoPage/LogoPage"
import Input from "@components/Input/Input"
import Button from "@components/Buttons/Button"

// global store
import { useGlobalStore } from "@flux/stores/useGlobalStore"

// Core stuff
import { View, StyleSheet, ScrollView, Switch } from "react-native"
import StoreLogo from "svgs/StoreLogo"
import { useState } from "react"

type Permission = {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

type Permissions = {
  products: Permission
  categories: Permission
  providers: Permission
  roles: Permission
  stores: Permission
}

const defaultPermission: Permission = {
  create: false,
  read: false,
  update: false,
  delete: false
}

export default function CreateRole() {
  const { currentStore } = useGlobalStore()
  const [permissions, setPermissions] = useState<Permissions>({
    products: { ...defaultPermission },
    categories: { ...defaultPermission },
    providers: { ...defaultPermission },
    roles: { ...defaultPermission },
    stores: { ...defaultPermission, read: true, update: true }
  })

  const Block = ({ label, placeholder }: { label: string, placeholder: string }) => {
    return (
      <View style={{ gap: 10 }}>
        <CustomText>{label}</CustomText>
        <Input placeholder={placeholder} />
      </View>
    )
  }

  const PermissionToggle = ({ 
    module, 
    permission, 
    label 
  }: { 
    module: keyof Permissions
    permission: keyof Permission
    label: string 
  }) => {
    const isDisabled = module === 'stores' && (permission === 'create' || permission === 'delete')

    return (
      <View style={styles.permissionRow}>
        <CustomText style={styles.permissionLabel}>{label}</CustomText>
        <Switch
          value={permissions[module][permission]}
          onValueChange={(value) => {
            if (isDisabled) return
            setPermissions(prev => ({
              ...prev,
              [module]: {
                ...prev[module],
                [permission]: value
              }
            }))
          }}
          disabled={isDisabled}
          trackColor={{ false: '#f4f3f4', true: '#7e57c2' }}
          thumbColor={permissions[module][permission] ? '#5e35b1' : '#f4f3f4'}
        />
      </View>
    )
  }

  const PermissionSection = ({ module, title }: { module: keyof Permissions, title: string }) => (
    <View style={styles.section}>
      <CustomText style={styles.sectionTitle}>{title}</CustomText>
      <View>
        <View>
            <PermissionToggle module={module} permission="read" label="Ver" />
            <CustomText style={styles.permissionsDescription}>Leer información de {title.toLowerCase()} mediante API o desde la app.</CustomText>
        </View>

        {module !== 'stores' && 
        <View>
            <PermissionToggle module={module} permission="create" label="Crear" />
            <CustomText style={styles.permissionsDescription}>Crear {title.toLowerCase()} mediante API o desde la app.</CustomText>
        </View>}

        <View>
            <PermissionToggle module={module} permission="update" label="Editar" />
            <CustomText style={styles.permissionsDescription}>Editar {title.toLowerCase()} mediante API o desde la app.</CustomText>
        </View>

        {module !== 'stores' && 
        <View>
            <PermissionToggle module={module} permission="delete" label="Eliminar" />
            <CustomText style={styles.permissionsDescription}>Eliminar {title.toLowerCase()} mediante API o desde la app.</CustomText>
        </View>
        }
      </View>
    </View>
  )

  return (
    <LayoutScreen>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <LogoPage />
        </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={{ gap: 15 }}>
          <View style={styles.storeName}>
            <StoreLogo style={{ width: 20, height: 20 }}/>
            <CustomText style={{ fontSize: 14 }}>{currentStore.name}</CustomText>
          </View>

          <Block label="Nombre del rol" placeholder="Nombre del rol" />
          <Block label="Descripción del rol" placeholder="Descripción del rol" />

          <View>
            <CustomText style={styles.permissionsTitle}>Permisos</CustomText>
            <CustomText style={styles.permissionsDescription}>Estos permisos se aplicarán al role que está siendo creado.</CustomText>

            <View style={{ gap: 15 }}>
              <PermissionSection module="products" title="Productos" />
              <PermissionSection module="categories" title="Categorías" />
              <PermissionSection module="providers" title="Proveedores" />
              <PermissionSection module="roles" title="Roles" />
              <PermissionSection module="stores" title="Tiendas" />
            </View>
          </View>
        </View>

        <Button 
          title="Guardar rol" 
          onPress={() => {
            console.log('Permisos seleccionados:', permissions)
          }} 
          style={{ marginTop: 30, marginBottom: 20 }} 
        />
      </ScrollView>
    </LayoutScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30
  },
  storeName: { 
    padding: 10, 
    borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1, 
    borderColor: 'rgb(155, 155, 155)',
    borderStyle: 'dashed', 
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  permissionsDescription: {
    fontSize: 12,
    color: 'rgb(158, 158, 158)',
    marginBottom: 10
  },
  section: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'rgb(59, 59, 59)'
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionLabel: {
    fontSize: 15,
    color: 'rgb(27, 27, 27)', 
  }
})
