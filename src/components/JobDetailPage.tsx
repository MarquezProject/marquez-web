import React, { FunctionComponent, useEffect } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import { useParams, RouteComponentProps } from 'react-router-dom'
import _find from 'lodash/find'

const globalStyles = require('../global_styles.css')
const { vibrantGreen, deepRed, jobRunYellow, jobRunBlue, jobNodeGrey } = globalStyles
import { formatUpdatedAt } from '../helpers'

import { IJob } from '../types'
import { fetchJobRuns as _fetchJobRuns } from '../actionCreators'

const styles = ({ palette, spacing }: ITheme) => {
  return createStyles({
    root: {
      marginTop: '52vh',
      height: '48vh'
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: '40px 3fr 1fr',
      gridTemplateRows: '1fr 1fr',
      /* eslint-disable @typescript-eslint/quotes */
      gridTemplateAreas: `'status name owner-icon' '. description owner'`,
      alignItems: 'center'
    },
    lastUpdated: {
      color: palette.grey[600]
    },
    _status: {
      gridArea: 'status',
      width: spacing(2),
      height: spacing(2),
      borderRadius: '50%'
    },
    failed: {
      backgroundColor: palette.error.main
    },
    passed: {
      backgroundColor: vibrantGreen
    },
    _name: {
      gridArea: 'name'
    },
    _description: {
      gridArea: 'description'
    },
    _owner: {
      gridArea: 'owner',
      justifySelf: 'end'
    },
    _ownerIcon: {
      gridArea: 'owner-icon',
      justifySelf: 'end'
    },
    _SQL: {
      overflow: 'hidden'
    },
    _SQLComment: {
      color: palette.grey[400]
    },
    jobRun: {
      minWidth: '1.25rem',
      minHeight: '1.25rem',
      backgroundColor: '#e4cd51',
      margin: '0.25rem',
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    jobRun_NEW: {
      backgroundColor: jobRunBlue
    },
    jobRun_RUNNING: {
      backgroundColor: jobRunYellow
    },
    jobRun_COMPLETED: {
      backgroundColor: vibrantGreen
    },
    jobRun_FAILED: {
      backgroundColor: deepRed
    },
    jobRun_ABORTED: {
      backgroundColor: jobNodeGrey
    }
  })
}

type IProps = IWithStyles<typeof styles> & { jobs: IJob[]; fetchJobRuns: typeof _fetchJobRuns }

const StyledTypography = withStyles({
  root: {
    maxWidth: '90%'
  }
})(Typography)

const StyledTypographySQL = withStyles({
  root: {
    whiteSpace: 'pre',
    fontFamily: `'Inconsolata', monospace`
  }
})(Typography)

const TypographyWithLeftMargin = withStyles({
  root: {
    marginLeft: '2rem'
  }
})(Typography)

const JobDetailPage: FunctionComponent<
  IProps & RouteComponentProps<{ jobName: string }>
> = props => {
  const { jobs, classes, fetchJobRuns } = props

  const {
    root,
    _status,
    _name,
    _description,
    _SQL,
    _SQLComment,
    _owner,
    _ownerIcon,
    lastUpdated,
    topSection,
    jobRun
  } = classes
  const { jobName } = useParams()
  const job = _find(jobs, j => j.name === jobName)

  useEffect(() => {
    if (job && !job.lastTenRuns) {
      fetchJobRuns(job.name, job.namespace)
    }
  }, [props.jobs])

  if (!job) {
    return (
      <Box
        p={4}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        className={root}
      >
        <Typography align='center'>
          No job by the name of <strong>&quot;{jobName}&quot;</strong> found
        </Typography>
      </Box>
    )
  }
  const {
    name,
    description,
    updatedAt = '',
    status = 'passed',
    location,
    namespace,
    context = { SQL: null },
    lastTenRuns
  } = job

  const { SQL } = context

  return (
    <Box
      p={4}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      className={root}
    >
      <div className={topSection}>
        <div className={`${_status} ${classes[status]}`} />
        <Typography color='secondary' variant='h3' className={_name}>
          <a href={location} className='link' target='_'>
            {name}
          </a>
        </Typography>
        <StyledTypography color='primary' className={_description}>
          {description}
        </StyledTypography>
        <HowToRegIcon color='secondary' className={_ownerIcon} />
        <Typography className={_owner}>{namespace}</Typography>
      </div>
      <Box
        className={_SQL}
        width='80%'
        minHeight={200}
        maxHeight={250}
        bgcolor='white'
        boxShadow={1}
        // using border to create effect of padding, which will not work when there's overflow
        border='1rem solid white'
        borderLeft='2rem solid white'
        mx='auto'
        my={2}
        borderRadius='3px'
      >
        {SQL ? (
          SQL.split('\n').map((line, i) => {
            const extraClass = line.trim().startsWith('--') ? _SQLComment : ''

            return (
              <StyledTypographySQL key={i} className={extraClass}>
                {line}
              </StyledTypographySQL>
            )
          })
        ) : (
          <StyledTypographySQL align='center'>
            There is no SQL for this job at this time.
          </StyledTypographySQL>
        )}
      </Box>
      <Box flexDirection='row' textAlign='end'>
        {(lastTenRuns || []).map(r => {
          const { runState, runId } = r
          const colorClass = `jobRun_${runState}`
          return (
            <Tooltip
              key={runId}
              placement='top'
              title={`job state: ${runState}`}
              id='job_run_details'
            >
              <div key={runId} className={`${jobRun} ${(classes as any)[colorClass]}`}></div>
            </Tooltip>
          )
        })}
        <TypographyWithLeftMargin className={lastUpdated} align='right' display='inline'>
          {formatUpdatedAt(updatedAt)}
        </TypographyWithLeftMargin>
      </Box>
    </Box>
  )
}

export default withStyles(styles)(JobDetailPage)
