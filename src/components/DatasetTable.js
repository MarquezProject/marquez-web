import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import DetailsDialog from "./DetailsDialog";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "#2B2B33"
    },
    secondary: {
      main: "#006BA0"
    }
  }
});

class DatasetTable extends React.Component {
  handleRowClick = rowData => {
    var lineageUrl =
      " /api/v1/namespaces/" +
      this.props.namespace +
      "/datasets/" +
      rowData[3] +
      "/lineage";
    this.props.onLineageUrlChange(lineageUrl);
    axios
      .get(lineageUrl)
      .then(response => {
        this.props.onRowClick(rowData, response.data.result);
        this.props.onErrorClick(null);
      })
      .catch(error => {
        this.props.onErrorClick({
          id: rowData[0],
          label: rowData[0],
          borderWidth: 3,
          title: "dataset",
          color: { background: "cyan", highlight: { border: "black" } }
        });
        this.props.onRowClick(rowData, []);
      });
  };

  render() {
    const datasetColumns = [
      "NAME",
      "DESCRIPTION",
      "CREATED",
      {
        name: "URN",
        options: {
          display: false
        }
      },
      {
        name: "DATASOURCE URN",
        options: {
          display: false
        }
      },
      {
        name: "NAMESPACE",
        options: {
          display: false
        }
      }
    ];

    const options = {
      filter: true,
      filterType: "dropdown",
      onRowClick: this.handleRowClick,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      download: false
    };
    return (
      <React.Fragment>
        <div>
          <MUIDataTable
            title={"Datasets"}
            columns={datasetColumns}
            data={this.props.datasets}
            options={options}
          />
        </div>
        <div>
          {/* details dialog, hidden by default */}
          <MuiThemeProvider theme={theme}>
            <DetailsDialog store={this.props.store} />
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

DatasetTable.propTypes = {
  namespace: PropTypes.string
};

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    tableType: state.tableType,
    namespace: state.namespace
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRowClick: (rowData, newGraphData) => {
      const action = {
        type: "RowClick",
        rowData: rowData,
        graphData: newGraphData,
        tableType: "dataset"
      };
      dispatch(action);
    },
    onErrorClick: node => {
      const action = { type: "ErrorClick", node: node };
      dispatch(action);
    },
    onLineageUrlChange: url => {
      const action = { type: "UrlChange", url: url };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetTable);
