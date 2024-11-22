'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addInvoice, clearInvoice } from '../lib/slices/invoicesSlice'
import { addProduct, clearProducts } from '../lib/slices/productsSlice'
import { addCustomer, clearCustomer } from '../lib/slices/customersSlice'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExtractedData {
    invoices: any[]
    products: any[]
    customers: any[]
}

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to process file')
            }

            if (!result.success) {
                throw new Error('Invalid response from server')
            }

            const extractedData: ExtractedData = result.data

            // Delete the Previous data 
            dispatch(clearInvoice());
            dispatch(clearProducts());
            dispatch(clearCustomer());


            // Validate and process the data
            if (Array.isArray(extractedData.invoices)) {
                extractedData.invoices.forEach(invoice => dispatch(addInvoice(invoice)))
            }
            if (Array.isArray(extractedData.products)) {
                extractedData.products.forEach(product => dispatch(addProduct(product)))
            }
            if (Array.isArray(extractedData.customers)) {
                extractedData.customers.forEach(customer => dispatch(addCustomer(customer)))
            }

            setFile(null)
        } catch (err: any) {
            console.error('Error processing file:', err)
            setError(err.message || 'Error processing file. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mb-4">
            <Input
                className='font-bold'
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.pdf,.jpg,.png"
                disabled={isLoading}
                aria-label="Upload invoice file"
            />
            <Button
                onClick={handleUpload}
                className="mt-2 "
                disabled={!file || isLoading}
                aria-busy={isLoading}
            >
                {isLoading ? 'Processing...' : 'Upload and Process'}
            </Button>
            {error && (
                <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

