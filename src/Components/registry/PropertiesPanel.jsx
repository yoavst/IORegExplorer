import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function PropertiesPanel({ device }) {
    if (!device) {
        return (
            <div className="p-4 text-center text-gray-400">
                Select a device to view its properties
            </div>
        )
    }

    const properties = device.properties ? Object.entries(device.properties) : []

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-white mr-3">
                        {device.name || 'Unnamed Device'}
                    </h2>
                    <div className="space-y-1">
                        {device.className && (
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold">Class:</span> {device.className}
                            </p>
                        )}
                        <p className="text-sm text-gray-300">
                            <span className="font-semibold">ID:</span> {device.id}
                        </p>
                        {device.status && (
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold">Status:</span>
                                <Badge
                                    variant="outline"
                                    className="ml-2 font-normal bg-gray-700 text-gray-200 border-gray-600"
                                >
                                    {device.status}
                                </Badge>
                            </p>
                        )}
                    </div>
                </div>

                {properties.length > 0 ? (
                    <div>
                        <h3 className="text-md font-medium mb-3 text-gray-200">Properties</h3>
                        <div className="rounded-md border border-gray-700 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                        <TableHead className="text-gray-300">Property</TableHead>
                                        <TableHead className="text-gray-300">Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {properties.map(([key, value]) => (
                                        <TableRow
                                            key={key}
                                            className="border-gray-700 hover:bg-gray-800/50"
                                        >
                                            <TableCell className="font-mono text-sm text-gray-300">
                                                {key}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm whitespace-pre-wrap text-gray-300">
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value, null, 2)
                                                    : String(value)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 p-4 border border-gray-700 rounded-md">
                        No properties found for this device
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}
