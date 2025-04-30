import _classes from './classes.json'
import { DirectedGraph } from 'graphology'

const classes = _classes as IOKitClass[]
export default createHierarchy(classes)

interface BaseNode {
    name: string
    parent: string | null
}

export type Hierarchy<NodeType extends BaseNode> = DirectedGraph<NodeType>

export function createHierarchy<NodeType extends BaseNode>(nodes: NodeType[]): Hierarchy<NodeType> {
    const graph = new DirectedGraph<NodeType>()
    nodes.forEach((node) => {
        graph.addNode(node.name, node)
    })
    nodes.forEach((node) => {
        if (node.parent) {
            graph.addDirectedEdge(node.name, node.parent)
        }
    })
    return graph
}

export function getParents<NodeType extends BaseNode>(
    graph: Hierarchy<NodeType>,
    node: string
): string[] {
    const parents: NodeType[] = []
    function findParents(currentNode: string) {
        graph.forEachOutNeighbor(currentNode, (parent) => {
            const parentNode = graph.getNodeAttributes(parent)
            parents.push(parentNode)
            findParents(parent)
        })
    }
    findParents(node)
    return parents.map((parent) => parent.name)
}

export function hasNode<NodeType extends BaseNode>(
    graph: Hierarchy<NodeType>,
    node: string
): boolean {
    return graph.hasNode(node)
}

interface IOKitClass {
    name: string
    parent: string | null
    isAbstract: boolean
}
