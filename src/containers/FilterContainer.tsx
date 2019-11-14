import { connect } from 'react-redux'
import * as Redux from 'redux'
import { bindActionCreators } from 'redux'
import Filters from '../components/Filters'
import { IState } from '../reducers'

import { findMatchingEntities } from '../actionCreators'
import React, { FunctionComponent } from 'react'
import { INamespaceAPI, IDatasetAPI } from '../types/api'

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets,
  // jobs: state.jobs,
  namespaces: state.namespaces
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) =>
  bindActionCreators({ findMatchingEntities: findMatchingEntities }, dispatch)

interface IProps {
  namespaces: INamespaceAPI[]
  datasets: IDatasetAPI[]
}

const FiltersWrapper: FunctionComponent<IProps> = props => {
  const { namespaces, datasets } = props
  return namespaces.length && datasets.length ? (
    <Filters namespaces={namespaces} datasets={datasets} />
  ) : null
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersWrapper)
