import { connect } from 'react-redux'
import * as Redux from 'redux'
import { bindActionCreators } from 'redux'
import DatasetDetailPage from '../components/DatasetDetailPage'
import { IState } from '../reducers'

const mapStateToProps = (state: IState) => ({
  jobs: state.jobs
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetDetailPage)