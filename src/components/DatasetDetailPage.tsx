import React, { ReactElement } from 'react'
import * as RRD from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Typography, Box } from '@material-ui/core'

import { IDatasetsState } from '../reducers/datasets'

import {
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'

const _ = require('lodash')

const styles = ({ palette }: ITheme) => {
  return createStyles({
    table: {
      zIndex: 4
    }
  })
}

interface IProps {
  datasets: IDatasetsState
}
interface IState {}

type IAllProps = RRD.RouteComponentProps & IWithStyles<typeof styles> & IProps

class Datasets extends React.Component<IAllProps, IState> {
  render(): ReactElement {
    const routeParams = this.props.match.params
    const { classes, datasets } = this.props
    // const dataset = _.find(datasets, d => d.name == routeParams.name)
    // console.log('Dataset: ', dataset)
    // console.log('Classes: ', classes)
    return (
      <Box mt={10}>
        <Typography color='primary' align='center'>
          Datasets Component
        </Typography>
      </Box>
    )
  }
}

export default Datasets
