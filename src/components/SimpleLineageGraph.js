import React, { useState } from "react";
import Graph from "react-graph-vis";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { transformDataToGraph } from "./GraphTransformations";
import { connect } from "react-redux";

function SimpleLineageGraph(props) {
  function nodeClick(values, id, selected, hovering) {
    values.borderWith = 3;
  }

  var localSelectedType =
    Object.keys(props.tableDetails).length === 7 ? "job" : "dataset";
  var graph =
    props.graphData.length === 0
      ? { nodes: [props.errorNode], edges: [] }
      : transformDataToGraph(
          props.graphData,
          props.nodeSelected + ":,:" + localSelectedType,
          "simpleGraph",
          true
        );

  function findMaxLengthString(list) {
    var maxLength = 0;
    for (var ii = 0; ii < list.length; ii++) {
      var len = list[ii].length;
      if (len > maxLength) {
        maxLength = len;
      }
    }
    return maxLength;
  }
  var nodeList = graph.nodes.map(node => node.label);
  var maxLength = findMaxLengthString(nodeList);
  if (maxLength < 15) {
    maxLength = 15;
  }

  var options = {
    autoResize: true,
    width: "100%",
    height: "400px",
    physics: {
      enabled: false
    },
    layout: {
      hierarchical: {
        sortMethod: "directed",
        levelSeparation: maxLength * 8,
        parentCentralization: true,
        direction: "LR",
        nodeSpacing: 70,
        treeSpacing: 100,
        blockShifting: true,
        edgeMinimization: true
      }
    },
    edges: {
      color: "#000000",
      width: 0.5,
      smooth: {
        type: "cubicBezier"
      }
    },
    nodes: {
      shape: "box",
      size: 20,
      chosen: {
        node: nodeClick
      }
    },
    interaction: {
      selectConnectedEdges: true,
      dragNodes: false
    }
  };

  var events = {
    selectNode: function(event) {
      var { nodes } = event;
      var id = nodes[0];
      var nodeName = id.split(":,:");
      let { nodeSelected } = props;
      props.onSelectedNode(nodeName[0]);
      if (nodeSelected === null || nodeSelected !== nodeName[0]) {
        this.unselectAll();
      }
    }
  };

  var nodeList = graph.nodes.map(node => node.label);

  var methods = {
    fit: { nodes: nodeList, animation: false }
  };

  return (
    <Box height="1000">
      Lineage
      <Box border={1}>
        <Graph
          graph={graph}
          options={options}
          events={events}
          methods={methods}
        />
      </Box>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    tableDetails: state.tableDetails,
    namespace: state.namespace,
    nodeSelected: state.nodeSelected,
    graphData: state.graphData,
    errorNode: state.errorNode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectedNode: nodeName => {
      const action = { type: "SelectedNode", newNode: nodeName };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleLineageGraph);
