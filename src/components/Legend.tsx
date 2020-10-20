import React, { ReactElement } from 'react'

import { Box, Typography } from '@material-ui/core'
import {
  Theme as ITheme,
  WithStyles as IWithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'


const styles = ({ spacing, palette }: ITheme) => {
  return createStyles({
    datasetShape: {
      backgroundColor: palette.common.white
    },
    jobShape: {
      borderRadius: '50%',
      backgroundColor: palette.common.white
    },
    shape: {
      width: spacing(2),
      height: spacing(2),
      margin: '4px 6px 0px 6px'
    },
  })
}

interface IProps {
  customClassName: string
}

type AllProps = IWithStyles<typeof styles> & IProps
interface IState {}

class Legend extends React.Component<AllProps, IState> {
  render(): ReactElement {
    const { classes, customClassName } = this.props
    return (
      <Box className={customClassName} display='flex'>
        <div className={`${classes.datasetShape} ${classes.shape}`} />
        <Typography>datasets</Typography>
        <div className={`${classes.jobShape} ${classes.shape}`} />
        <Typography>jobs</Typography>
      </Box>
    )
  }
}

export default withStyles(styles)(Legend)
