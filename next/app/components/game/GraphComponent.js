import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

const playerColors = ["#add8e6", "#f08080", "#90ee90"]

function midpoint(point1, point2) {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

const basePositions = {
  "Blue Home": { x: 0, y: -300 },
  "Red Home": { x: -300, y: 300 },
  "Green Home": { x: 300, y: 300 },
  "Center": { x: 0, y: 0 }
};

const gatePositions = {
  "Gate RB": midpoint(basePositions["Blue Home"], basePositions["Red Home"]),
  "Gate RG": midpoint(basePositions["Red Home"], basePositions["Green Home"]),
  "Gate GB": midpoint(basePositions["Blue Home"], basePositions["Green Home"]),
};

const positions = {
  ...basePositions,
  ...gatePositions,
  "Blue to Center": midpoint(basePositions["Blue Home"], basePositions["Center"]),
  "Red to Center": midpoint(basePositions["Red Home"], basePositions["Center"]),
  "Green to Center": midpoint(basePositions["Green Home"], basePositions["Center"]),
  "Blue to Red": midpoint(basePositions["Blue Home"], gatePositions["Gate RB"]),
  "B to G": midpoint(basePositions["Blue Home"], gatePositions["Gate GB"]),
  "R to G": midpoint(basePositions["Red Home"], gatePositions["Gate RG"]),
  "Red to Blue": midpoint(basePositions["Red Home"], gatePositions["Gate RB"]),
  "G to B": midpoint(basePositions["Green Home"], gatePositions["Gate GB"]),
  "G to R": midpoint(basePositions["Green Home"], gatePositions["Gate RG"]),
};

function GraphComponent({ graph, attributes }) {
  const networkRef = useRef(null);

  useEffect(() => {


    const nodes = new DataSet(
      Array.from(graph.nodes.keys()).map(id => {
        const armyInfo = attributes[id];
        let label = id;
        let color = "gray";
        if (armyInfo) {
          label += `\n${armyInfo.map(army => `${army.count}*${army.type}`).join(', ')}`;
          color = playerColors[armyInfo[0].playerIndex];
        }

        const nodeData = { id, label, shape: 'box', color: { background: color } };

        if (positions[id]) {
          nodeData.x = positions[id].x;
          nodeData.y = positions[id].y;
        }

        return nodeData;
      })
    );

    const edges = new DataSet();
    graph.nodes.forEach((nodeData, id) => {
      nodeData.connections.forEach((targetId) => {
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

  return <div ref={networkRef} style={{ height: '600px' }} />;
}

export default GraphComponent;