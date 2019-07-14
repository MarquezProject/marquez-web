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
    const { classes } = this.props;
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
      viewColumns: false
    };

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MUIDataTable
            title={"Jobs"}
            data={this.props.jobs}
            columns={jobColumns}
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
)(withStyles(styles)(JobTable));
