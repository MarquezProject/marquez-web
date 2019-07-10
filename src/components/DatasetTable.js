import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import DetailsDialog from "./DetailsDialog";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
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
      viewColumns: false
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
          <DetailsDialog store={this.props.store} />
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
        graphData: newGraphData
      };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DatasetTable));
