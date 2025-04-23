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
