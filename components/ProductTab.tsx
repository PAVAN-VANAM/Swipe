'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../lib/store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductsTab() {
    const products = useSelector((state: RootState) => state.products)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Price with Tax</TableHead>
                    <TableHead>Discount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>{product.tax.toFixed(2)}%</TableCell>
                        <TableCell>{product.priceWithTax.toFixed(2)}</TableCell>
                        <TableCell>{product.discount ? `${product.discount.toFixed(2)}%` : 'N/A'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

