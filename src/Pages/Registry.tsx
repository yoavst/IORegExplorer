import React, { useState, useCallback, FC, useMemo, useRef } from 'react'
import SearchBar from '../Components/registry/SearchBar'
import TreeView from '../Components/registry/TreeView'
import PropertiesPanel from '../Components/registry/PropertiesPanel'
import FileUploader from '../Components/registry/FileUploader'
import { IORegEntry, NodeOf } from '@/types'

const buildTree = (entries: IORegEntry[]): NodeOf<IORegEntry>[] => {
    // Create a map of all devices by ID for quick lookup
    const entryMap = new Map<string, NodeOf<IORegEntry>>()

    // First pass: create all nodes without children
    entries.forEach((entry) => {
        entryMap.set(entry.index.toString(), { ...entry, children: [] })
    })

    // Second pass: build parent-child relationships
    const roots: NodeOf<IORegEntry>[] = []

    entries.forEach((entry) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const node = entryMap.get(entry.index.toString())!

        if (entry.parentIndex && entryMap.has(entry.parentIndex.toString())) {
            // If device has a parent in our map, add it as child
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const parent = entryMap.get(entry.parentIndex.toString())!
            parent.children.push(node)
        } else {
            // If no parent or parent not found, it's a root
            roots.push(node)
        }
    })

    const compareNodes = (a: NodeOf<IORegEntry>, b: NodeOf<IORegEntry>): number => {
        return (a.name || '').localeCompare(b.name || '')
    }

    // Recursive function to sort the tree
    const sortTree = (node: NodeOf<IORegEntry>) => {
        if (node.children.length > 0) {
            node.children.sort(compareNodes)
            node.children.forEach(sortTree)
        }
    }

    // Sort the tree
    roots.sort((a, b) => {
        // Root always comes first if present
        if (a.name === 'Root') return -1
        if (b.name === 'Root') return 1

        return compareNodes(a, b)
    })
    roots.forEach(sortTree)
    return roots
}

const Registry: FC = () => {
    const [name, setName] = useState<string>('')
    const [entries, setEntries] = useState<IORegEntry[]>([])
    const tree = useMemo(() => buildTree(entries), [entries])
    const [selectedEntry, setSelectedEntry] = useState<NodeOf<IORegEntry> | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(40) // percentage
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Handle manual resizing with mouse drag
    const startResize = useCallback(
        (e: React.MouseEvent) => {
            const startX = e.clientX
            const startWidth = leftPanelWidth

            const doDrag = (e: MouseEvent) => {
                if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth
                    const newWidth = startWidth + ((e.clientX - startX) / containerWidth) * 100
                    // Constrain between 20% and 80%
                    setLeftPanelWidth(Math.min(80, Math.max(20, newWidth)))
                }
            }

            const stopDrag = () => {
                document.removeEventListener('mousemove', doDrag)
                document.removeEventListener('mouseup', stopDrag)
            }

            document.addEventListener('mousemove', doDrag)
            document.addEventListener('mouseup', stopDrag)
        },
        [leftPanelWidth]
    )

    return (
        <div
            id="registry-container"
            className="h-screen flex flex-col bg-gray-900 text-gray-100"
            ref={containerRef}
        >
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div
                    style={{ width: `${leftPanelWidth}%` }}
                    className="h-full flex flex-col border-r border-gray-700"
                >
                    <div className="p-4 border-b border-gray-700 bg-gray-800">
                        <div className="flex flex-col gap-4">
                            <SearchBar
                                onSearch={(query) => {
                                    setSearchTerm(query.toLowerCase())
                                }}
                            />
                            <FileUploader
                                onUploadComplete={(entries, name) => {
                                    setEntries(entries)
                                    setName(name)
                                    setSelectedEntry(undefined)
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-900">
                        {entries.length === 0 && (
                            <div className="p-4 text-center text-gray-400">
                                No devices found. Upload an IOReg log file to begin.
                            </div>
                        )}

                        {entries.length > 0 && (
                            <TreeView
                                entries={tree}
                                searchTerm={searchTerm}
                                onSelectEntry={setSelectedEntry}
                                selectedEntry={selectedEntry}
                            />
                        )}
                    </div>
                </div>

                {/* Resizer */}
                <div
                    className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize hover:w-1"
                    onMouseDown={startResize}
                />

                {/* Right Panel */}
                <div
                    style={{ width: `${100 - leftPanelWidth}%` }}
                    className="h-full overflow-auto bg-gray-800"
                >
                    {name && (
                        <h1 className="w-full bg-gray-800 text-white font-bold text-xl text-center p-1">
                            {name}
                        </h1>
                    )}
                    <PropertiesPanel entry={selectedEntry} />
                </div>
            </div>
        </div>
    )
}

export default Registry
