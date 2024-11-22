import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Customer {
    name: string;
    Mobile: string;
    Email: string;
    totalPurchaseAmount: number;
}

const initialState: Customer[] = []

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<Customer>) => {
            const newCustomer = action.payload
            const existingCustomerIndex = state.findIndex(customer => customer.Mobile === newCustomer.Mobile)
            if (existingCustomerIndex !== -1) {
                state[existingCustomerIndex] = {
                    ...state[existingCustomerIndex],
                    ...newCustomer,
                    totalPurchaseAmount: state[existingCustomerIndex].totalPurchaseAmount + newCustomer.totalPurchaseAmount
                }
            } else {
                state.push(newCustomer)
            }
        },
        updateCustomer: (state, action: PayloadAction<Partial<Customer> & { phoneNumber: string }>) => {
            const index = state.findIndex(customer => customer.Mobile === action.payload.Mobile)
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload }
            }
        },
        clearCustomer: (state) => {
            return []
        }
    },
})

export const { addCustomer, updateCustomer, clearCustomer } = customersSlice.actions
export default customersSlice.reducer

