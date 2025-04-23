import { FC } from 'react'
import TreeNode from './TreeNode'
import { IORegEntry, NodeOf } from '@/types'

interface TreeViewProps {
    entries: NodeOf<IORegEntry>[]
    searchTerm: string
    onSelectEntry: (node: NodeOf<IORegEntry>) => void
    selectedEntry?: NodeOf<IORegEntry>
}

const TreeView: FC<TreeViewProps> = ({ entries, searchTerm, onSelectEntry, selectedEntry }) => {
    return (
        <div className="py-2">
            {entries.map((node) => (
                <TreeNode
                    key={node.id}
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
