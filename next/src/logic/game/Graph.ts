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

    isConnected(node1: string, node2: string): boolean {
        return this.nodes.get(node1)?.has(node2) ?? false;
    }

    getDistance(node1: string, node2: string): number {
        if (node1 === node2) return 0;
        const visited = new Set<string>();
        const queue: [string, number][] = [[node1, 0]]; // Tuple of node and current distance

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
                        visited.add(neighbor); // Mark as visited once enqueued
                    }
                }
            }
        }

        return -1; // Return -1 if no path exists
    }
}

export default Graph;