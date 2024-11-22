import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

interface Product {
    id: string
    name: string
    quantity: number
    unitPrice: number
    tax: number
    priceWithTax: number
    discount?: number
}

const initialState: Product[] = []

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'priceWithTax'>>) => {
            const newProduct = {
                ...action.payload,
                id: uuidv4(),
                priceWithTax: action.payload.unitPrice * (1 + action.payload.tax / 100)
            }
            const existingIndex = state.findIndex(product => product.name === newProduct.name)
            if (existingIndex !== -1) {
                // Update existing product
                state[existingIndex] = { ...state[existingIndex], ...newProduct }
            } else {
                // Add new product
                state.push(newProduct)
            }
        },
        updateProduct: (state, action: PayloadAction<Partial<Product> & { id: string }>) => {
            const index = state.findIndex(product => product.id === action.payload.id)
            if (index !== -1) {
                state[index] = {
                    ...state[index],
                    ...action.payload,
                    priceWithTax: (action.payload.unitPrice || state[index].unitPrice) * (1 + (action.payload.tax || state[index].tax) / 100)
                }
            }
        },
        clearProducts: (state) => {
            return []
        }
    },
})

export const { addProduct, updateProduct, clearProducts } = productsSlice.actions
export default productsSlice.reducer

