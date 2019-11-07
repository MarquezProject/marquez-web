import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import 'typeface-rajdhani'
import '../img/we-logo.png'

const styles = ({ spacing, zIndex }: ITheme) => {
  return createStyles({
    appBar: {
      zIndex: zIndex.drawer + 1
    },
    rightToolbar: {
      marginLeft: 'auto',
      marginRight: 2.5
    },
    feedbackButton: {
      padding: spacing(1),
      backgroundColor: '#2B2B33',
      color: 'white',
      fontSize: 15,
      borderWidth: 1.2,
      '&:hover': {
        color: '#71ddbf',
        cursor: 'pointer',
        borderColor: '#71ddbf'
      }
    }
  })
}

interface IProps extends IWithStyles<typeof styles> {}

const MyAppBar = (props: IProps): ReactElement => {
  const { classes } = props
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Box mr={2}>
          <img src='img/we-logo.png' height={50} alt='WeWork Logo' />
        </Box>
        <Typography
          variant='h4'
          color='inherit'
          noWrap
          style={{ fontFamily: 'rajdhani', fontWeight: 'bold' }}
        >
          <Link to='/' className='link'>
            MARQUEZ
          </Link>
        </Typography>
        <div className={classes.rightToolbar}>
          <a href='https://forms.gle/gWj8fn8iYiTsKEPD6' target='_blank' rel='noopener noreferrer'>
            <button className={classes.feedbackButton}> Feedback </button>
          </a>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(MyAppBar)
