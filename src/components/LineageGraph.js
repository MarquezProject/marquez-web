import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Graph from "react-graph-vis";
import { unstable_Box as Box } from "@material-ui/core/Box";
import ItemSelector from "./ItemSelector";
import { transformDataToGraph, filterGraph } from "./GraphTransformations";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import LineageGraphLegend from "./LineageGraphLegend";

const styles = theme => {
  return {
    feedbackButton: {
      padding: theme.spacing.unit,
      backgroundColor: "#white",
      color: "black",
      fontSize: 11.5,
      borderWidth: 1.2,
      borderColor: "black",
      "&:hover": {
        color: "#71ddbf",
        cursor: "pointer",
        borderColor: "#71ddbf"
      },
      margin: 8
    },
    lineageBox: {
      height: "1000px"
    },
    graphBox: {
      height: "300px"
    }
  };
};

function LineageGraph(props) {
  const TYPE_SEPARATOR = "\u241F";
  const [graphState, setGraphState] = useState({
    graphType: "Jobs and Datasets",
    filterGraph: false,
    filterGraphDirection: "children",
    selectedNodeDestination: null,
    directLineage: false,
    open: false,
    showEdgeLabel: true,
    defaultFilterNode: null,
    defaultFilterNodeType: ""
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
        filterGraphDirection: "parents",
        defaultFilterNode: props.nodeSelected,
        defaultFilterNodeType: props.nodeSelectedType
      })
    );
  };

  const onFilterGraphChildren = () => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: true,
        filterGraphDirection: "children",
        defaultFilterNode: props.nodeSelected,
        defaultFilterNodeType: props.nodeSelectedType
      })
    );
  };

  const onGraphReset = nodeList => {
    setGraphState(
      Object.assign({}, graphState, {
        filterGraph: false,
        directLineage: false,
        defaultFilterNode: null,
        defaultFilterNodeType: ""
      })
    );
    var nodeSelectedId =
      props.nodeSelected + TYPE_SEPARATOR + props.nodeSelectedType;
    var defaultNodeId =
      props.defaultNode + TYPE_SEPARATOR + props.defaultNodeType;
    var node = props.graph.nodes.filter(node => node.id === nodeSelectedId)[0];
    var nodeNamespace = node.title;
    if (nodeList.includes(defaultNodeId)) {
      props.onGraphReset(props.defaultNode, props.defaultNodeType);
    } else {
      if (nodeNamespace !== props.namespace) {
        props.onSelectedNodeDifferentNamespace(
          props.tableDetails,
          props.nodeSelectedType
        );
      } else {
        props.onGraphReset(props.nodeSelected, props.nodeSelectedType);
      }
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
    Object.keys(props.tableDetails).length === 7 ||
    Object.keys(props.tableDetails).length === 8
      ? "job"
      : "dataset";
  var graph =
    props.graphData.length === 0
      ? { nodes: [props.errorNode], edges: [] }
      : !graphState.filterGraph
      ? transformDataToGraph(
          props.graphData,
          props.nodeSelected + TYPE_SEPARATOR + localSelectedType,
          graphState.graphType,
          props.namespace
        )
      : filterGraph(
          props.graphData,
          props.nodeSelected + TYPE_SEPARATOR + localSelectedType,
          graphState.filterGraphDirection,
          graphState.graphType,
          props.namespace,
          graphState.defaultFilterNode +
            TYPE_SEPARATOR +
            graphState.defaultFilterNodeType
        );
  var nodeListIds = graph.nodes.map(node => node.id);
  var nodeListLabels = graph.nodes.map(node => node.label);
  var maxLength = findMaxLengthString(nodeListLabels);

  useEffect(() => {
    props.onChangeGraph(graph);
  }, []);

  maxLength = maxLength >= 15 ? maxLength : 15;

  var options = {
    autoResize: true,
    width: "100%",
    height: "300px",
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
        treeSpacing: 30,
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
      var node = props.graph.nodes.filter(node => node.id === id)[0];
      var nodeName = id.split(TYPE_SEPARATOR);
      var nodeType = nodeName[1];
      var nodeNamespace = node.title;
      if (nodeNamespace === props.namespace) {
        props.onSelectedNode(node.label, nodeType);
      } else {
        const fetchType = nodeType === "job" ? "jobs" : "datasets";
        axios
          .get(" /api/v1/namespaces/" + nodeNamespace + "/" + fetchType + "/")
          .then(response => {
            const objects = response.data;
            var tableDetails = objects[fetchType].filter(
              object => object.name === node.label
            )[0];
            props.onSelectedNodeDifferentNamespace(tableDetails, nodeType);
          });
      }
      if (props.nodeSelected === null || props.nodeSelected !== id) {
        this.unselectAll();
      }
    }
  };

  var methods = {
    fit: { nodes: nodeListIds, animation: false }
  };
  const itemSelectorStyle = { paddingLeft: "10em" };

  const graphTypes = ["Jobs", "Datasets", "Jobs and Datasets"];

  const { classes } = props;

  return (
    <Box>
      Lineage
      <LineageGraphLegend />
      <Box border={1} className={classes.graphBox}>
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
        variant="outlined"
        className={classes.feedbackButton}
        onClick={onFilterGraphParents}
        disabled={props.errorNode !== null}
      >
        Filter Upstream
      </Button>
      <Button
        variant="outlined"
        className={classes.feedbackButton}
        onClick={onFilterGraphChildren}
        disabled={props.errorNode !== null}
      >
        Filter Downstream
      </Button>
      <Button
        variant="outlined"
        className={classes.feedbackButton}
        onClick={() => onGraphReset(nodeListIds)}
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
    defaultNodeType: state.defaultNodeType,
    graph: state.graph,
    lineageUrl: state.url
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectedNode: (nodeName, nodeType) => {
      const action = {
        type: "SelectedNode",
        newNode: nodeName,
        newNodeType: nodeType
      };
      dispatch(action);
    },
    onSelectedNodeDifferentNamespace: (tableDetails, nodeType) => {
      const action = {
        type: "SelectedNodeDifferentNamespace",
        tableDetails: tableDetails,
        nodeType: nodeType
      };
      dispatch(action);
    },
    onGraphReset: (nodeSelected, nodeSelectedType) => {
      const action = {
        type: "GraphReset",
        node: nodeSelected,
        nodeType: nodeSelectedType
      };
      dispatch(action);
    },
    onChangeGraph: graph => {
      const action = { type: "onChangeGraph", graph: graph };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LineageGraph));
