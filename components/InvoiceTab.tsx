'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../lib/store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InvoicesTab() {
    const invoices = useSelector((state: RootState) => state.invoices)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice, index) => (
                    <TableRow key={`invoice-${invoice.serialNumber}-${index}`}>
                        <TableCell>{invoice.serialNumber}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{invoice.productName}</TableCell>
                        <TableCell>{invoice.quantity}</TableCell>
                        <TableCell>{invoice.tax}</TableCell>
                        <TableCell>{invoice.totalAmount}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

