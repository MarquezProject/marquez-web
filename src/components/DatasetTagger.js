import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import DatasetTaggerDetailsDialog from "./DatasetTaggerDetailsDialog";
import axios from "axios";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class DatasetTagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      showDatasetTaggerDetails: false,
      datasetDetails: {}
    };
  }

  datasetFieldTags(dataset) {
    var tags = {};
    dataset.fields.map(field => {
      field.tags.map(tag => (tags[tag.name] = "TRUE"));
      return null;
    });
    return tags;
  }

  datasetRow(dataset) {
    const fieldTags = this.datasetFieldTags(dataset);
    return [
      dataset.name,
      fieldTags["PII"] || "FALSE",
      fieldTags["SENSITIVE"] || "FALSE",
      dataset.fields
    ];
  }

  fetchDatasets() {
    axios.get("/governance/api/v1/datasets").then(response => {
      const datasetsData = response.data;
      const datasets = datasetsData.datasets.map(dataset =>
        this.datasetRow(dataset)
      );
      this.setState({ datasets: datasets });
    });
  }

  componentDidMount() {
    this.fetchDatasets();
  }

  handleDatasetRowClick = (rowData, _) => {
    this.setState({ datasetDetails: rowData });
    this.setState({ showDatasetTaggerDetails: true });
  };

  handleDatasetTaggerDetailsClose = datasetUpdated => {
    this.setState({ showDatasetTaggerDetails: false });
    if (datasetUpdated) {
      console.log("dataset updated. refreshing data");
      this.fetchDatasets();
    }
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const datasetColumns = [
      "NAME",
      "HAS PII?",
      "HAS SENSITIVE?",
      {
        name: "FIELDS",
        options: {
          display: false
        }
      }
    ];

    const options = {
      filter: true,
      filterType: "dropdown",
      onRowClick: this.handleDatasetRowClick,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      download: false
    };

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MUIDataTable
            title={"Dataset Tagging"}
            data={this.state.datasets}
            columns={datasetColumns}
            options={options}
          />
        </div>
        <div>
          {/* details dialog, hidden by default */}
          <DatasetTaggerDetailsDialog
            open={this.state.showDatasetTaggerDetails}
            onClose={this.handleDatasetTaggerDetailsClose}
            dataset={this.state.datasetDetails}
          />
        </div>
      </React.Fragment>
    );
  }
}

DatasetTagger.propTypes = {
  namespace: PropTypes.string
};

export default withStyles(styles)(DatasetTagger);
