'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUpload from './FileUpload'
import InvoicesTab from './InvoiceTab'
import ProductsTab from './ProductTab'
import CustomersTab from './CustomerTab'

export default function InvoiceManagement() {
    const [activeTab, setActiveTab] = useState('invoices')

    return (
        <div className="container mx-auto p-4">

            <FileUpload />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 w-full flex-row justify-center items-center">
                <TabsList className='  flex justify-center'>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices">
                    <InvoicesTab />
                </TabsContent>
                <TabsContent value="products">
                    <ProductsTab />
                </TabsContent>
                <TabsContent value="customers">
                    <CustomersTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}

