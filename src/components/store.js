import { createStore } from "redux";
import { transformDatasetList } from "./GraphTransformations";

const initialState = {
  namespaces: [],
  selectedContent: "Jobs",
  jobs: [],
  datasets: [],
  tableType: null,
  showTableDetails: false,
  namespace: null,
  tableDetails: {},
  nodeSelected: "",
  nodeSelectedType: "",
  defaultNode: null,
  defaultNodeType: null,
  graphData: [],
  open: false,
  errorNode: null,
  graph: null,
  url: ""
};

const reducer = (state = initialState, action) => {
  var newInfo = null;
  switch (action.type) {
    case "GraphReset":
      var details = buildTableDetails(state, action.node, action.nodeType);
      return Object.assign({}, state, {
        nodeSelected: action.node,
        nodeSelectedType: action.nodeType,
        tableDetails: details
      });
    case "SelectedNode": {
      const details = buildTableDetails(
        state,
        action.newNode,
        action.newNodeType
      );
      return Object.assign({}, state, {
        nodeSelected: action.newNode,
        nodeSelectedType: action.newNodeType,
        tableDetails: details
      });
    }
    case "SelectedNodeDifferentNamespace":
      return Object.assign({}, state, {
        nodeSelected: action.tableDetails.name,
        nodeSelectedType: action.nodeType,
        tableDetails: action.tableDetails
      });
    case "Close":
      return Object.assign({}, state, {
        showTableDetails: false,
        graphType: "Jobs and Datasets"
      });
    case "RowClick": {
      newInfo = buildRowData(state, action.rowData);
      return Object.assign({}, state, {
        nodeSelected: newInfo.nodeSelected,
        tableDetails: newInfo.tableDetails,
        showTableDetails: newInfo.showTableDetails,
        nodeSelectedType: action.tableType,
        graphData: action.graphData,
        defaultNode: newInfo.nodeSelected,
        defaultNodeType: action.tableType
      });
    }
    case "ErrorClick":
      return Object.assign({}, state, {
        errorNode: action.node
      });
    case "DrawerItemClick":
      return Object.assign({}, state, {
        selectedContent: action.text,
        tableType: action.text
      });
    case "ChangeDatasets":
      return Object.assign({}, state, {
        datasets: action.datasets
      });
    case "ChangeJobs":
      return Object.assign({}, state, {
        jobs: action.jobs
      });
    case "ChangeNamespace":
      return Object.assign({}, state, {
        namespace: action.namespace
      });
    case "InitiateNamespaces":
      return Object.assign({}, state, {
        namespaces: action.namespaces,
        namespace: action.namespaces[0]
      });
    case "onChangeGraph":
      return Object.assign({}, state, {
        graph: action.graph
      });
    case "UrlChange":
      return Object.assign({}, state, {
        url: action.url
      });
    default:
      return state;
  }
};

function buildTableDetails(state, nodeName, nodeType) {
  var rowData =
    nodeType === "dataset"
      ? state.datasets.filter(dataset => dataset[0] === nodeName)[0]
      : state.jobs.filter(job => job[0] === nodeName)[0];
  var localTableDetails =
    nodeType === "dataset"
      ? {
          name: rowData[0],
          description: rowData[1],
          createdAt: rowData[2],
          urn: rowData[3],
          datasourceUrn: rowData[4]
        }
      : {
          name: rowData[0],
          description: rowData[1],
          createdAt: rowData[2],
          updatedAt: rowData[3],
          inputDatasetUrns: transformDatasetList(rowData[4]),
          outputDatasetUrns: transformDatasetList(rowData[5]),
          location: rowData[6]
        };
  return localTableDetails;
}

function buildRowData(state, rowData) {
  const newInfo = {
    nodeSelected: rowData[0],
    tableDetails:
      state.tableType === "Datasets"
        ? {
            name: rowData[0],
            description: rowData[1],
            createdAt: rowData[2],
            urn: rowData[3],
            datasourceUrn: rowData[4]
          }
        : {
            name: rowData[0],
            description: rowData[1],
            createdAt: rowData[2],
            updatedAt: rowData[3],
            inputDatasetUrns: transformDatasetList(rowData[4]),
            outputDatasetUrns: transformDatasetList(rowData[5]),
            location: rowData[6]
          },
    showTableDetails: true
  };
  return newInfo;
}
const store = createStore(reducer);

export default store;
