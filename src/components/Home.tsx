import * as RRD from 'react-router-dom'
import { Box, Typography } from '@material-ui/core'
import React, { FunctionComponent, useState } from 'react'

import Pagination from 'material-ui-flat-pagination'
import _chunk from 'lodash/chunk'

import {
  Theme as ITheme,
  WithStyles as IWithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'

import DatasetPreviewCard from './DatasetPreviewCard'
import FiltersWrapper from './filters/FiltersWrapper'
import JobPreviewCard from './JobPreviewCard'

import { IDatasetsState } from '../reducers/datasets'
import { IJobsState } from '../reducers/jobs'
import {IState} from '../reducers'
import {connect} from 'react-redux'

const styles = (theme: ITheme) => {
  return createStyles({
    column: {
      flex: 1
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    lowerHalf: {
      display: 'flex',
      flexDirection: 'column',
      padding: `50vh ${theme.spacing(3)}px`,
      position: 'absolute',
      top: 0,
      zIndex: 1,
      width: '100%'
    },
    noDatasets: {
      position: 'fixed',
      bottom: '20vh',
      left: '21%'
    },
    noJobs: {
      position: 'fixed',
      bottom: '20vh',
      right: '21%'
    }
  })
}

interface IProps {
  datasets: IDatasetsState
  jobs: IJobsState
  showJobs: boolean
  setShowJobs: (bool: boolean) => void
}

type IAllProps = RRD.RouteComponentProps & IWithStyles<typeof styles> & IProps

const Home:  FunctionComponent<IAllProps> = props => {
  const [datasetPageIndex, setDatasetPageIndex] = useState(0)
  const [jobPageIndex, setJobPageIndex] = useState(0)

  const limit = 5

  const { datasets, jobs, classes, showJobs, setShowJobs } = props

  const matchingDatasets = datasets.filter(d => d.matches)
  const matchingJobs = jobs.filter(j => j.matches)

  const chunkedDatasets = _chunk(matchingDatasets, limit)
  const chunkedJobs = _chunk(matchingJobs, limit)

  const displayDatasets = chunkedDatasets[datasetPageIndex] || matchingDatasets
  const displayJobs = chunkedJobs[jobPageIndex] || matchingJobs

  return (
    <div className={classes.lowerHalf}>
      <FiltersWrapper showJobs={setShowJobs} />
      <div className={classes.row}>
        <Box className={classes.column}>
          {matchingDatasets.length > 0 ? (
            <Typography variant='h3'>
              {!showJobs ? 'Popular Datasets' : 'Matching Datasets'}
            </Typography>
          ) : (
            <Typography className={classes.noDatasets}>no datasets found!</Typography>
          )}
          {displayDatasets.map(d => (
            <DatasetPreviewCard
              key={d.name}
              name={d.name}
              description={d.description}
              updatedAt={d.createdAt}
              tags={d.tags}
            />
          ))}
          {matchingDatasets.length > 0 ? (
          <Pagination
            limit={limit}
            offset={datasetPageIndex * limit}
            total={matchingDatasets.length}
            onClick={(e, offset, page) => setDatasetPageIndex(page - 1)}
          />
          ) : null}
        </Box>
        {showJobs ? (
          <Box className={classes.column}>
            {matchingJobs.length > 0 ? (
              <Typography color='secondary' variant='h3'>
                Matching Jobs
              </Typography>
            ) : (
              <Typography className={classes.noJobs}>no jobs found!</Typography>
            )}
            {displayJobs.map(d => (
              <JobPreviewCard
                key={d.name}
                name={d.name}
                description={d.description}
                updatedAt={d.createdAt}
                latestRun={d.latestRun}
              />
            ))}
            {matchingJobs.length > 0 ? (
              <Pagination
                limit={limit}
                offset={jobPageIndex * limit}
                total={matchingJobs.length}
                onClick={(e, offset, page) => setJobPageIndex(page - 1)}
              />
            ) : null}
          </Box>
        ) : null}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets,
  jobs: state.jobs
})

interface IInjectedProps {
  showJobs: boolean
  setShowJobs: (bool: boolean) => void
}

type IStateProps = ReturnType<typeof mapStateToProps>

export default connect<IStateProps, IInjectedProps>(
  mapStateToProps
)(withStyles(styles)(Home))
