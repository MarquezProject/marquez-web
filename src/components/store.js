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
  nodeSelected: null,
  nodeSelectedType: null,
  defaultNode: null,
  defaultNodeType: null,
  graphData: [],
  open: false,
  errorNode: null,
  fullGraph: false
};

const reducer = (state = initialState, action) => {
  var newInfo = null;
  switch (action.type) {
    case "GraphReset":
      newInfo = buildTableDetails(state, state.defaultNode);
      return Object.assign({}, state, {
        nodeSelected: state.defaultNode,
        nodeSelectedType: newInfo.selectedType,
        tableDetails: newInfo.tableDetails
      });
    case "SelectedNode": {
      const details = buildTableDetails(state, action.newNode);
      return Object.assign({}, state, {
        nodeSelected: action.newNode,
        nodeSelectedType: details.selectedType,
        tableDetails: details.tableDetails
      });
    }
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
    default:
      return state;
  }
};

function buildTableDetails(state, nodeName) {
  var localSelectedType = null;
  var dataSelected = state.datasets.filter(dataset => dataset[0] === nodeName);
  if (dataSelected.length === 0) {
    dataSelected = state.jobs.filter(job => job[0] === nodeName);
    localSelectedType = "Job";
  } else {
    localSelectedType = "Datasets";
  }
  let rowData = dataSelected[0];
  var localTableDetails =
    localSelectedType === "Datasets"
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
  return {
    tableDetails: localTableDetails,
    selectedType: localSelectedType
  };
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
