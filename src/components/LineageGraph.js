import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Graph from "react-graph-vis";
import { unstable_Box as Box } from "@material-ui/core/Box";
import ItemSelector from "./ItemSelector";
import { transformDataToGraph, filterGraph } from "./GraphTransformations";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { isClassExpression } from "@babel/types";

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

  const { classes } = props;

  return (
    <Box>
      Lineage
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
)(withStyles(styles)(LineageGraph));
