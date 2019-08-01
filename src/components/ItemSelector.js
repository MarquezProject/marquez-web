import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

const styles = theme => ({
  root: {
    display: "inline-flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class ItemSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      itemList: [],
      name: "ns",
      labelWidth: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
    this.setState({ itemList: this.props.itemList });
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  componentDidUpdate(prevProps) {
    if (this.props.itemList !== prevProps.itemList) {
      this.setState({ itemList: this.props.itemList });
    }
    if (this.props.selectedItem !== prevProps.selectedItem) {
      this.setState({ selectedItem: this.props.selectedItem });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-simple"
          >
            {this.props.title}
          </InputLabel>
          <Select
            value={this.state.selectedItem}
            onChange={this.handleChange}
            input={
              <Input
                labelwidth={this.state.labelWidth}
                name="namespace"
                id="outlined-namespace"
              />
            }
          >
            {this.state.itemList.sort().map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }
}

ItemSelector.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ItemSelector);
