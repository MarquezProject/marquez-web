import { connect } from 'react-redux'
import * as Redux from 'redux'
import { bindActionCreators } from 'redux'
import Home from '../components/Home'
import { IState } from '../reducers'

interface IInjectedProps {
  showJobs: boolean
  setShowJobs: (bool: boolean) => void
}

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets,
  jobs: state.jobs
})

type IStateProps = ReturnType<typeof mapStateToProps>

interface IDispatchProps {}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => bindActionCreators({}, dispatch)

export default connect<IStateProps, IDispatchProps, IInjectedProps>(
  mapStateToProps,
  mapDispatchToProps
)(Home)
