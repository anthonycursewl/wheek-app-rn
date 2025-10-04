import { View, TouchableOpacity } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { ListInventories } from "../components/ListInventories";
import { useWindowDimensions } from "react-native";
import { useFilters } from "@hooks/useFilter";
import { AppliedFilters, FilterConfig, FilterModal } from "@shared/components/FilterModal";
import { IconFilter } from "svgs/IconFilter";
import IconSearch from "svgs/IconSearch";
import { useState } from "react";
import Input from "@components/Input/Input";
import { IconInventory } from "svgs/IconInventory";
import IconReceipts from "svgs/IconReceipts";
import { IconReceptions } from "svgs/IconReceptions";

const inventoryFilterConfig: FilterConfig = [
    {
        title: 'Estado de Inventario',
        icon: <IconInventory width={20} height={20} fill="rgb(94, 36, 255)" />,
        items: [
            { label: 'Pocas existencias', key: 'lowStock' },
            { label: 'Agotado', key: 'outOfStock' },
        ],
    },
    {
        title: 'Actividad',
        icon: <IconReceipts width={20} height={20} fill="rgb(94, 36, 255)" />,
        items: [
            { label: 'Con ventas', key: 'hasSales' },
            { label: 'Con recepciones', key: 'hasReceptions' },
        ],
    },
    {
        title: 'Fechas',
        icon: <IconReceptions width={20} height={20} fill="rgb(94, 36, 255)" />,
        items: [
            { label: 'Última actualización', key: 'lastUpdated', type: 'dateRange' },
        ],
    },
];

const initialFilters: AppliedFilters = {
    lowStock: false,
    outOfStock: false,
    hasSales: false,
    hasReceptions: false,
    lastUpdated: { startDate: null, endDate: null },
};

export default function InventoryManagement() {
    const { height } = useWindowDimensions();
    const [searchQuery, setSearchQuery] = useState('');
    const {
        filters,
        setFilters,
        showFilters,
        openFilterModal,
        closeFilterModal,
        queryParams,
    } = useFilters(initialFilters);

    return (
        <View style={{ paddingTop: 16, flex: 1 }}>
            <View style={{ flex: 1, gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
                    <CustomText style={{ fontSize: 24, fontWeight: 'bold' }}>Inventario</CustomText>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={openFilterModal}>
                            <IconFilter width={24} height={24} fill="rgb(94, 36, 255)" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log('Search')}>
                            <IconSearch width={24} height={24} fill="rgb(94, 36, 255)" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                    <Input
                        placeholder="Buscar inventario..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        iconLeft={<IconSearch width={20} height={20} fill="#888" />}
                    />
                </View>
            
                <ListInventories onPress={(inventory) => console.log(inventory)} height={height / 1.35} queryParams={queryParams} searchQuery={searchQuery}/>
            </View>

            <FilterModal
                visible={showFilters}
                onClose={closeFilterModal}
                filterConfig={inventoryFilterConfig}
                appliedFilters={filters}
                onFiltersChange={setFilters}
            />
        </View>
    )
}
