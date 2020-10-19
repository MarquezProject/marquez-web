import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { CssBaseline } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import {
  Theme as ITheme,
  WithStyles as IWithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import React, { ReactElement, useState } from 'react'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import {theme} from '../helpers/theme'
import CustomSearchBar from './CustomSearchBar'
import DatasetDetailPage from './DatasetDetailPage'
import Header from './header/Header'
import Home from './Home'
import JobDetailPage from './JobDetailPage'
import NetworkGraph from './NetworkGraph'
import Toast from './Toast'
import createRootReducer from '../reducers'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware({
  onError: (error, _sagaStackIgnored) => {
    console.log('There was an error in the saga', error)
  }
})
const history = createBrowserHistory()
const historyMiddleware = routerMiddleware(history)

const middleware = __DEVELOPMENT__
  ? [sagaMiddleware, historyMiddleware, logger]
  : [sagaMiddleware, historyMiddleware]

const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(...middleware))
)

sagaMiddleware.run(rootSaga)

const styles = (_theme: ITheme) => {
  return createStyles({
    root: {
      height: '100vh',
      display: 'flex'
    }
  })
}

type IProps = IWithStyles<typeof styles>

const TITLE = 'Marquez | Data Kit'

const App = ({ classes }: IProps): ReactElement => {
  const [showJobs, setShowJobs] = useState(false)
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>
          <CssBaseline />
          <Grid direction='column' alignItems='stretch' classes={classes} justify='space-between'>
            <Header />
            <NetworkGraph />
            <CustomSearchBar
              setShowJobs={setShowJobs}
              showJobs={showJobs}
            />
            <Switch>
              <Route
                path='/'
                exact
                render={props => (
                  <Home {...props} showJobs={showJobs} setShowJobs={setShowJobs} />
                  )}
              />
              <Route path='/datasets/:datasetName' exact component={DatasetDetailPage} />
              <Route path='/jobs/:jobName' exact component={JobDetailPage} />
            </Switch>
            <Toast />
          </Grid>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  )
}

export default withStyles(styles)(App)
