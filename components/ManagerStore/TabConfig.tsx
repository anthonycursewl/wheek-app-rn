import IconProducts from 'svgs/IconProducts';
import IconReceipts from 'svgs/IconReceipts';
import { IconReceptions } from 'svgs/IconReceptions';

import ProductManagement from '@components/dashboard/products/management/ProductManagement';
import CategoryManagement from '@components/dashboard/categories/management/CategoryManagement';
import ProviderManagement from '@components/dashboard/providers/management/ProviderManagement';
import ReceptionManagement from '@components/dashboard/receptions/management/ReceptionManagement';
import AdjustManagement from '@components/dashboard/adjust/management/AdjustManagement';
import RolesManagement from '@components/dashboard/roles/management/RolesManagement';
import IconManage from 'svgs/IconManage';
import { IconCategories } from 'svgs/IconCategories';
import { IconProviders } from 'svgs/IconProviders';
import { IconAdjust } from 'svgs/IconAdjust';
import { IconRoles } from 'svgs/IconRoles';
import { IconInventory } from 'svgs/IconInventory';
import InventoryManagement from '@components/dashboard/inventory/management/InventoryManagement';

const COLOR_TAB_DEFAULT = 'rgb(85, 85, 85)';

export const TABS_CONFIG = [
  { id: 'products', label: 'Productos', Icon: IconManage, Component: ProductManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

  { id: 'categories', label: 'Categorias', Icon: IconCategories, Component: CategoryManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

  { id: 'providers', label: 'Proveedores', Icon: IconProviders, Component: ProviderManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

  { id: 'expenses', label: 'Recepciones', Icon: IconReceptions, Component: ReceptionManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

  { id: 'receipts', label: 'Ajustes', Icon: IconAdjust, Component: AdjustManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

  { id: 'inventory', label: 'Inventario', Icon: IconInventory, Component: InventoryManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},
  { id: 'roles', label: 'Roles', Icon: IconRoles, Component: RolesManagement, 
    iconProps: { width: 20, height: 20, fill: COLOR_TAB_DEFAULT }},

];