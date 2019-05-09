import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CodeIcon from '@material-ui/icons/Code';
import TableChartIcon from '@material-ui/icons/TableChart'
import LabelIcon from '@material-ui/icons/Label'
import CheckBoxIcon from '@material-ui/icons/CheckBox'


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

class ClippedDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedContent: "Jobs",
    }
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

    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                Clipped drawer
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
                Jobs
            </div>
            <div style={datasetContentStyle}>
                Datasets
            </div>
            <div style={tagContentStyle}>
                Tags
            </div>
          </main>
        </div>
      );
    }
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);
