import { useState, useEffect, FC, useMemo } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IORegEntry, NodeOf, nodeMatchesSearch } from '@/types'

interface TreeNodeProps {
    node: NodeOf<IORegEntry>
    level?: number
    onSelect: (node: NodeOf<IORegEntry>) => void
    selectedNode?: NodeOf<IORegEntry>
    autoExpand?: boolean
    searchTerm: string
}

const TreeNode: FC<TreeNodeProps> = ({
    node,
    level = 0,
    onSelect,
    selectedNode,
    autoExpand = false,
    searchTerm,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const matchesSearchTerm = useMemo(
        () => searchTerm.length > 0 && nodeMatchesSearch(node, searchTerm),
        [node, searchTerm]
    )

    useEffect(() => {
        if (autoExpand) {
            setIsExpanded(true)
        }
    }, [autoExpand])

    return (
        <div>
            <div
                className={cn(
                    'flex items-center py-1 hover:bg-gray-800 cursor-pointer select-none rounded-sm transition-colors',
                    selectedNode?.index === node.index &&
                        'bg-gray-700 hover:bg-gray-700 text-blue-300'
                )}
                style={{ paddingLeft: `${level * 16}px` }}
                onClick={() => {
                    onSelect(node)
                }}
            >
                {/* Expand/collapse button */}
                <div className="flex items-center justify-center w-6 h-6">
                    {node.children.length > 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}
                            className="w-5 h-5 flex items-center justify-center hover:bg-gray-600 rounded-sm transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    ) : (
                        <span className="w-5 h-5 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        </span>
                    )}
                </div>

                {/* Device info */}
                <div className="flex items-center overflow-hidden gap-2">
                    <span
                        className={
                            'font-mono text-sm truncate ' +
                            (matchesSearchTerm ? 'text-green-200' : 'text-gray-200')
                        }
                    >
                        {node.name || 'Unnamed Device'}
                    </span>
                    {node.className && (
                        <span className="text-gray-400 text-xs truncate">
                            &lt;{node.className}&gt;
                        </span>
                    )}
                </div>
            </div>

            {/* Children - only rendered when expanded */}
            {node.children.length > 0 && isExpanded && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.index}
                            node={child}
                            level={level + 1}
                            onSelect={onSelect}
                            selectedNode={selectedNode}
                            autoExpand={autoExpand}
                            searchTerm={searchTerm}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TreeNode
