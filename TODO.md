# Wheek App - Tareas Pendientes

## 🛠️ En Desarrollo
- [x] [TAR-001] Mejoras en el módulo de categorías
  - [x] Corregir actualización de categorías
  - [x] Mejorar manejo de errores
  - [x] Mejorar manejo de soft delete en categorias.
- [x] [TAR-002] Modulo de providers
  - [x] Hacer la vista para mostrar detalles del provider.
  - [x] Refactorizar la vista de creación de provider para ser usada como vista de actualización `providers/create.tsx`.
  - [x] Implementar el soft delete.
  - [x] Implementar el share para compartir datos del provider mediante email, whatsapp y telegram.
- [x] [TAR-003] Modulo de roles.
  - [x] Hacer la vista para mostrar detalles del rol.
  - [x] Refactorizar la vista de creación de rol para ser usada en la vista de actualización `roles/create.tsx`.
  - [x] Implementar el soft delete solo para roles con `$role:manage`.
- [x] [TAR-004] Modulo de permisos.
  - [x] Hacer la vista para mostrar detalles del permiso donde se muestra el rol, mostrar los permisos del rol.
- [ ] [TAR-005] Modulo de miembros de la tienda.
  - [ ] Hacer la vista para mostrar detalles del miembro de la tienda.
  - [ ] Hacer la vista para poder mostrar los miembros de la tienda en total.
  - [ ] Implementar la invitación de miembros en la tienda mediante tokens.
  - [ ] Implementar el soft delete (solo para roles con `$stores:delete`).
  - [ ] Implementar la eliminación de miembros de la tienda manteniendo los datos ingresados del miembro.
- [ ] [TAR-006] Hacer filtros inteligente para las listas de cada entidad.
  - [ ] Implementar filtros inteligentes para las listas de cada entidad.
  - [ ] Implementar la paginación personalizada.
  - [ ] Implementar la vista de trash para mostrar los datos eliminados con soft-delete.

## 📋 Pendientes
### 🐞 Errores
- [x] [BUG-001] Alerta tiene problemas de renderizado.
  - [x] Corregir el renderizado del button de la alerta para evitar que se renderice antes que el modal.

### ✨ Mejoras
- [ ] [FEAT-001] Agregar búsqueda en listados
  - [ ] Componente de búsqueda
  - [ ] Lógica de filtrado

### 📱 UI/UX
- [x] Mejorar pantalla de carga
- [x] Agregar animaciones de transición

### 🔄 Refactorización
- [x] Mejorar manejo de estados globales
- [x] Optimizar rendimiento de listas

## 🔄 Revisión Pendiente
- [x] Revisar implementación de soft delete (todas las entidades)
- [x] Probar flujo completo de categorías
- [ ] Probar flujo completo de roles
- [ ] Probar flujo completo de permisos
- [ ] Probar flujo completo de miembros de la tienda
- [ ] Probar flujo completo de ventas
- [ ] Probar flujo completo de inventarios

## 📊 Métricas
- [ ] Configurar Analytics
- [ ] Monitorear rendimiento

## 📝 Documentación
- [ ] Actualizar README
- [ ] Documentar API

## 🔍 Pruebas
- [ ] Pruebas unitarias para stores
- [ ] Pruebas de integración
- [ ] Pruebas e2e