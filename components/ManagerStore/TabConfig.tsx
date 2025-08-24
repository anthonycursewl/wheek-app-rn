import IconProducts from 'svgs/IconProducts';
import IconExpenses from 'svgs/IconExpenses';
import IconReceipts from 'svgs/IconReceipts';
import ProductManagement from '@components/dashboard/products/management/ProductManagement';
import CategoryManagement from '@components/dashboard/categories/management/CategoryManagement';
import ProviderManagement from '@components/dashboard/providers/management/ProviderManagement';
import ReceptionManagement from '@components/dashboard/receptions/management/ReceptionManagement';
import AdjustManagement from '@components/dashboard/adjust/management/AdjustManagement';
import RolesManagement from '@components/dashboard/roles/management/RolesManagement';

export const TABS_CONFIG = [
  { id: 'products', label: 'Productos', Icon: IconProducts, Component: ProductManagement },
  { id: 'categories', label: 'Categorias', Icon: IconProducts, Component: CategoryManagement },
  { id: 'providers', label: 'Proveedores', Icon: IconProducts, Component: ProviderManagement },
  { id: 'expenses', label: 'Recepciones', Icon: IconExpenses, Component: ReceptionManagement },
  { id: 'receipts', label: 'Ajustes', Icon: IconReceipts, Component: AdjustManagement },
  { id: 'roles', label: 'Roles', Icon: IconReceipts, Component: RolesManagement },
];