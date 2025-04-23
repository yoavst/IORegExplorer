import { FC } from 'react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import { Badge } from '@/Components/ui/badge'
import { IORegEntry, NodeOf } from '@/types'
import InhertianceChain from './InhertianceChain'

interface PropertiesPanelProps {
    entry: NodeOf<IORegEntry> | undefined
}

const PropertiesPanel: FC<PropertiesPanelProps> = ({ entry }) => {
    if (!entry) {
        return (
            <div className="p-4 text-center text-gray-400">
                Select an entry to view its properties
            </div>
        )
    }

    const properties = Object.entries(entry.properties)

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-white mr-3">
                        {entry.name || 'Unnamed Device'}
                    </h2>
                    <div className="space-y-1">
                        {entry.className && (
                            <InhertianceChain currentClass={entry.className} inhertianceChain={entry.parentClasses} />
                        )}
                        <p className="text-sm text-gray-300">
                            <span className="font-semibold">ID:</span> {entry.id}
                        </p>
                        {entry.status && (
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold">Status:</span>
                                <Badge
                                    variant="outline"
                                    className="ml-2 font-normal bg-gray-700 text-gray-200 border-gray-600"
                                >
                                    {entry.status}
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
                                                    : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                                                      String(value)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 p-4 border border-gray-700 rounded-md">
                        No properties found for this entry
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}

export default PropertiesPanel
