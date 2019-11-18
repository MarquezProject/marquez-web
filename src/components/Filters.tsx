import React, { ReactElement, useState } from 'react'
import MUISelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import uniq from 'lodash/uniq'
import { withStyles } from '@material-ui/core/styles'
import { capitalize } from '../helpers'
import { IProps } from '../containers/FilterContainer'
// import { IFilterByDisplay, IFilterByKey } from '../types'

const StyledFormControl = withStyles({
  root: {
    margin: '0rem 2rem',
    minWidth: '10rem'
  }
})(FormControl)

interface IFilterDictionary {
  [key: string]: {
    entities: any[]
    accessor: (n: any) => any
  }
}

const filterByOptions: { [key: string]: 'namespace' | 'sourceName' } = {
  namespace: 'namespace',
  datasource: 'sourceName'
}

const Filters = (props: IProps): ReactElement => {
  const { namespaces, datasets, filterJobs, filterDatasets, showJobs } = props
  const [currentFilter, setCurrentFilter] = useState('all')

  const [showSubFilter, toggleShowSubFilter] = useState(false)

  const datasources = uniq(datasets.map(d => d.sourceName))

  const filterDictionary: IFilterDictionary = {
    namespace: {
      entities: namespaces,
      accessor: n => n.name
    },
    datasource: {
      entities: datasources,
      accessor: n => n
    }
  }

  const [currentFilterValue, setCurrentFilterValue] = useState({})
  return (
    <Box p={2}>
      <StyledFormControl margin='normal'>
        <InputLabel id='filter-by-label'>Filter by</InputLabel>
        <MUISelect
          value={currentFilter}
          renderValue={capitalize}
          onChange={e => {
            const newValue = e.target.value as 'namespace' | 'datasource' | 'all'
            // debugger
            setCurrentFilter(newValue)
            if (newValue === 'all') {
              toggleShowSubFilter(false)
            } else {
              setCurrentFilterValue(
                filterDictionary[e.target.value as 'namespace' | 'datasource'].entities[0]
              )
              toggleShowSubFilter(true)
            }
          }}
        >
          {Object.keys(filterByOptions).map(o => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
          <MenuItem key='all' value='all'>
            All
          </MenuItem>
        </MUISelect>
      </StyledFormControl>
      {showSubFilter && (
        <StyledFormControl margin='normal'>
          <InputLabel id='secondary-filter'>{currentFilter}</InputLabel>
          <MUISelect
            value={currentFilterValue}
            renderValue={filterDictionary[currentFilter].accessor}
            onChange={e => {
              const currentFilterValue = e.target.value as string
              const currentFilterKeyDisplay = filterByOptions[currentFilter]
              const currentFilterKey = filterByOptions[currentFilterKeyDisplay]
              setCurrentFilterValue(currentFilterValue)
              filterJobs(
                currentFilterKey,
                filterDictionary[currentFilter].accessor(currentFilterValue)
              )
              filterDatasets(
                currentFilterKey,
                filterDictionary[currentFilter].accessor(currentFilterValue)
              )
              showJobs(true)
            }}
          >
            {filterDictionary[currentFilter].entities.map(o => {
              const val = filterDictionary[currentFilter].accessor(o)
              return (
                <MenuItem key={val} value={o}>
                  {val}
                </MenuItem>
              )
            })}
          </MUISelect>
        </StyledFormControl>
      )}
    </Box>
  )
}

export default Filters
