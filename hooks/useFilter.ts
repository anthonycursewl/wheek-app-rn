import { useMemo, useState } from "react";
import { AppliedFilters } from "shared/components/FilterModal";

/**
 * Hook para gestionar el estado de los filtros y generar query params para la API.
 * @param {AppliedFilters} initialFilters - El estado inicial de los filtros.
 */
export const useFilters = (initialFilters: AppliedFilters) => {
    const [filters, setFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    /**
     * Convierte el objeto de filtros en una cadena de query params,
     * incluyendo las keys que tienen un valor `true` y los rangos de fechas.
     */
    const queryParams = useMemo(() => {
        const params: string[] = [];
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value === true) {
                // Filtros booleanos
                params.push(`${encodeURIComponent(key)}=true`);
            } else if (typeof value === 'object' && value !== null && 'startDate' in value && 'endDate' in value) {
                // Filtros de rango de fechas
                const dateRange = value as { startDate: Date | null; endDate: Date | null };
                if (dateRange.startDate) {
                    params.push(`${encodeURIComponent(key)}_start=${encodeURIComponent(dateRange.startDate.toISOString())}`);
                }
                if (dateRange.endDate) {
                    params.push(`${encodeURIComponent(key)}_end=${encodeURIComponent(dateRange.endDate.toISOString())}`);
                }
            } else if (typeof value === 'string' && value !== '') {
                // Filtros de string (como provider ID)
                params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        });
        
        return params.join('&');
    }, [filters]);

    const openFilterModal = () => setShowFilters(true);
    const closeFilterModal = () => setShowFilters(false);

    return {
        filters,
        setFilters,
        showFilters,
        openFilterModal,
        closeFilterModal,
        queryParams,
    };
};