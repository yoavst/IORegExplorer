import { FC, useMemo } from 'react'
import { Badge } from '@/Components/ui/badge'
import { IORegEntry, NodeOf } from '@/types'
import InhertianceChain from './InhertianceChain'
import { ColDef, colorSchemeDark, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

interface PropertiesPanelProps {
    entry: NodeOf<IORegEntry> | undefined
}

interface Property {
    name: string
    value: unknown
}

const colDefs: ColDef<Property>[] = [
    {
        field: 'name',
        sortingOrder: ['asc', 'desc'],
        filter: true,
    },
    {
        field: 'value',
        filter: true,
        flex: 1,

        valueFormatter: (p) => {
            const value = p.value as unknown
            if (typeof value === 'object') {
                return JSON.stringify(value, null, 2)
            }
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return String(value)
        },
    },
]

const PropertiesPanel: FC<PropertiesPanelProps> = ({ entry }) => {
    const properties = useMemo(() => {
        if (!entry) return []
        return Object.entries(entry.properties).map(([key, value]) => {
            return {
                name: key,
                value: value,
            }
        })
    }, [entry])
    console.log(properties)

    if (!entry) {
        return (
            <div className="p-4 text-center text-gray-400">
                Select an entry to view its properties
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mr-3">
                    {entry.name || 'Unnamed Device'}
                </h2>
                <div className="space-y-1">
                    {entry.className && (
                        <InhertianceChain
                            currentClass={entry.className}
                            inhertianceChain={entry.parentClasses}
                        />
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
                        <AgGridReact
                            domLayout="autoHeight"
                            rowData={properties}
                            columnDefs={colDefs}
                            theme={themeQuartz.withPart(colorSchemeDark).withParams({
                                headerHeight: 30,
                                rowHeight: 30,
                            })}
                            animateRows={false}
                            gridOptions={{
                                defaultColDef: {
                                    suppressMovable: true,
                                },
                                suppressScrollOnNewData: true,
                                suppressCellFocus: false,
                            }}
                            enableCellTextSelection={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 p-4 border border-gray-700 rounded-md">
                    No properties found for this entry
                </div>
            )}
        </div>
    )
}

export default PropertiesPanel
