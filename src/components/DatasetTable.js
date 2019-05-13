import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import MUIDataTable from "mui-datatables";
import DatasetDetailsDialog from './DatasetDetailsDialog';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      namespace: null,
      datasetDetails: {}
    };
}

fetchData(namespace) {
  if(namespace !== undefined){
    axios.get('/api/v1/namespaces/' + namespace + '/datasets/').then((response) => {
      const datasetData = response.data
      const datasetRows = datasetData.datasets.map(dataset => [dataset.name, dataset.description, dataset.createdAt])
      this.setState({datasets: datasetRows})
    });
  }
}

componentDidMount(){
  this.fetchData(this.state.selectedNamespace); 
}

componentDidUpdate(prevProps) {
  if(this.props.namespace != prevProps.namespace) {
    this.setState({namespace: this.props.namespace});
    this.fetchData(this.props.namespace);
  }
}

handleChange = (event, value) => {
  this.setState({ value });
};

handleDatasetRowClick = (rowData, rowState) => {
  const datasetUrn = rowData[0]
  axios.get('/api/v1/namespaces/' + this.state.namespace + '/datasets/' + datasetUrn).then((response) => {
    var datasetDetails = response.data;
    this.setState({datasetDetails: datasetDetails});
    this.setState({showDatasetDetails: true});
  });
}

handledDatasetDetailsClose = () => {
  this.setState({showDatasetDetails: false});
}

render() {
  const { classes } = this.props;
  const datasetColumns = [
    "Datasource",
    "Name",
    "Created At"
  ];
  
  const options = {
    filter: true,
    filterType: 'dropdown',
    onRowClick: this.handleDatasetRowClick,
    print: false,
    viewColumns: false,
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <MUIDataTable 
            title={"Datasets"}
            data={this.state.datasets}
            columns={datasetColumns}
            options={options}
        />
      </div>
      <div>
        {/* details dialog, hidden by default */}
        <DatasetDetailsDialog
          open={this.state.showdatasetDetails}
          onClose={this.handleDatasetDetailsClose}
          datasetDetails={this.state.datasetDetails}
        />
      </div>
    </React.Fragment>
  );
}
}

DatasetTable.propTypes = {
  namespace: PropTypes.string
};

export default withStyles(styles)(DatasetTable);