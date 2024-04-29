class Graph {
    nodes: Map<string, Set<string>>;

    constructor() {
        this.nodes = new Map();
    }

    addNode(node: string) {
        if (!this.nodes.has(node)) {
            this.nodes.set(node, new Set());
        }
    }

    addEdge(node1: string, node2: string) {
        this.addNode(node1);
        this.addNode(node2);
        this.nodes.get(node1)!.add(node2);
        this.nodes.get(node2)!.add(node1);
    }

    getDistance(node1: string, node2: string): number {
        if (node1 === node2) return 0;
        const visited = new Set<string>();
        const queue: [string, number][] = [[node1, 0]];

        while (queue.length > 0) {
            const [currentNode, currentDistance] = queue.shift()!;

            if (currentNode === node2) {
                return currentDistance;
            }

            visited.add(currentNode);
            const neighbors = this.nodes.get(currentNode);

            if (neighbors) {
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        queue.push([neighbor, currentDistance + 1]);
                        visited.add(neighbor);
                    }
                }
            }
        }

        return Infinity;
    }
}

export default Graph;