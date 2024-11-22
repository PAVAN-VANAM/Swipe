import { configureStore } from '@reduxjs/toolkit'
import invoicesReducer from '@/lib/slices/invoicesSlice'
import productsReducer from '@/lib/slices/productsSlice'
import customersReducer from '@/lib/slices/customersSlice'

export const store = configureStore({
    reducer: {
        invoices: invoicesReducer,
        products: productsReducer,
        customers: customersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

