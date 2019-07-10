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

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import axios from "axios";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  }
});

class DatasetTaggerDetailsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasetUpdated: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddButtonPress = this.handleAddButtonPress.bind(this);
    this.fieldTag = this.fieldTag.bind(this);
    this.fieldRow = this.fieldRow.bind(this);
    this.handleDeleteButtonPress = this.handleDeleteButtonPress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataset !== prevProps.dataset) {
      this.setState({ dataset: this.props.dataset });

      // populate tag sets for fields
      this.fieldsForDataset(this.props.dataset).map(field =>
        this.initTagsForField(field.name, field.tags)
      );
    }
  }

  tagsStateKeyForField(fieldName) {
    return "tagsForField_" + fieldName;
  }

  initTagsForField(fieldName, tags) {
    var stateUpdate = {};
    var tagSet = new Set([]);
    tags.map(tag => tagSet.add(tag.name));
    stateUpdate[this.tagsStateKeyForField(fieldName)] = tagSet;
    this.setState(stateUpdate);
  }

  tagsForField(fieldName) {
    const tagSet = this.state[this.tagsStateKeyForField(fieldName)];
    return tagSet || new Set([]);
  }

  fieldsForDataset(dataset) {
    return dataset[3];
  }

  rememberTagForField(tagName, fieldName) {
    const tagsForField = this.tagsForField(fieldName).add(tagName);
    var stateUpdate = {};
    stateUpdate[this.tagsStateKeyForField(fieldName)] = tagsForField;
    this.setState(stateUpdate);
  }

  forgetTagForField(tagName, fieldName) {
    var tagsForField = this.tagsForField(fieldName);
    tagsForField.delete(tagName);
    var stateUpdate = {};
    stateUpdate[this.tagsStateKeyForField(fieldName)] = tagsForField;
    this.setState(stateUpdate);
  }

  stateKeyForField(fieldName) {
    return "selectedTagForField_" + fieldName;
  }

  handleChange = event => {
    const selectedTag = event.target.value;
    const selectedField = event.target.name;
    const stateKeyToUpdate = this.stateKeyForField(selectedField);
    var stateUpdate = {};

    if (selectedTag === "") {
      stateUpdate[stateKeyToUpdate] = undefined;
    } else {
      stateUpdate[stateKeyToUpdate] = selectedTag;
    }
    this.setState(stateUpdate);
  };

  handleClose() {
    this.props.onClose(this.state.datasetUpdated);
    this.setState({ datasetUpdated: false }); // clear update flag
  }

  handleAddButtonPress(event, fieldName) {
    // publish tag to backend
    const tagName = this.state[this.stateKeyForField(fieldName)];
    const datasetName = this.props.dataset[0];
    axios
      .post(
        "/governance/api/v1/datasets/" +
          datasetName +
          "/fields/" +
          fieldName +
          "/tags/" +
          tagName
      )
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
    this.rememberTagForField(tagName, fieldName);

    // clear tag selection
    var stateUpdate = {};
    stateUpdate[this.stateKeyForField(fieldName)] = undefined;
    this.setState(stateUpdate);

    // mark dataset updated
    this.setState({ datasetUpdated: true });
  }

  handleDeleteButtonPress(fieldName, tagName) {
    // delete tag from backend
    const datasetName = this.props.dataset[0];
    axios
      .delete(
        "/governance/api/v1/datasets/" +
          datasetName +
          "/fields/" +
          fieldName +
          "/tags/" +
          tagName
      )
      .then(res => {
        console.log(res);
        console.log(res.data);
      });

    this.forgetTagForField(tagName, fieldName);

    // mark dataset updated
    this.setState({ datasetUpdated: true });
  }

  isTagSelectedForField(fieldName) {
    return this.state[this.stateKeyForField(fieldName)] !== undefined; // check for 'None' also?
  }

  fieldTag(fieldName, tag) {
    return (
      <TableRow key={"field-" + fieldName + "-tag-" + tag}>
        <TableCell width={20}>{tag}</TableCell>
        <TableCell>
          <RemoveCircleIcon
            onClick={() => this.handleDeleteButtonPress(fieldName, tag)}
          />
        </TableCell>
      </TableRow>
    );
  }

  fieldTags(fieldName, tags) {
    const tagSet = this.tagsForField(fieldName);
    return (
      <Table>
        <TableBody>
          {Array.from(tagSet).map(tag => this.fieldTag(fieldName, tag))}
        </TableBody>
      </Table>
    );
  }

  fieldRow(datasetField) {
    return (
      <TableRow key={"field-row-" + datasetField.name}>
        <TableCell>{datasetField.name}</TableCell>
        <TableCell>{/* field type should go here */}</TableCell>
        <TableCell>
          {this.fieldTags(datasetField.name, datasetField.tags)}
        </TableCell>
        <TableCell>
          <FormControl className={styles.formControl}>
            <InputLabel htmlFor="outlined-allowed-tags" />
            <Select
              value={
                this.state[this.stateKeyForField(datasetField.name)] || "None"
              }
              onChange={this.handleChange}
              input={
                <Input
                  labelWidth={400}
                  name={datasetField.name}
                  id={"allowed-tags-" + datasetField.name}
                />
              }
            >
              <MenuItem key="none" value="" />
              <MenuItem key="pii" value="PII">
                PII
              </MenuItem>
              <MenuItem key="sensitive" value="SENSITIVE">
                SENSITIVE
              </MenuItem>
            </Select>
          </FormControl>
          {this.isTagSelectedForField(datasetField.name) && (
            <Button
              variant="contained"
              color="primary"
              onClick={evt => this.handleAddButtonPress(evt, datasetField.name)}
            >
              ADD
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  }

  render() {
    return (
      <Dialog
        fullWidth={false}
        maxWidth="md"
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Add / Remove Tags</DialogTitle>
        <DialogContent>
          <h2>{this.state.dataset !== undefined && this.state.dataset[0]}</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>FIELD NAME</b>
                </TableCell>
                <TableCell>
                  <b>FIELD TYPE</b>
                </TableCell>
                <TableCell>
                  <b>FIELD TAGS</b>
                </TableCell>
                <TableCell>
                  <b>ADD TAG</b>
                </TableCell>
              </TableRow>
              {this.state.dataset !== undefined &&
                this.fieldsForDataset(this.state.dataset)
                  .sort(function(a, b) {
                    return a.name - b.name;
                  })
                  .map(field => this.fieldRow(field))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DatasetTaggerDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

DatasetTaggerDetailsDialog.defaultProps = {
  open: false,
  onClose: function() {},
  dataset: {}
};

export default withStyles(styles)(DatasetTaggerDetailsDialog);
