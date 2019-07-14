import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { unstable_Box as Box } from "@material-ui/core/Box";
import LineageGraph from "./LineageGraph";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

function JobRunsTable(props) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <b>NAME</b>
          </TableCell>
          <TableCell>{props.details.name}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <b>INPUT DATASETS</b>
          </TableCell>
          <TableCell>{props.details.inputDatasetUrns}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>OUTPUT DATASETS</b>
          </TableCell>
          <TableCell>{props.details.outputDatasetUrns}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>LOCATION</b>
          </TableCell>
          <TableCell>
            <a
              href={props.details.location}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.details.location}
            </a>
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>DESCRIPTION</b>
          </TableCell>
          <TableCell>{props.details.description}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>CREATED</b>
          </TableCell>
          <TableCell>{props.details.createdAt}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>UPDATED</b>
          </TableCell>
          <TableCell>{props.details.updatedAt}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function DatasetDetailsTable(props) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <b>NAME</b>
          </TableCell>
          <TableCell>{props.details.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>DESCRIPTION</b>
          </TableCell>
          <TableCell>{props.details.description}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>URN</b>
          </TableCell>
          <TableCell>{props.details.urn}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>DATASOURCE URN</b>
          </TableCell>
          <TableCell>{props.details.datasourceUrn}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b>CREATED</b>
          </TableCell>
          <TableCell>{props.details.createdAt}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function DetailsDialog(props) {
  function TableType(props) {
    const table =
      props.nodeSelectedType === "Datasets" ? (
        <DatasetDetailsTable details={props.tableDetails} />
      ) : (
        <JobRunsTable details={props.tableDetails} />
      );
    return table;
  }

  function DialogTitleSelector(props) {
    const title =
      props.nodeSelectedType === "Job" ? "Job Details" : "Dataset Details";
    return title;
  }

  return (
    <Dialog
      fullWidth="md"
      maxWidth="md"
      open={props.showTableDetails}
      onClose={props.onClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">
        <DialogTitleSelector nodeSelectedType={props.nodeSelectedType} />
      </DialogTitle>
      <DialogContent>
        <LineageGraph store={props.store} />
        <Box>
          Properties
          <TableType
            nodeSelectedType={props.nodeSelectedType}
            tableDetails={props.tableDetails}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DetailsDialog.propTypes = {
  showTableDetails: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableDetails: PropTypes.object.isRequired,
  nodeSelectedType: PropTypes.string.isRequired
};

DetailsDialog.defaultProps = {
  showTableDetails: false,
  onClose: function() {},
  tableDetails: {},
  nodeSelectedType: ""
};

function mapStateToProps(state) {
  return {
    tableDetails: state.tableDetails,
    nodeSelectedType: state.nodeSelectedType,
    showTableDetails: state.showTableDetails,
    fullGraph: state.fullGraph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => {
      const action = { type: "Close" };
      dispatch(action);
    },
    onFullGraph: () => {
      const action = { type: "FullGraph" };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DetailsDialog));
