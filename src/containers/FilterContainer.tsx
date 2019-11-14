import { connect } from 'react-redux'
import * as Redux from 'redux'
import { bindActionCreators } from 'redux'
import Filters from '../components/Filters'
import { IState } from '../reducers'

import { findMatchingEntities, filterDatasets, filterJobs } from '../actionCreators'
import React, { FunctionComponent } from 'react'
import { INamespaceAPI, IDatasetAPI } from '../types/api'

const mapStateToProps = (state: IState) => ({
  // jobs: state.jobs,
  datasets: state.datasets,
  namespaces: state.namespaces
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) =>
  bindActionCreators({ findMatchingEntities, filterDatasets, filterJobs }, dispatch)

export interface IProps {
  namespaces: INamespaceAPI[]
  datasets: IDatasetAPI[]
  filterJobs: typeof filterJobs
  filterDatasets: typeof filterDatasets
}

const FiltersWrapper: FunctionComponent<IProps> = props => {
  const { namespaces, datasets, filterJobs, filterDatasets } = props
  return namespaces.length && datasets.length ? (
    <Filters
      namespaces={namespaces}
      datasets={datasets}
      filterDatasets={filterDatasets}
      filterJobs={filterJobs}
    />
  ) : null
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersWrapper)
