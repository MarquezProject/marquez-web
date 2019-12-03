import React, { FunctionComponent } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useParams } from 'react-router-dom'
import _find from 'lodash/find'

// const globalStyles = require('../global_styles.css')
// const { vibrantGreen } = globalStyles

import { IDataset } from '../types'

const styles = ({ palette, spacing }: ITheme) => {
  return createStyles({
    root: {
      marginTop: '52vh',
      height: '48vh',
      width: '100%'
    },
    paper: {
      width: '100%',
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    }
  })
}

type IProps = IWithStyles<typeof styles> & { datasets: IDataset[] }

// const StyledTypography = withStyles({
//   root: {
//     maxWidth: '90%'
//   }
// })(Typography)

const DatasetDetailPage: FunctionComponent<IProps> = props => {
  const { datasets, classes } = props
  const {
    root
  } = classes
  const { datasetName } = useParams()
  const dataset = _find(datasets, d => d.name === datasetName)
  if (!dataset) {
    return (
      <Box
        p={4}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        className={root}
      >
        <Typography align='center'>
          No dataset by the name of <strong>&quot;{datasetName}&quot;</strong> found
        </Typography>
      </Box>
    )
  } else {
    const {
      name,
      fields,
      // updatedAt = '',
      // namespace,
    } = dataset
  
    return (
      <Box mt={10} className={root}>
        <Typography color='primary' align='center'>
          {name} {fields}
        </Typography>
      </Box>
    )
  }
}

export default withStyles(styles)(DatasetDetailPage)

