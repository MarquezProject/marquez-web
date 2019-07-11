import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CodeIcon from "@material-ui/icons/Code";
import TableChartIcon from "@material-ui/icons/TableChart";
import LabelIcon from "@material-ui/icons/Label";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ItemSelector from "./ItemSelector";
import { unstable_Box as Box } from "@material-ui/core/Box";
import axios from "axios";
import JobTable from "./JobTable";
import DatasetTable from "./DatasetTable";
import DatasetTagger from "./DatasetTagger";
import "typeface-rajdhani";
import we_logo from "../static/images/we-logo.png";
import { connect } from "react-redux";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: 2.5
  },
  feedbackButton: {
    padding: theme.spacing.unit,
    backgroundColor: "#2B2B33",
    color: "white",
    fontSize: 15,
    borderWidth: 1.2,
    "&:hover": {
      color: "#71ddbf",
      cursor: "pointer",
      borderColor: "#71ddbf"
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar
});

class MainContainer extends React.Component {
  componentDidMount() {
    axios.get("/api/v1/namespaces/").then(response => {
      const namespaceList = response.data.namespaces.map(
        namespace => namespace.name
      );
      this.props.onInitiateNamespaces(namespaceList);
      this.fetchData("default");
    });
  }

  componentDidUpdate(prevProps, _) {
    if (this.props.selectedNamespace !== prevProps.selectedNamespace) {
      this.fetchData(this.props.selectedNamespace);
    }
  }

  iconForListItem(listItemName) {
    if (listItemName === "Jobs") {
      return <CodeIcon />;
    } else if (listItemName === "Datasets") {
      return <TableChartIcon />;
    } else if (listItemName === "Tags") {
      return <LabelIcon />;
    } else {
      return <CheckBoxIcon />;
    }
  }

  fetchData(namespace) {
    if (namespace !== undefined) {
      axios.get("/api/v1/namespaces/" + namespace + "/jobs").then(response => {
        const jobData = response.data;
        const jobRows = jobData.jobs.map(job => [
          job.name,
          job.description,
          job.createdAt,
          job.updatedAt,
          job.inputDatasetUrns,
          job.outputDatasetUrns,
          job.location,
          namespace
        ]);
        this.props.onChangeJobs(jobRows);
      });
    }
    if (namespace !== undefined) {
      axios
        .get("/api/v1/namespaces/" + namespace + "/datasets/")
        .then(response => {
          const datasetData = response.data;
          const datasetRows = datasetData.datasets.map(dataset => [
            dataset.name,
            dataset.description,
            dataset.createdAt,
            dataset.urn,
            dataset.datasourceUrn,
            namespace
          ]);
          this.props.onChangeDatasets(datasetRows);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const jobContentStyle =
      this.props.selectedContent === "Jobs" ? {} : { display: "none" };
    const datasetContentStyle =
      this.props.selectedContent === "Datasets" ? {} : { display: "none" };
    const tagContentStyle =
      this.props.selectedContent === "Tags" ? {} : { display: "none" };
    const namespaceSelectorStyle = { paddingLeft: "10em" };

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Box mr={2}>
              <img src={we_logo} height={50} alt="WeWork Logo" />
            </Box>
            <Typography
              variant="h4"
              color="inherit"
              noWrap
              style={{ fontFamily: "rajdhani", fontWeight: "bold" }}
            >
              MARQUEZ
            </Typography>
            <div className={classes.rightToolbar}>
              <a
                href="https://forms.gle/gWj8fn8iYiTsKEPD6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className={classes.feedbackButton}> Feedback </button>
              </a>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <div>
            <ItemSelector
              title="Namespace"
              style={namespaceSelectorStyle}
              itemList={this.props.namespaces}
              selectedItem={this.props.selectedNamespace}
              onChange={this.props.nsChangeHandler}
            />
          </div>
          <List>
            {["Jobs", "Datasets", "Tags"].map((text, index) => (
              <ListItem
                button
                key={text}
                onClick={() => this.props.onDrawerItemClick({ text })}
              >
                <ListItemIcon>{this.iconForListItem(text)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div style={jobContentStyle}>
            <Box mt={8}>
              <JobTable store={this.props.store} />
            </Box>
          </div>
          <div style={datasetContentStyle}>
            <Box mt={8}>
              <DatasetTable store={this.props.store} />
            </Box>
          </div>
          <div style={tagContentStyle}>
            <Box mt={8}>
              <DatasetTagger />
            </Box>
          </div>
        </main>
      </div>
    );
  }
}

MainContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    selectedNamespace: state.namespace,
    namespaces: state.namespaces,
    selectedContent: state.selectedContent,
    jobs: state.jobs,
    datasets: state.datasets,
    borderWidth: 1.2
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDrawerItemClick: btn => {
      console.log(btn);
      const action = { type: "DrawerItemClick", text: btn.text };
      dispatch(action);
    },
    onChangeDatasets: datasets => {
      const action = { type: "ChangeDatasets", datasets: datasets };
      dispatch(action);
    },
    onChangeJobs: jobs => {
      const action = { type: "ChangeJobs", jobs: jobs };
      dispatch(action);
    },
    nsChangeHandler: namespace => {
      const action = { type: "ChangeNamespace", namespace: namespace };
      dispatch(action);
    },
    onInitiateNamespaces: namespaces => {
      const action = {
        type: "InitiateNamespaces",
        namespaces: namespaces
      };
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MainContainer));
