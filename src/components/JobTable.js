import React from "react";
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import DetailsDialog from "./DetailsDialog";
import { connect } from "react-redux";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2B2B33"
    },
    secondary: {
      main: "#006BA0"
    }
  }
});

class JobTable extends React.Component {
  handleRowClick = rowData => {
    axios
      .get(
        " /api/v1/namespaces/" +
          this.props.namespace +
          "/jobs/" +
          rowData[0] +
          "/lineage"
      )
      .then(response => {
        console.log(response);
        this.props.onRowClick(rowData, response.data.result);
        this.props.onErrorClick(null);
      })
      .catch(error => {
        this.props.onErrorClick({
          id: rowData[0],
          label: rowData[0],
          borderWidth: 3,
          title: "job",
          color: { background: "orange", highlight: { border: "black" } }
        });
        this.props.onRowClick(rowData, []);
      });
  };

  render() {
    const jobColumns = [
      "NAME",
      "DESCRIPTION",
      "CREATED",
      {
        name: "UPDATED",
        options: {
          display: false
        }
      },
      {
        name: "INPUT DATASETS",
        options: {
          display: false
        }
      },
      {
        name: "OUTPUT DATASETS",
        options: {
          display: false
        }
      },
      {
        name: "LOCATION",
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
            title={"Jobs"}
            data={this.props.jobs}
            columns={jobColumns}
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

JobTable.propTypes = {
  namespace: PropTypes.string
};

function mapStateToProps(state) {
  return {
    jobs: state.jobs,
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
        tableType: "job"
      };
      dispatch(action);
    },
    onErrorClick: node => {
      const action = { type: "ErrorClick", node: node };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobTable);
