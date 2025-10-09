<div align="center">
  <img src="assets/images/wheek/wheek.png" alt="Wheek Logo" width="300">
  <h1>Wheek - Intelligent Business Management</h1>
  <p>Sistema completo de gestión empresarial con control de inventario, ventas y administración multi-tienda</p>
  
  [![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android%20%7C%20Web-brightgreen)]()
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Latest Version](https://img.shields.io/badge/Version-1.0.1-orange)]()
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61dafb.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54.0.12-000020.svg)](https://expo.dev/)
  [![Zustand](https://img.shields.io/badge/Zustand-5.0.5-orange.svg)](https://zustand-demo.pmnd.rs/)
</div>

---

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Sistema de Permisos](#-sistema-de-permisos)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🚀 Características Principales

### Gestión de Inventario
- ✅ Control de stock en tiempo real
- ✅ Alertas de inventario bajo
- ✅ Escaneo de códigos de barras
- ✅ Ajustes de inventario con historial
- ✅ Gestión de recepciones
- ✅ Soft delete con vista de papelera

### Ventas y Facturación
- ✅ Procesamiento rápido de ventas
- ✅ Sistema de checkout optimizado
- ✅ Generación de facturas
- ✅ Historial de transacciones
- ✅ Gestión de cajeros

### Administración de Productos
- ✅ CRUD completo de productos
- ✅ Categorización multinivel
- ✅ Gestión de proveedores
- ✅ Imágenes de productos
- ✅ Códigos de barras personalizados

### Multi-tienda
- ✅ Gestión centralizada de múltiples sucursales
- ✅ Sincronización de inventario
- ✅ Reportes por tienda
- ✅ Transferencias entre tiendas

### Sistema de Roles y Permisos
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Permisos granulares por módulo
- ✅ Gestión de miembros de tienda
- ✅ Invitaciones por token

### Funcionalidades Avanzadas
- ✅ Filtros inteligentes en todas las listas
- ✅ Paginación personalizada
- ✅ Sistema de soft delete
- ✅ Modo oscuro/claro automático
- ✅ Animaciones fluidas con Reanimated
- ✅ Soporte multiplataforma (iOS, Android, Web)

---

## 📦 Módulos del Sistema

### 🏪 Gestión de Tiendas (`/store`)
- Creación y administración de tiendas
- Configuración de parámetros
- Dashboard personalizado por tienda

### 📊 Categorías (`/categories`)
- Creación y edición de categorías
- Organización jerárquica
- Soft delete con recuperación
- Vista detallada de categorías

### 📦 Productos (`/products`)
- CRUD completo de productos
- Integración con categorías
- Escaneo de códigos de barras
- Gestión de precios y stock

### 🏢 Proveedores (`/providers`)
- Gestión de información de proveedores
- Historial de compras
- Compartir datos (Email, WhatsApp, Telegram)
- Soft delete

### 📥 Recepciones (`/receptions`)
- Registro de entrada de mercancía
- Vinculación con proveedores
- Actualización automática de inventario
- Generación de reportes detallados

### 📊 Reportes (`/receptions/report`)
- Visualización de reportes de recepciones
- Filtrado por fechas y proveedores
- Exportación de datos (próximamente)

### 🔧 Ajustes de Inventario (`/adjustments`)
- Corrección de discrepancias
- Historial de ajustes
- Motivos documentados

### 👥 Roles y Permisos (`/roles`)
- Creación de roles personalizados
- Asignación de permisos granulares
- Control de acceso por módulo
- Vista detallada de permisos

### 👤 Miembros (`/members`)
- Gestión de usuarios de la tienda
- Asignación de roles
- Invitaciones por token
- Control de cajeros

### 🛒 Checkout (`/checkout`)
- Proceso de venta rápido
- Múltiples métodos de pago
- Generación de tickets

### 🔐 Autenticación (`/auth`)
- Registro de usuarios
- Login seguro
- Gestión de sesiones

---

## 📸 Capturas de Pantalla

> 🚧 Próximamente - Las capturas de pantalla se agregarán en la siguiente actualización

---

## 🛠 Stack Tecnológico

### Framework Principal
- **React Native** `0.81.4` - Framework multiplataforma
- **Expo** `54.0.12` - Plataforma de desarrollo
- **TypeScript** `5.9.2` - Tipado estático

### Navegación
- **Expo Router** `6.0.10` - Sistema de routing basado en archivos
- **React Navigation** `7.x` - Navegación entre pantallas
- **@react-navigation/bottom-tabs** `7.3.10` - Tabs inferiores

### Estado y Data
- **Zustand** `5.0.5` - State management global
- **AsyncStorage** `2.2.0` - Persistencia local
- **Custom HTTP Client** - Cliente API seguro

### UI/UX
- **React Native Paper** `5.14.5` - Componentes Material Design
- **React Native Reanimated** `4.1.1` - Animaciones de alto rendimiento
- **Moti** `0.30.0` - Animaciones declarativas
- **React Native SVG** `15.12.1` - Soporte SVG
- **Expo Vector Icons** `15.0.2` - Iconos vectoriales
- **@react-native-community/blur** `4.4.1` - Efectos blur
- **Expo Linear Gradient** `15.0.7` - Gradientes

### Funcionalidades Nativas
- **Expo Camera** `17.0.8` - Cámara y escaneo
- **Expo Audio** `1.0.13` - Reproducción de audio
- **Expo Haptics** `15.0.7` - Feedback táctil
- **React Native Barcode SVG** `0.0.15` - Generación de códigos de barras
- **@react-native-community/datetimepicker** `8.4.4` - Selectores de fecha

### Herramientas de Desarrollo
- **ESLint** `9.25.0` - Linting
- **Babel** - Transpilación
- **Metro** - Bundler

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura limpia con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────┐
│              UI Layer (Components)              │
│  - Screen Components                            │
│  - Reusable UI Components                       │
│  - Custom Hooks                                 │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│         State Management (Zustand)              │
│  - Global Stores                                │
│  - Actions                                      │
│  - Selectors                                    │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│            Service Layer (Flux)                 │
│  - API Services                                 │
│  - Business Logic                               │
│  - Data Transformation                          │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Data Layer                         │
│  - REST API Client                              │
│  - AsyncStorage                                 │
│  - Cache Management                             │
└─────────────────────────────────────────────────┘
```

### Principios de Diseño

- **Component-Based Architecture**: Componentes reutilizables y modulares
- **Unidirectional Data Flow**: Flujo de datos predecible
- **Separation of Concerns**: Cada capa tiene responsabilidades específicas
- **Type Safety**: TypeScript en todo el proyecto
- **Performance First**: Optimización con useMemo, useCallback y React.memo

---

## 📥 Instalación

### Prerrequisitos

- **Node.js** 16+ (Recomendado: 18+)
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Dispositivo físico** con Expo Go, o
- **iOS Simulator** (macOS) / **Android Studio** (Windows/macOS/Linux)

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/anthonycursewl/wheek-app-rn.git
cd wheek-app-rn
```

#### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

#### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_BASE_URL=https://api.wheek.com
API_TIMEOUT=30000

# App Configuration
APP_NAME=Wheek
APP_VERSION=1.0.0

# Features Flags (opcional)
ENABLE_ANALYTICS=false
ENABLE_CAMERA=true
```

#### 4. Iniciar el servidor de desarrollo
```bash
npx expo start
```

#### 5. Ejecutar en plataforma específica

**iOS** (requiere macOS)
```bash
npm run ios
# o presiona 'i' en el terminal de Expo
```

**Android**
```bash
npm run android
# o presiona 'a' en el terminal de Expo
```

**Web**
```bash
npm run web
# o presiona 'w' en el terminal de Expo
```

**Dispositivo físico**
1. Instala **Expo Go** desde App Store (iOS) o Play Store (Android)
2. Escanea el QR code mostrado en el terminal

---

## 📁 Estructura del Proyecto

```
wheek-app-rn/
│
├── 📱 app/                          # Rutas de la aplicación (Expo Router)
│   ├── _layout.tsx                 # Layout principal
│   ├── index.tsx                   # Pantalla de inicio
│   ├── auth/                       # Autenticación
│   │   └── register.tsx            # Registro de usuarios
│   ├── dashboard/                  # Dashboard principal
│   │   └── index.tsx
│   ├── categories/                 # Módulo de categorías
│   │   ├── create.tsx              # Crear/Editar categoría
│   │   └── CategoryDetail.tsx      # Detalles de categoría
│   ├── products/                   # Módulo de productos
│   │   ├── create.tsx              # Crear/Editar producto
│   │   └── ProductDetail.tsx       # Detalles de producto
│   ├── providers/                  # Módulo de proveedores
│   │   ├── create.tsx              # Crear/Editar proveedor
│   │   └── ProviderDetail.tsx      # Detalles de proveedor
│   ├── roles/                      # Módulo de roles
│   │   ├── create.tsx              # Crear rol
│   │   ├── CreateRole.tsx          # Formulario de rol
│   │   └── RoleDetail.tsx          # Detalles de rol
│   ├── members/                    # Módulo de miembros
│   │   ├── members.tsx             # Lista de miembros
│   │   ├── MemberDetail.tsx        # Detalles de miembro
│   │   ├── CashiersList.tsx        # Lista de cajeros
│   │   ├── CashierDetail.tsx       # Detalles de cajero
│   │   └── invite.tsx              # Invitar miembros
│   ├── adjustments/                # Ajustes de inventario
│   │   ├── create.tsx              # Crear ajuste
│   │   └── AdjustmentDetail.tsx    # Detalles de ajuste
│   ├── receptions/                 # Recepciones
│   │   ├── create.tsx              # Crear recepción
│   │   ├── ReceptionDetail.tsx     # Detalles de recepción
│   │   └── report/                 # Reportes de recepciones
│   │       └── index.tsx           # Pantalla principal de reportes
│   ├── checkout/                   # Proceso de venta
│   │   └── checkout.tsx            # Pantalla de checkout
│   └── store/                      # Gestión de tiendas
│       ├── create.tsx              # Crear tienda
│       └── manage/                 # Administrar tienda
│
├── 🎨 assets/                       # Recursos estáticos
│   ├── fonts/                      # Fuentes personalizadas
│   │   └── Onest-Regular.ttf
│   ├── images/                     # Imágenes
│   │   └── wheek/                  # Logo y branding
│   └── sounds/                     # Efectos de sonido
│       └── beep_barcode.mp3        # Sonido de escaneo
│
├── 🧩 components/                   # Componentes reutilizables
│   ├── BottomTabs/                 # Navegación inferior
│   │   ├── index.tsx
│   │   └── Tabs/
│   ├── Buttons/                    # Botones personalizados
│   │   ├── Button.tsx
│   │   └── ButtonWithoutTitle.tsx
│   ├── Input/                      # Inputs de formulario
│   │   └── Input.tsx
│   ├── CustomText/                 # Textos personalizados
│   │   └── CustomText.tsx
│   ├── Layout/                     # Layouts
│   │   └── LayoutScreen.tsx
│   ├── LogoPage/                   # Componente de logo
│   │   └── LogoPage.tsx
│   ├── Modals/                     # Modales
│   │   └── ModalOptions.tsx
│   ├── StepsAuth/                  # Pasos de autenticación
│   │   ├── RenderRegisterSteps.tsx
│   │   ├── RenderStepsLogin.tsx
│   │   └── styles.ts
│   ├── TypeStore/                  # Selector de tipo de tienda
│   │   └── TypeStore.tsx
│   ├── ManagerStore/               # Gestión de tienda
│   │   ├── OptimizedTabBar.tsx
│   │   ├── OptimizedTabManager.tsx
│   │   ├── OptimizedTabView.tsx
│   │   ├── StoreHeader.tsx
│   │   ├── TabButton.tsx
│   │   └── TabConfig.tsx
│   └── dashboard/                  # Componentes del dashboard
│       ├── mainStyles.ts
│       ├── adjust/                 # Componentes de ajustes
│       ├── categories/             # Componentes de categorías
│       ├── inventory/              # Componentes de inventario
│       ├── members/                # Componentes de miembros
│       ├── products/               # Componentes de productos
│       ├── providers/              # Componentes de proveedores
│       ├── receptions/             # Componentes de recepciones
│       ├── roles/                  # Componentes de roles
│       └── Screens/                # Pantallas del dashboard
│
├── ⚙️ config/                       # Configuración
│   └── config.wheek.breadriuss.ts  # Config específica
│
├── 🎨 constants/                    # Constantes
│   └── ui/
│       └── colors.ts               # Paleta de colores
│
├── 🔌 contexts/                     # React Contexts
│   └── AuthContext.tsx             # Contexto de autenticación
│
├── 🌊 flux/                         # Flux Architecture
│   ├── Actions/                    # Action creators
│   │   ├── AdjustmentActions.ts
│   │   ├── CashierActions.ts
│   │   ├── CategoryAction.ts
│   │   ├── InventoryActions.ts
│   │   ├── LoginActions.ts
│   │   ├── MemberActions.ts
│   │   ├── ProductActions.ts
│   │   ├── ProviderActions.ts
│   │   ├── ReceptionActions.ts
│   │   ├── RegisterActions.ts
│   │   ├── RoleActions.ts
│   │   └── StoreActions.ts
│   ├── entities/                   # Entidades TypeScript
│   │   ├── Adjustment.tsx
│   │   ├── Category.ts
│   │   ├── Inventory.ts
│   │   ├── Product.ts
│   │   ├── Provider.ts
│   │   ├── Reception.tsx
│   │   ├── Role.ts
│   │   ├── Store.ts
│   │   └── User.ts
│   ├── services/                   # Servicios de API
│   │   ├── Adjustments/
│   │   ├── Auth/
│   │   ├── Cashiers/
│   │   ├── Categories/
│   │   ├── Cotizaciones/
│   │   ├── Inventory/
│   │   ├── Members/
│   │   ├── Notifications/
│   │   ├── Products/
│   │   ├── Providers/
│   │   └── Receptions/
│   └── stores/                     # Zustand stores
│
├── 🪝 hooks/                        # Custom Hooks
│   ├── index.ts
│   ├── useFilter.ts                # Hook de filtros
│   ├── useOptimizedTabs.ts         # Hook de tabs optimizados
│   └── http/                       # Hooks HTTP
│
├── 🔗 shared/                       # Código compartido
│   ├── components/                 # Componentes compartidos
│   ├── constants/                  # Constantes compartidas
│   ├── hooks/                      # Hooks compartidos
│   ├── interfaces/                 # Interfaces compartidas
│   └── services/                   # Servicios compartidos
│
├── 🎨 svgs/                         # Componentes SVG
│   ├── IconAdjust.tsx
│   ├── IconArrow.tsx
│   ├── IconCalendar.tsx
│   ├── IconCamera.tsx
│   ├── IconCart.tsx
│   ├── IconCategories.tsx
│   └── ... (más iconos)
│
├── 📝 Archivos de configuración
├── .gitignore                      # Archivos ignorados por Git
├── app.json                        # Configuración de Expo
├── babel.config.js                 # Configuración de Babel
├── eas.json                        # Configuración de EAS Build
├── eslint.config.js                # Configuración de ESLint
├── metro.config.js                 # Configuración de Metro
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración de TypeScript
├── paths.js                        # Alias de rutas
├── LICENSE                         # Licencia MIT
├── README.md                       # Este archivo
└── TODO.md                         # Lista de tareas
```

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web

# Ejecutar linter
npm run lint

# Reset del proyecto
npm run reset-project
```

### Guía de Estilo de Código

- ✅ Sigue las [React Native Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- ✅ Usa **TypeScript** para todos los componentes nuevos
- ✅ Prefiere **componentes funcionales** con hooks
- ✅ Usa **imports absolutos** configurados en `paths.js`
- ✅ Sigue las convenciones de nomenclatura existentes:
  - Componentes: `PascalCase`
  - Archivos: `camelCase.tsx` o `PascalCase.tsx` para componentes
  - Hooks: `use` prefix (ej: `useFilter`)
  - Constants: `UPPER_SNAKE_CASE`

### Gestión de Estado

El proyecto usa **Zustand** para el manejo de estado global:

```typescript
// Ejemplo de store
import { create } from 'zustand';

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    // ... lógica
    set({ loading: false });
  }
}));
```

**Estructura de Flux:**
- **Actions** (`flux/Actions/`): Definen las acciones disponibles
- **Stores** (`flux/stores/`): Estado global con Zustand
- **Services** (`flux/services/`): Llamadas a la API
- **Entities** (`flux/entities/`): Interfaces TypeScript

### Creación de Componentes

```typescript
// components/MiComponente/MiComponente.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MiComponenteProps {
  title: string;
  onPress?: () => void;
}

export const MiComponente: React.FC<MiComponenteProps> = ({ 
  title, 
  onPress 
}) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Navegación

El proyecto usa **Expo Router** con routing basado en archivos:

```typescript
// app/products/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  // ... lógica del componente
}
```

### Hooks Personalizados

```typescript
// hooks/useFilter.ts
export const useFilter = <T>(
  data: T[],
  searchTerm: string,
  filterKey: keyof T
) => {
  return useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      String(item[filterKey])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, filterKey]);
};
```

---

## 🔐 Sistema de Permisos

Wheek implementa un sistema de control de acceso basado en roles (RBAC) granular:

### Estructura de Permisos

```typescript
// Formato de permisos: $module:action
{
  "$products:create",   // Crear productos
  "$products:read",     // Ver productos
  "$products:update",   // Actualizar productos
  "$products:delete",   // Eliminar productos
  "$inventory:manage",  // Gestionar inventario
  "$roles:manage",      // Gestionar roles
  "$stores:delete"      // Eliminar tiendas
}
```

### Módulos con Permisos

- **Products**: CRUD de productos
- **Categories**: CRUD de categorías
- **Providers**: CRUD de proveedores
- **Inventory**: Gestión de inventario
- **Roles**: Gestión de roles y permisos
- **Stores**: Gestión de tiendas
- **Members**: Gestión de miembros
- **Sales**: Procesamiento de ventas

### Soft Delete

Todos los módulos principales implementan **soft delete** con vista de papelera:
- Los elementos eliminados no se borran permanentemente
- Vista de "Papelera" para recuperar elementos
- Solo usuarios con permisos específicos pueden eliminar permanentemente

---

## 🚀 Deployment

### Expo Application Services (EAS)

El proyecto está configurado para usar **EAS Build**:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Build para ambas plataformas
eas build --platform all
```

### Configuración EAS (`eas.json`)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### Builds Locales

```bash
# Android (APK)
npx expo build:android

# iOS (requiere macOS)
npx expo build:ios
```

---

## 🗺 Roadmap

### ✅ Completado
- [x] Sistema de autenticación
- [x] Módulo de categorías con soft delete
- [x] Módulo de proveedores con compartir
- [x] Módulo de roles y permisos
- [x] Filtros inteligentes y paginación
- [x] Vista de papelera
- [x] Ajustes de inventario
- [x] Recepciones de mercancía
- [x] Módulo completo de miembros
- [x] Sistema de ventas completo
- [x] Reportes y analytics

### 📋 Próximas Características
- [ ] Búsqueda avanzada en todos los módulos
- [ ] Dashboard con métricas en tiempo real
- [ ] Integración de pasarelas de pago
- [ ] Sistema de notificaciones push
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Modo offline
- [ ] Sincronización automática
- [ ] App para tablets optimizada

### 🔬 Testing
- [ ] Pruebas unitarias para stores
- [ ] Pruebas de integración
- [ ] Pruebas E2E con Detox

### 📚 Documentación
- [ ] Documentación de API completa
- [ ] Guía de componentes
- [ ] Videos tutoriales

Ver [TODO.md](TODO.md) para más detalles sobre las tareas pendientes.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí está cómo puedes ayudar:

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add some amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre** un Pull Request

###
