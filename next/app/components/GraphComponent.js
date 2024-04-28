import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function NetworkGraph({ graph }) {
  const networkRef = useRef(null);

  useEffect(() => {
    if (!graph) return;

    const nodes = new DataSet(
      Array.from(graph.nodes.keys()).map(id => ({ id, label: id }))
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
  }, [graph]);

  return <div ref={networkRef} style={{ height: '500px' }} />;
}

export default NetworkGraph;