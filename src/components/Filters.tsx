import React, { ReactElement, useState } from 'react'
import MUISelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import uniq from 'lodash/uniq'
import { withStyles } from '@material-ui/core/styles'
import { INamespaceAPI, IDatasetAPI } from '../types/api'

const StyledFormControl = withStyles({
  root: {
    margin: '0rem 2rem'
  }
})(FormControl)

interface IProps {
  namespaces: INamespaceAPI[]
  datasets: IDatasetAPI[]
}

interface IFilterDictionary {
  [key: string]: {
    entities: any[]
    accessor: (n: any) => any
  }
}

const filterByOptions = ['Namespace', 'owner', 'Datasource', 'tags']
const Filters = (props: IProps): ReactElement => {
  const { namespaces, datasets } = props

  const defaultFilter = filterByOptions[0]
  const [currentFilter, setCurrentFilter] = useState(defaultFilter)

  const datasources = uniq(datasets.map(d => d.sourceName))

  const filterDictionary: IFilterDictionary = {
    Namespace: {
      entities: namespaces,
      accessor: n => n.name
    },
    Datasource: {
      entities: datasources,
      accessor: n => n
    }
  }

  const [currentFilterValue, setCurrentFilterValue] = useState(
    filterDictionary[defaultFilter].entities[0]
  )

  return (
    <Box p={2}>
      <StyledFormControl margin='normal'>
        <InputLabel id='filter-by-label'>Filter by</InputLabel>
        <MUISelect
          value={currentFilter}
          onChange={e => {
            setCurrentFilter(e.target.value as 'Namespace' | 'owner' | 'Datasource')
            setCurrentFilterValue(
              filterDictionary[e.target.value as 'Namespace' | 'owner' | 'Datasource'].entities[0]
            )
          }}
        >
          {filterByOptions.map(o => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </MUISelect>
      </StyledFormControl>
      <StyledFormControl margin='normal'>
        <InputLabel id='secondary-filter'>{currentFilter}</InputLabel>
        <MUISelect
          value={currentFilterValue}
          onChange={e => setCurrentFilterValue(e.target.value as string)}
        >
          {filterDictionary[currentFilter].entities.map(o => (
            <MenuItem key={o} value={o}>
              {filterDictionary[currentFilter].accessor(o)}
            </MenuItem>
          ))}
        </MUISelect>
      </StyledFormControl>
    </Box>
  )
}

export default Filters
