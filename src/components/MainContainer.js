import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CodeIcon from '@material-ui/icons/Code';
import TableChartIcon from '@material-ui/icons/TableChart'
import LabelIcon from '@material-ui/icons/Label'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import NamespaceSelector from './NamespaceSelector'
import MUIDataTable from "mui-datatables";
import { unstable_Box as Box } from '@material-ui/core/Box';
import axios from 'axios'
import JobTable from './JobTable'
import DatasetTable from './DatasetTable'


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNamespace: null,
      namespaces: [],
      selectedContent: "Jobs",
    }
    this.nsChangeHandler = this.nsChangeHandler.bind(this);
  }

  componentDidMount() {
    axios.get('/api/v1/namespaces/').then((response) => {
      const namespaceList = response.data.namespaces.map(namespace => namespace.name)
      this.setState({namespaces: namespaceList})
      this.setState({selectedNamespace: namespaceList[0]})
    })
  }

  nsChangeHandler(selectedNs) {
    this.setState({selectedNamespace: selectedNs})
  }

  handleDrawerItemClick(btn) {
    console.log(btn)
    this.setState({selectedContent: btn.text})
  }

  iconForListItem(listItemName) {
    if(listItemName==='Jobs') {
      return  <CodeIcon />
    } 
    else if (listItemName==='Datasets') {
      return <TableChartIcon />
    } 
    else if (listItemName==='Tags') {
      return <LabelIcon />
    } 
    else {
      return  <CheckBoxIcon />
    }
  }

  render() {
    const { classes } = this.props;
    const jobContentStyle = this.state.selectedContent === 'Jobs'? {} : {display: 'none'};
    const datasetContentStyle = this.state.selectedContent === 'Datasets' ? {} : {display: 'none'};
    const tagContentStyle = this.state.selectedContent === 'Tags' ? {} : {display: 'none'};
    const namespaceSelectorStyle = {paddingLeft: '10em'};
    const jobColumns = [
        "Name",
        "Description",
        "Created At"
    ];
    const datasetColumns = ["URN", "Created At"];

    const options = {
        filter: true,
        filterType: 'dropdown',
        onRowClick: this.handleJobRowClick,
        print: false,
        viewColumns: false,
    };

    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                Marquez
                </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <div>
                <NamespaceSelector 
                  style={namespaceSelectorStyle}
                  namespaces={this.state.namespaces} 
                  selectedNamespace={this.state.selectedNamespace}
                  onChange={this.nsChangeHandler}
                />
            </div>
            <List>
              {['Jobs', 'Datasets', 'Tags'].map((text, index) => (
                <ListItem button key={text} onClick={() => this.handleDrawerItemClick({text})}>
                  <ListItemIcon>{this.iconForListItem(text)}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <main className={classes.content}>
            <div style={jobContentStyle}>
              <Box mt={8}>
                <JobTable
                  namespace={this.state.selectedNamespace}
                />
              </Box>
            </div>
            <div style={datasetContentStyle}>
              <Box mt={8}>
                <DatasetTable
                    namespace={this.state.selectedNamespace}
                  />
              </Box>
            </div>
            <div style={tagContentStyle} mt={30}>
                <Box mt={8}>
                  Tags
                </Box>
            </div>
          </main>
        </div>
      );
    }
}

MainContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainContainer);
