import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import MUIDataTable from "mui-datatables";
import JobDetailsDialog from './JobDetailsDialog';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class JobTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      namespace: null,
      jobDetails: {runs: []}
    };
}

fetchData(namespace) {
  if(namespace !== undefined){
    axios.get('/api/v1/namespaces/' + namespace + '/jobs/').then((response) => {
      const jobData = response.data
      const jobRows = jobData.jobs.map(job => [job.name, job.description, job.createdAt])
      this.setState({jobs: jobRows})
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

handleJobRowClick = (rowData, rowState) => {
  const jobName = rowData[0]
  var jobRuns = []
  axios.get('/api/v1/namespaces/' + this.state.namespace + '/jobs/' + jobName + '/runs' ).then((response) => {
    jobRuns = response.data;
    this.setState(
      {
        jobDetails: {
          runs: jobRuns
        }
      })
    this.setState({showJobDetails: true});
  });
}

handleJobDetailsClose = () => {
  this.setState({showJobDetails: false});
}

render() {
  const { classes } = this.props;
  const { value } = this.state;
  const jobColumns = [
    "Name",
    "Description",
    "Created At"
  ];
  
  const options = {
    filter: true,
    filterType: 'dropdown',
    onRowClick: this.handleJobRowClick,
    print: false,
    viewColumns: false,
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <MUIDataTable 
            title={"Jobs"}
            data={this.state.jobs}
            columns={jobColumns}
            options={options}
        />
      </div>
      <div>
        {/* details dialog, hidden by default */}
        <JobDetailsDialog
          open={this.state.showJobDetails}
          onClose={this.handleJobDetailsClose}
          jobDetails={this.state.jobDetails}
        />
      </div>
    </React.Fragment>
  );
}
}

JobTable.propTypes = {
  namespace: PropTypes.string
};

export default withStyles(styles)(JobTable);