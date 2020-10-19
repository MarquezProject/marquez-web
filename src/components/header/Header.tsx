import { AppBar, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  Theme,
  WithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'
import React, {ReactElement} from 'react'
import SearchBar from '../search-bar/SearchBar'

const styles = (theme: Theme) => {
  return createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      padding: `${theme.spacing(2)}px 0`
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  })
}

interface OwnProps {
  setShowJobs: (bool: boolean) => void
    showJobs: boolean
}

type HeaderProps = OwnProps & WithStyles<typeof styles>

const Header = (props: HeaderProps): ReactElement => {
  const { classes } = props
  return (
    <AppBar position='fixed' elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Link to="/">
          <img src={require('../../img/marquez_logo.svg')} height={48} alt='Marquez Logo' />
        </Link>
        <SearchBar               setShowJobs={props.setShowJobs}
                                 showJobs={props.showJobs} />
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(Header)
