'use client'

import { Provider } from 'react-redux'
import { store } from '../lib/store'
import InvoiceManagement from '@/components/InvoiceManagement'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <Provider store={store}>
      <div className='border w-full h-full flex justify-center'>
        <h1 className="text-3xl font-bold m-4">Invoice Management System</h1>

      </div>
      <div className='w-full h-full flex justify-center'>

        <InvoiceManagement />
      </div>
    </Provider>
  )
}

