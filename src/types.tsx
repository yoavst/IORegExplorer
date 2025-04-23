export type IORegEntry = {
    name: string
    className: string
    id: string
    status: string
    properties: Record<string, any>
    parentId: string | null
}

export type NodeOf<T> = T & {
    id: string
    initiallyExpanded?: boolean
    children: NodeOf<T>[]
}
