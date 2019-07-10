import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Graph from "react-graph-vis";
import { unstable_Box as Box } from "@material-ui/core/Box";
import ItemSelector from "./ItemSelector";
import {
  transformDataToGraph,
  filterGraph,
  findDirectLineage
} from "./GraphTransformations";
import { connect } from "react-redux";

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

  const onChangeSelectedNodeDestination = nodeName => {
    setGraphState(
      Object.assign({}, graphState, {
        selectedNodeDestination: nodeName
      })
    );
  };

  const onDirectLineage = () => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: true,
        directLineage: true
      })
    );
  };

  const onShowEdgeLabels = () => {
    setGraphState(
      Object.assign({}, graphState, {
        showEdgeLabel: !graphState.showEdgeLabel
      })
    );
  };

  const onGraphReset = () => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: false,
        directLineage: false
      })
    );
    props.onGraphReset();
  };

  function nodeClick(values, id, selected, hovering) {
    values.borderWith = 3;
  }

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
  var graph = !graphState.filterGraph
    ? transformDataToGraph(
        props.graphData,
        props.nodeSelected,
        graphState.graphType,
        graphState.showEdgeLabel
      )
    : graphState.directLineage
    ? findDirectLineage(
        props.graphData,
        props.nodeSelected,
        graphState.selectedNodeDestination,
        graphState.graphType,
        graphState.showEdgeLabel
      )
    : filterGraph(
        props.graphData,
        props.nodeSelected,
        graphState.filterGraphDirection,
        graphState.graphType,
        graphState.showEdgeLabel
      );

  var nodeList = graph.nodes.map(node => node.id);
  var maxLength = findMaxLengthString(nodeList);

  if (
    graphState.graphType !== "Jobs and Datasets" &&
    graphState.showEdgeLabel
  ) {
    var edgeList = graph.edges.map(edge => edge.label);
    var maxEdgeLength = findMaxLengthString(edgeList);
    maxLength = maxLength > maxEdgeLength ? maxLength : maxEdgeLength;
  }
  maxLength = maxLength >= 15 ? maxLength : 15;

  var options = {
    autoResize: true,
    width: "100%",
    height: "460px",
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
      let { nodeSelected } = props;
      props.onSelectedNode(id);
      if (nodeSelected === null || nodeSelected !== id) {
        this.unselectAll();
      }
    }
  };

  var methods = {
    fit: { nodes: nodeList, animation: false }
  };
  const itemSelectorStyle = { paddingLeft: "10em" };
  const nodes = graph.nodes.map(node => {
    return node.id;
  });
  const EdgeLabelTitle = graphState.showEdgeLabel
    ? "Hide Edge Labels"
    : "Show Edge Labels";

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
      <ItemSelector
        title="Node Selected"
        style={itemSelectorStyle}
        itemList={nodes}
        selectedItem={props.nodeSelected}
        onChange={props.onSelectedNode}
      />
      <Button onClick={onFilterGraphParents} color="primary">
        Filter Upstream
      </Button>
      <Button onClick={onFilterGraphChildren} color="primary">
        Filter Downstream
      </Button>
      <Button onClick={onGraphReset} color="primary">
        Reset Graph
      </Button>
      <ItemSelector
        title="Node Destination"
        style={itemSelectorStyle}
        itemList={nodes}
        selectedItem={graphState.selectedNodeDestination}
        onChange={onChangeSelectedNodeDestination}
      />
      <Button onClick={onDirectLineage} color="primary">
        Direct Lineage
      </Button>
      <Button
        onClick={onShowEdgeLabels}
        color="primary"
        disabled={graphState.graphType === "Jobs and Datasets"}
      >
        {EdgeLabelTitle}
      </Button>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    tableDetails: state.tableDetails,
    namespace: state.namespace,
    nodeSelected: state.nodeSelected,
    graphData: state.graphData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectedNode: nodeName => {
      const action = { type: "SelectedNode", newNode: nodeName };
      dispatch(action);
    },
    onGraphReset: () => {
      const action = { type: "GraphReset" };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineageGraph);
