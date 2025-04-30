export interface IORegEntry {
    name: string
    className: string
    parentClasses: string[]
    id: string
    index: number
    status: string
    properties: Record<string, unknown>
    parentIndex: number | null
}

export type NodeOf<T> = T & {
    id: string
    children: NodeOf<T>[]
}

export const nodeMatchesSearch = (node: NodeOf<IORegEntry>, searchTerm: string): boolean => {
    return (
        node.name.toLowerCase().includes(searchTerm) ||
        node.className.toLowerCase().includes(searchTerm) ||
        node.parentClasses.some((cls) => cls.toLowerCase().includes(searchTerm)) ||
        node.id.toLowerCase().includes(searchTerm)
    )
}
