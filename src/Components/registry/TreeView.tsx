import { FC, useMemo } from 'react'
import TreeNode from './TreeNode'
import { IORegEntry, NodeOf, nodeMatchesSearch } from '@/types'

interface TreeViewProps {
    entries: NodeOf<IORegEntry>[]
    searchTerm: string
    onSelectEntry: (node: NodeOf<IORegEntry>) => void
    selectedEntry?: NodeOf<IORegEntry>
}

const filterEntries = (entries: NodeOf<IORegEntry>[], searchTerm: string): NodeOf<IORegEntry>[] => {
    if (searchTerm.length === 0) return entries

    const filteredEntries: NodeOf<IORegEntry>[] = []

    for (const node of entries) {
        const isMatch = nodeMatchesSearch(node, searchTerm)
        if (isMatch) {
            filteredEntries.push(node)
        } else {
            const children =
                node.children.length > 0 ? filterEntries(node.children, searchTerm) : []
            if (children.length > 0) {
                filteredEntries.push({
                    ...node,
                    children,
                })
            }
        }
    }

    return filteredEntries
}

const TreeView: FC<TreeViewProps> = ({ entries, searchTerm, onSelectEntry, selectedEntry }) => {
    const filteredEntries = useMemo(() => filterEntries(entries, searchTerm), [entries, searchTerm])
    return (
        <div className="py-2">
            {filteredEntries.map((node) => (
                <TreeNode
                    key={node.index}
                    node={node}
                    level={0}
                    onSelect={onSelectEntry}
                    selectedNode={selectedEntry}
                    autoExpand={searchTerm.length > 0}
                    searchTerm={searchTerm}
                />
            ))}
        </div>
    )
}
export default TreeView
