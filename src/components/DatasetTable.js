import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import DetailsDialog from "./DetailsDialog";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

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

class DatasetTable extends React.Component {
  handleRowClick = rowData => {
    const datasetFetch =
      this.props.tableType === "Datasets" ? rowData[3] : rowData[4][0];
    axios
      .get(
        " /api/v1/namespaces/" +
          this.props.namespace +
          "/datasets/" +
          datasetFetch +
          "/lineage"
      )
      .then(response => {
        this.props.onRowClick(rowData, response.data.result);
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
    const { classes } = this.props;
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
        <div className={classes.root}>
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
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DatasetTable));
