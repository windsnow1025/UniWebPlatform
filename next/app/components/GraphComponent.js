import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function midpoint(point1, point2) {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

function GraphComponent({ graph, attributes }) {
  const networkRef = useRef(null);

  useEffect(() => {
    const basePositions = {
      "Main City 1": { x: 0, y: -300 },
      "Main City 2": { x: -300, y: 300 },
      "Main City 3": { x: 300, y: 300 },
      "Center": { x: 0, y: 0 }
    };

    const gatePositions = {
      "Gate 12": midpoint(basePositions["Main City 1"], basePositions["Main City 2"]),
      "Gate 23": midpoint(basePositions["Main City 2"], basePositions["Main City 3"]),
      "Gate 13": midpoint(basePositions["Main City 1"], basePositions["Main City 3"]),
    };

    const positions = {
      ...basePositions,
      ...gatePositions,
      "City 1 D": midpoint(basePositions["Main City 1"], basePositions["Center"]),
      "City 2 D": midpoint(basePositions["Main City 2"], basePositions["Center"]),
      "City 3 D": midpoint(basePositions["Main City 3"], basePositions["Center"]),
      "City 1 to 2": midpoint(basePositions["Main City 1"], gatePositions["Gate 12"]),
      "City 1 to 3": midpoint(basePositions["Main City 1"], gatePositions["Gate 13"]),
      "City 2 to 3": midpoint(basePositions["Main City 2"], gatePositions["Gate 23"]),
      "City 2 to 1": midpoint(basePositions["Main City 2"], gatePositions["Gate 12"]),
      "City 3 to 1": midpoint(basePositions["Main City 3"], gatePositions["Gate 13"]),
      "City 3 to 2": midpoint(basePositions["Main City 3"], gatePositions["Gate 23"]),
    };

    const nodes = new DataSet(
      Array.from(graph.nodes.keys()).map(id => {
        const armyInfo = attributes[id];
        let label = id;
        if (armyInfo) {
          label += `\n${armyInfo.map(army => `${army.count}*${army.type}`).join(', ')}`;
        }

        const nodeData = { id, label, shape: 'box' };

        if (positions[id]) {
          nodeData.x = positions[id].x;
          nodeData.y = positions[id].y;
        }

        return nodeData;
      })
    );

    const edges = new DataSet();
    graph.nodes.forEach((connections, id) => {
      connections.forEach((targetId) => {
        if (id < targetId) {
          edges.add({ from: id, to: targetId });
        }
      });
    });

    const options = {
      edges: {
        arrows: {
          to: false
        }
      },
      interaction: {
        zoomView: false
      },
    };

    const network = new Network(networkRef.current, { nodes, edges }, options);
  }, [graph, attributes]);

  return <div ref={networkRef} style={{ height: '500px' }} />;
}

export default GraphComponent;