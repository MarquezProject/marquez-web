import React, { FunctionComponent } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import { useParams } from 'react-router-dom'
import _find from 'lodash/find'

const globalStyles = require('../global_styles.css')
const { vibrantGreen } = globalStyles
import { formatUpdatedAt } from '../helpers'

import { IJob } from '../types'

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
    }
  })
}

type IProps = IWithStyles<typeof styles> & { jobs: IJob[] }

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

const JobDetailPage: FunctionComponent<IProps> = props => {
  const { jobs, classes } = props
  const {
    root,
    _status,
    _name,
    _description,
    _SQL,
    _owner,
    _ownerIcon,
    lastUpdated,
    topSection
  } = classes
  const { jobName } = useParams()
  const job = _find(jobs, j => j.name === jobName)
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
          No job by the name of <strong>"{jobName}"</strong> found
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
    context = { SQL: null }
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
        height={200}
        bgcolor='white'
        boxShadow={1}
        p={2}
        mx='auto'
        my={2}
        borderRadius='3px'
      >
        {SQL ? (
          SQL.split('\n').map((line, i) => {
            return <StyledTypographySQL key={i}>{line}</StyledTypographySQL>
          })
        ) : (
          <StyledTypographySQL>There is no SQL for this job at this time.</StyledTypographySQL>
        )}
      </Box>
      <Typography className={lastUpdated} align='right'>
        {formatUpdatedAt(updatedAt)}
      </Typography>
    </Box>
  )
}

export default withStyles(styles)(JobDetailPage)
