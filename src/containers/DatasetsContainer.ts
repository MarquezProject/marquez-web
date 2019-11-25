import { connect } from 'react-redux'
import * as Redux from 'redux'
import { bindActionCreators } from 'redux'
import Datasets from '../components/Datasets'
import { IState } from '../reducers'

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  actions: bindActionCreators({}, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Datasets)
