import React, { ReactElement } from 'react'
import * as RRD from 'react-router-dom'

import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'

import JobDetailPage from './JobDetailPage'

import { IDatasetsState } from '../reducers/datasets'
import { IJobsState } from '../reducers/jobs'

import { findMatchingEntities } from '../actionCreators'

const styles = (_theme: ITheme) => {
  return createStyles({
    header: {
      padding: '0% 0% 0% 1%'
    },
    column: {
      flex: 1
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      padding: '52vh 5% 1%',
      position: 'absolute',
      top: 0,
      zIndex: -1,
      width: '100%'
    },
    search: {
      position: 'fixed',
      bottom: '52vh',
      width: '90%',
      left: '5%'
    },
    noDatasets: {
      color: '#9e9e9e',
      position: 'fixed',
      bottom: '20vh',
      left: '21%'
    },
    noJobs: {
      color: '#9e9e9e',
      position: 'fixed',
      bottom: '20vh',
      right: '21%'
    }
  })
}

interface IProps {
  datasets: IDatasetsState
  jobs: IJobsState
  findMatchingEntities: typeof findMatchingEntities
}

interface IState {
  showJobs: boolean
}

type IAllProps = RRD.RouteComponentProps & IWithStyles<typeof styles> & IProps

class Home extends React.Component<IAllProps, IState> {
  constructor(props: IAllProps) {
    super(props)
    this.state = { showJobs: false }
  }

  showJobs = (bool: boolean) => {
    this.setState({ showJobs: bool })
  }

  render(): ReactElement {
    const { jobs } = this.props

    const sampleJob = jobs[0] || {}
    return (
      <JobDetailPage
        /* should change to unique identifier */
        key={sampleJob.name}
        name={sampleJob.name}
        location={sampleJob.location}
        description={sampleJob.description}
        updatedAt={sampleJob.createdAt}
        status={sampleJob.status}
      />
    )
  }
}

export default withStyles(styles)(Home)
