export interface Inventory {
    id: string;
    store: {
        name: string
    },
    product: {
        name: string
        w_ficha: {
            condition: string
            cost: number
        } | null
    },
    quantity: number,
    updated_at: Date
}