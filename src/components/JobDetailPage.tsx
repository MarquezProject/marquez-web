import React, { ReactElement } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
const globalStyles = require('../global_styles.css')
const { vibrantGreen } = globalStyles
import { Typography, Box } from '@material-ui/core'
import { formatUpdatedAt } from '../helpers'

import { IJobAPI } from '../types/api'

const styles = ({ palette, spacing }: ITheme) => {
  return createStyles({
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
    failed: {
      backgroundColor: palette.error.main
    },
    passed: {
      backgroundColor: vibrantGreen
    }
  })
}

type IProps = IWithStyles<typeof styles> &
  Pick<IJobAPI, 'name' | 'description' | 'updatedAt' | 'status' | 'location'>
interface IState {}

const StyledTypography = withStyles({
  root: {
    maxWidth: '90%'
  }
})(Typography)

class JobDetailPage extends React.Component<IProps, IState> {
  render(): ReactElement {
    const { classes, name, description, updatedAt = '', status = 'passed', location } = this.props

    return (
      <Box p={2} display='flex' justifyContent='space-between'>
        <div>
          <div className={`${classes[status]} ${classes.status}`} />
          <Typography color='secondary' variant='h3'>
            <a href={location} className='link' target='_'>
              {name}
            </a>
          </Typography>
          <StyledTypography color='primary'>{description}</StyledTypography>
        </div>
        <Box
          className={classes.rightCol}
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
          justifyContent='space-between'
        >
          <Typography className={classes.lastUpdated}>{formatUpdatedAt(updatedAt)}</Typography>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(JobDetailPage)
