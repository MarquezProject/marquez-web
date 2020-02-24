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
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import marquez_logo from "../static/images/marquez-logo.png";

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
    box: {
      backgroundColor: "#2B2B33"
    }
  };
};

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
const theme = createMuiTheme({
  palette: {
    typography: {
      useNextVariants: true
    },
    primary: {
      main: "#2B2B33"
    },
    secondary: {
      main: "#006BA0"
    }
  }
});

function DetailsDialog(props) {
  const table =
    props.nodeSelectedType === "Datasets" ||
    props.nodeSelectedType === "dataset" ? (
      <DatasetDetailsTable details={props.tableDetails} />
    ) : (
      <JobRunsTable details={props.tableDetails} />
    );

  const title =
    props.nodeSelectedType === "Job" || props.nodeSelectedType === "job"
      ? "Job Details"
      : "Dataset Details";

  const { classes } = props;
  return (
    <Dialog
      // fullWidth="true"
      maxWidth="md"
      open={props.showTableDetails}
      onClose={props.onClose}
      aria-labelledby="max-width-dialog-title"
      scroll="paper"
    >
      <DialogTitle id="max-width-dialog-title">
        <Box className={classes.box}>
          <Toolbar>
            <Box mr={2}>
              <img src={marquez_logo} height={50} alt="Marquez Logo" />
            </Box>
            <Typography
              variant="h4"
              color="inherit"
              noWrap
              style={{ color: "white", fontWeight: "bold" }}
            >
              MARQUEZ | {title}
            </Typography>
          </Toolbar>
        </Box>
      </DialogTitle>
      <DialogContent>
        <MuiThemeProvider theme={theme}>
          <LineageGraph store={props.store} />
        </MuiThemeProvider>
        <Box>
          Properties
          {table}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          variant="outlined"
          className={classes.feedbackButton}
        >
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
