import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Graph from "react-graph-vis";
import { unstable_Box as Box } from "@material-ui/core/Box";
import ItemSelector from "./ItemSelector";
import { transformDataToGraph, filterGraph } from "./GraphTransformations";
import { connect } from "react-redux";
import { node } from "prop-types";

function LineageGraph(props) {
  const [graphState, setGraphState] = useState({
    graphType: "Jobs and Datasets",
    filterGraph: false,
    filterGraphDirection: "children",
    selectedNodeDestination: null,
    directLineage: false,
    open: false,
    showEdgeLabel: true
  });

  const onChangeGraphType = newGraphType => {
    setGraphState(
      Object.assign({}, graphState, {
        graphType: newGraphType
      })
    );
  };

  const onFilterGraphParents = () => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: true,
        filterGraphDirection: "parents"
      })
    );
  };

  const onFilterGraphChildren = () => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: true,
        filterGraphDirection: "children"
      })
    );
  };

  const onGraphReset = nodeList => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: false,
        directLineage: false
      })
    );
    if (nodeList.includes(props.defaultNode + ":,:" + props.defaultNodeType)) {
      props.onGraphReset(props.defaultNode);
    } else {
      props.onGraphReset(props.nodeSelected);
    }
  };

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
  var localSelectedType =
    Object.keys(props.tableDetails).length === 7 ? "job" : "dataset";
  var graph =
    props.graphData.length === 0
      ? { nodes: [props.errorNode], edges: [] }
      : !graphState.filterGraph
      ? transformDataToGraph(
          props.graphData,
          props.defaultNode + ":,:" + props.defaultNodeType,
          graphState.graphType,
          props.nodeSelected + ":,:" + localSelectedType
        )
      : filterGraph(
          props.graphData,
          props.defaultNode + ":,:" + props.defaultNodeType,
          graphState.filterGraphDirection,
          graphState.graphType,
          props.nodeSelected + ":,:" + localSelectedType
        );
  var nodeListIds = graph.nodes.map(node => node.id);
  var nodeList = graph.nodes.map(node => node.label);
  var maxLength = findMaxLengthString(nodeList);

  maxLength = maxLength >= 15 ? maxLength : 15;

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
        levelSeparation:
          graphState.graphType === "Jobs and Datasets"
            ? maxLength * 8
            : maxLength * 11,
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
      size: 20
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
      props.onSelectedNode(nodeName[0]);
      if (props.nodeSelected === null || props.nodeSelected !== id) {
        this.unselectAll();
      }
    }
  };

  var methods = {
    fit: { nodes: nodeList, animation: false }
  };
  const itemSelectorStyle = { paddingLeft: "10em" };

  const graphTypes = ["Jobs", "Datasets", "Jobs and Datasets"];

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
      <ItemSelector
        title="Graph Type"
        style={itemSelectorStyle}
        itemList={graphTypes}
        selectedItem={graphState.graphType}
        onChange={onChangeGraphType}
      />
      <Button
        onClick={onFilterGraphParents}
        color="primary"
        disabled={props.errorNode !== null}
      >
        Filter Upstream
      </Button>
      <Button
        onClick={onFilterGraphChildren}
        color="primary"
        disabled={props.errorNode !== null}
      >
        Filter Downstream
      </Button>
      <Button
        onClick={() => onGraphReset(nodeListIds)}
        color="primary"
        disabled={props.errorNode !== null}
      >
        Reset Graph
      </Button>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    tableDetails: state.tableDetails,
    namespace: state.namespace,
    nodeSelected: state.nodeSelected,
    graphData: state.graphData,
    errorNode: state.errorNode,
    nodeSelectedType: state.nodeSelectedType,
    defaultNode: state.defaultNode,
    defaultNodeType: state.defaultNodeType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectedNode: nodeName => {
      const action = { type: "SelectedNode", newNode: nodeName };
      dispatch(action);
    },
    onGraphReset: nodeSelected => {
      const action = { type: "GraphReset", node: nodeSelected };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineageGraph);
