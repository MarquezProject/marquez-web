import React, { ReactElement, FunctionComponent } from 'react'
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
      marginTop: '52vh'
    },
    rightCol: {
      textAlign: 'right'
    },
    lastUpdated: {
      color: palette.grey[600]
    },
    status: {
      width: spacing(2),
      height: spacing(2),
      borderRadius: '50%'
    },
    SQL: {
      overflow: 'hidden'
    },
    failed: {
      backgroundColor: palette.error.main
    },
    passed: {
      backgroundColor: vibrantGreen
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
    whiteSpace: 'pre'
  }
})(Typography)

const JobDetailPage: FunctionComponent<IProps> = props => {
  const { jobs, classes } = props

  const { jobName } = useParams()
  const job = _find(jobs, j => j.name === jobName)
  if (!job) {
    return <p>No job</p>
  }
  const {
    name,
    description,
    updatedAt = '',
    status = 'passed',
    location,
    namespace,
    context = { SQL: '' }
  } = job
  console.log('description', description)
  console.log('context', context)
  const { SQL = '' } = context
  return (
    <Box
      p={2}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width='100%'
      className={classes.root}
    >
      <div>
        <div className={`${classes[status]} ${classes.status}`} />
        <Typography color='secondary' variant='h3'>
          <a href={location} className='link' target='_'>
            {name}
          </a>
        </Typography>
        <StyledTypography color='primary'>{description}</StyledTypography>
        <Box
          className={classes.rightCol}
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
          justifyContent='space-between'
        >
          <HowToRegIcon color='secondary' />
          <Typography>{namespace}</Typography>
        </Box>
      </div>
      <Box
        className={classes.SQL}
        width='100%'
        minHeight='75%'
        maxHeight={200}
        bgcolor='white'
        boxShadow={1}
        p={2}
      >
        {SQL.split('\n').map((line, i) => {
          return <StyledTypographySQL key={i}>{line}</StyledTypographySQL>
        })}
      </Box>
      <Typography className={classes.lastUpdated}>{formatUpdatedAt(updatedAt)}</Typography>
    </Box>
  )
}

export default withStyles(styles)(JobDetailPage)
