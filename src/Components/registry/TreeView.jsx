import React from 'react'
import TreeNode from './TreeNode'

const filterTree = (node, searchTerm) => {
    if (!searchTerm) return true

    const nodeMatches =
        (node.name && node.name.toLowerCase().includes(searchTerm)) ||
        (node.className && node.className.toLowerCase().includes(searchTerm)) ||
        (node.id && node.id.toString().toLowerCase().includes(searchTerm))

    if (nodeMatches) return true

    if (node.children && node.children.length > 0) {
        return node.children.some((child) => filterTree(child))
    }

    return false
}

export default function TreeView({ devices, searchTerm, onSelectDevice, selectedDevice }) {
    const filteredRoots = devices.filter((node) => filterTree(node, searchTerm))
    const autoExpandFirst = searchTerm && searchTerm.length > 0

    if (filteredRoots.length === 0) {
        return <div className="p-4 text-center text-gray-400">No devices match your search</div>
    }

    return (
        <div className="py-2">
            {filteredRoots.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onSelect={onSelectDevice}
                    selectedNode={selectedDevice}
                    autoExpand={autoExpandFirst}
                />
            ))}
        </div>
    )
}
