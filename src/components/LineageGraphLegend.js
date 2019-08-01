import React from "react";
import Graph from "react-graph-vis";

function LineageGraphLegend(props) {
  var legend = { nodes: [], edges: [] };
  legend.nodes.push({
    id: "||Legend1||",
    label: "Job in Namespace",
    color: "orange",
    fixed: true
  });
  legend.nodes.push({
    id: "||Legend2||",
    label: "Dataset in Namespace",
    color: "cyan"
  });
  legend.nodes.push({
    id: "||Legend3||",
    label: "Job not in Namespace",
    color: "salmon"
  });
  legend.nodes.push({
    id: "||Legend4||",
    label: "Dataset not in Namespace",
    color: "lightseagreen"
  });
  legend.edges.push({
    from: "||Legend1||",
    to: "||Legend2||",
    color: { color: "white" }
  });
  legend.edges.push({
    from: "||Legend2||",
    to: "||Legend3||",
    color: { color: "white" }
  });
  legend.edges.push({
    from: "||Legend3||",
    to: "||Legend4||",
    color: { color: "white" }
  });

  var optionsLegend = {
    autoResize: true,
    width: "100%",
    height: "30px",
    physics: {
      enabled: false
    },
    layout: {
      hierarchical: {
        sortMethod: "directed",
        levelSeparation: 200,
        direction: "LR",
        nodeSpacing: 70
      }
    },
    nodes: {
      shape: "box",
      fixed: true
    },
    clickToUse: false,
    interaction: {
      dragView: false,
      zoomView: false
    }
  };

  return <Graph graph={legend} options={optionsLegend} />;
}

export default LineageGraphLegend;
