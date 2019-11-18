import { shallow } from 'enzyme'
import * as React from 'react'
import Filters from '../../components/Filters'
import Select from '@material-ui/core/Select'

const jobs = require('../../../docker/db/data/jobs.json')
const datasets = require('../../../docker/db/data/jobs.json')
const namespaces = require('../../../docker/db/data/jobs.json')

describe('Filters Component', () => {
  const mockProps = {
    datasets: [],
    jobs: [],
    namespaces
  }

  const wrapper = shallow(<Filters {...mockProps} />)

  it('should render only one Select component on initial render', () => {
    expect(wrapper.find(Select)).toHaveLength(1)
  })

  it('should render second Select component after onChange event for first Select', () => {
    const clickEvent = { target: { value: 'namespace' } }
    wrapper.find(Select).simulate('change', clickEvent)
    expect(wrapper.find(Select)).toHaveLength(2)
  })

  it('renders a snapshot that matches previous', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
