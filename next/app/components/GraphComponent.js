import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function GraphComponent({ graph, armies }) {
  const networkRef = useRef(null);

  useEffect(() => {
    if (!graph || !armies) return;

    const nodes = new DataSet(
      Array.from(graph.nodes.keys()).map(id => {
        const armyInfo = armies[id];
        let label = id;

        if (armyInfo) {
          const armyDetails = armyInfo.map(army => `${army.count}*${army.type}`).join(', ');
          label += `\n${armyDetails}`;
        } else {
          label += '\nNo army';
        }

        return { id, label };
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
      }
    };

    const network = new Network(networkRef.current, { nodes, edges }, options);
  }, [graph, armies]);

  return <div ref={networkRef} style={{ height: '500px' }} />;
}

export default GraphComponent;