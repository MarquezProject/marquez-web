import * as RRD from 'react-router-dom'
import {Box, Typography} from '@material-ui/core'
import {IDatasetsState} from '../reducers/datasets'
import {IJobsState} from '../reducers/jobs'
import {IState} from '../reducers'
import {
  Theme as ITheme,
  WithStyles as IWithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'
import {Pagination} from '@material-ui/lab'
import {connect} from 'react-redux'
import DatasetPreviewCard from './DatasetPreviewCard'
import FiltersWrapper from './filters/FiltersWrapper'
import JobPreviewCard from './JobPreviewCard'
import MqText from './core/text/MqText'
import React, {FunctionComponent, useState} from 'react'
import _chunk from 'lodash/chunk'

const styles = (theme: ITheme) => {
  return createStyles({
    column: {
      flex: 1,
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    lowerHalf: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      zIndex: 1,
      width: '100%'
    },
    none: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
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

const Home: FunctionComponent<IAllProps> = props => {
  const [datasetPageIndex, setDatasetPageIndex] = useState(0)
  const [jobPageIndex, setJobPageIndex] = useState(0)

  const limit = 5

  const {datasets, jobs, classes, showJobs, setShowJobs} = props

  const matchingDatasets = datasets.filter(d => d.matches)
  const matchingJobs = jobs.filter(j => j.matches)

  const chunkedDatasets = _chunk(matchingDatasets, limit)
  const chunkedJobs = _chunk(matchingJobs, limit)

  const displayDatasets = chunkedDatasets[datasetPageIndex] || matchingDatasets
  const displayJobs = chunkedJobs[jobPageIndex] || matchingJobs

  return (
    <div className={classes.lowerHalf}>
      <div className={classes.row}>
        <Box className={classes.column}>
          {matchingDatasets.length > 0 ? (
            <Box mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <MqText heading>
                {!showJobs ? 'Popular Datasets' : 'Matching Datasets'}
              </MqText>
              <FiltersWrapper showJobs={setShowJobs}/>
            </Box>
          ) : (
            <Box textAlign={'center'}>
              <MqText subdued>no datasets found!</MqText>
            </Box>
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
          {matchingDatasets.length > 0 && (
            <Pagination color={'standard'}
                        shape={'rounded'}
                        onChange={(event, page) => {
                          setDatasetPageIndex(page - 1)
                        }}
                        count={Math.ceil(matchingDatasets.length / limit)}
            />
          )}
        </Box>
        {showJobs && (
          <Box className={classes.column} ml={2}>
            {matchingJobs.length > 0 ? (
              <Box mb={2}>
                <MqText heading>
                  Matching Jobs
                </MqText>
              </Box>
            ) : (
              <Box textAlign={'center'}>
                <MqText subdued>no jobs found!</MqText>
              </Box>
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
            {matchingJobs.length > 0 && (
              <Pagination color={'standard'}
                          shape={'rounded'}
                          onChange={(event, page) => {
                            setJobPageIndex(page - 1)
                          }}
                          count={Math.ceil(matchingJobs.length / limit)}
              />
            )}
          </Box>
        )}
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
