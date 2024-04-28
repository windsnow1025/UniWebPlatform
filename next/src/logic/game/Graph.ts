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
}

export default Graph;