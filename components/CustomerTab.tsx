'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../lib/store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CustomersTab() {
    const customers = useSelector((state: RootState) => state.customers)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState(customers)

    const handleSearch = () => {
        const results = customers.filter(customer =>
            customer.Mobile?.includes(searchTerm) ||
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.Email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setSearchResults(results)
    }

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <Input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Purchase Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchResults.map((customer) => (
                        <TableRow key={customer.name}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.Mobile}</TableCell>
                            <TableCell>{customer.Email}</TableCell>
                            <TableCell>{customer.totalPurchaseAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

