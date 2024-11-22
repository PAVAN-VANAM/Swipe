import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Invoice {
    serialNumber: string
    customerName: string
    productName: string
    quantity: number
    tax: number
    totalAmount: number
    date: string
}

const initialState: Invoice[] = []

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<Invoice>) => {
            const existingIndex = state.findIndex(invoice => invoice.serialNumber === action.payload.serialNumber)
            if (existingIndex !== -1) {
                // Update existing invoice
                state[existingIndex] = action.payload
            } else {
                // Add new invoice
                state.push(action.payload)
            }
        },
        updateInvoice: (state, action: PayloadAction<Invoice>) => {
            const index = state.findIndex(invoice => invoice.serialNumber === action.payload.serialNumber)
            if (index !== -1) {
                state[index] = action.payload
            }
        },
        clearInvoice: (state) => {
            return []
        }
    },
})

export const { addInvoice, updateInvoice, clearInvoice } = invoicesSlice.actions
export default invoicesSlice.reducer

