import React, { ReactElement } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import { isoParse, timeFormat } from 'd3-time-format'
import tagToBadge from '../config/tag-to-badge'

import { IDatasetAPI } from '../types/api'
const _  = require('lodash')

const styles = ({ palette }: ITheme) => {
  return createStyles({
    rightCol: {
      textAlign: 'right'
    },
    lastUpdated: {
      color: palette.grey[600]
    }
  })
}

const StyledTypography = withStyles({
  root: {
    maxWidth: '90%'
  }
})(Typography)

type IProps = IWithStyles<typeof styles> &
  Pick<IDatasetAPI, 'name' | 'description' | 'updatedAt' | 'tags'>
interface IState {}

const customTimeFormat = timeFormat('%b %d, %Y %I:%m%p')

export const formatUpdatedAt = (updatedAt: string) => {
  if (!updatedAt) {
    return ''
  } else {
    const dateString = customTimeFormat(isoParse(updatedAt))
    return `${dateString.slice(0, -2)}${dateString.slice(-2).toLowerCase()}`
  }
}
class DatasetPreviewCard extends React.Component<IProps, IState> {
  render(): ReactElement {
    const { classes, name, description, updatedAt, tags = ['is_pii'] } = this.props
    return (
      <Box p={2} m={1} bgcolor='white' boxShadow={3} display='flex' justifyContent='space-between'>
        <div>
          <Typography color='secondary' variant='h3'>
            {name}
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
          <div id='tagContainer'>	            
            {_.keys(tagToBadge.default).map((key: string) => {
              if (tags.includes(key)) {
                return tagToBadge.highlighted[key]
              } else {
                return tagToBadge.default[key]
              }
            })}</div>
          <Typography className={classes.lastUpdated}>{formatUpdatedAt(updatedAt)}</Typography>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(DatasetPreviewCard)
