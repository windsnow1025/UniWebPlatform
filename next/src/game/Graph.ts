class Graph {
  nodes: Map<string, { connections: Set<string>, attribute: number }>;

  constructor() {
    this.nodes = new Map();
  }

  addNode(node: string, attribute: number = 0) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, {connections: new Set(), attribute});
    }
  }

  setAttribute(node: string, attribute: number) {
    if (this.nodes.has(node)) {
      this.nodes.get(node)!.attribute = attribute;
    }
  }

  getAttribute(node: string): number | undefined {
    return this.nodes.get(node)?.attribute;
  }

  addEdge(node1: string, node2: string) {
    if (!this.nodes.has(node1) || !this.nodes.has(node2)) {
      return;
    }
    this.nodes.get(node1)!.connections.add(node2);
    this.nodes.get(node2)!.connections.add(node1);
  }

  getDistance(node1: string, node2: string) {
    if (node1 === node2) return 0;
    const visited = new Set<string>();
    const queue: [string, number][] = [[node1, 0]];

    while (queue.length > 0) {
      const [currentNode, currentDistance] = queue.shift()!;

      if (currentNode === node2) {
        return currentDistance;
      }

      visited.add(currentNode);
      const neighbors = this.nodes.get(currentNode)?.connections;

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