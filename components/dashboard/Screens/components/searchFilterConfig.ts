import { FilterConfig } from 'shared/components/FilterModal';

export const searchFilterConfig: FilterConfig = [
  {
    title: 'Tipo de contenido',
    icon: require('svgs/IconFilter').IconFilter({ width: 20, height: 20, fill: 'rgb(146, 146, 146)' }),
    items: [
      { label: 'Productos', key: 'products' },
      { label: 'Categorías', key: 'categories' },
      { label: 'Proveedores', key: 'providers' },
      { label: 'Inventario', key: 'inventory' },
      { label: 'Recepciones', key: 'receptions' },
      { label: 'Miembros', key: 'members' },
    ]
  },
  {
    title: 'Fecha',
    icon: require('svgs/IconDate').IconDate({ width: 20, height: 20, fill: 'rgb(146, 146, 146)' }),
    items: [
      { label: 'Hoy', key: 'today' },
      { label: 'Esta semana', key: 'thisWeek' },
      { label: 'Este mes', key: 'thisMonth' },
      { label: 'Rango de fechas', key: 'dateRange', type: 'dateRange' },
    ]
  },
  {
    title: 'Estado',
    icon: require('svgs/IconFilter').IconFilter({ width: 20, height: 20, fill: 'rgb(146, 146, 146)' }),
    items: [
      { label: 'Activos', key: 'active' },
      { label: 'Inactivos', key: 'inactive' },
      { label: 'Mostrar eliminados', key: 'deleted' },
    ]
  },
  {
    title: 'Ordenar',
    icon: require('svgs/IconOrder').IconOrder({ width: 20, height: 20, fill: 'rgb(146, 146, 146)' }),
    items: [
      { label: 'Más relevantes', key: 'relevance' },
      { label: 'A-Z', key: 'asc' },
      { label: 'Z-A', key: 'desc' },
      { label: 'Más recientes', key: 'newest' },
      { label: 'Más antiguos', key: 'oldest' },
    ]
  }
];

export const initialSearchFilters = {
  products: true,
  categories: true,
  providers: true,
  inventory: true,
  receptions: true,
  members: true,
  today: false,
  thisWeek: false,
  thisMonth: false,
  dateRange: { startDate: null, endDate: null },
  active: false,
  inactive: false,
  deleted: false,
  relevance: true,
  asc: false,
  desc: false,
  newest: false,
  oldest: false,
};
