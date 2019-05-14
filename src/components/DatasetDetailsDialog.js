import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
  });

function DatasetDetailsTable(props) {
    const { classes } = props;
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell>{props.details.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><b>CreatedAt</b></TableCell>
                    <TableCell>{props.details.createdAt}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><b>URN</b></TableCell>
                    <TableCell>{props.details.urn}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><b>DatasourceURN</b></TableCell>
                    <TableCell>{props.details.datasourceUrn}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell>{props.details.description}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

function DatasetDetailsDialog(props) {
    return (
        <Dialog
            fullWidth="sm"
            maxWidth="sm"
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">Dataset Details</DialogTitle>
            <DialogContent>
                <DatasetDetailsTable details={props.datasetDetails} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

DatasetDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    datasetDetails: PropTypes.object.isRequired
}

DatasetDetailsDialog.defaultProps = {
    open: false,
    onClose: function(){},
    jobDetails: null
}

export default withStyles(styles)(DatasetDetailsDialog);
