import { mount } from 'enzyme'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import fakeTagToBadge from '../../config/__mocks__/tag-to-badge'
import DatasetPreviewCard from '../../components/DatasetPreviewCard'
import { formatUpdatedAt } from '../../helpers'

/*
  Mock the functionality of tagToBadge
  (reads from the __mocks__ folder of src/config)
*/
jest.mock('../../config/tag-to-badge')
const datasets = require('../../../docker/db/data/datasets.json')
describe('DatasetPreviewCard Component', () => {
  const wrapper = mount(<DatasetPreviewCard />)
  it('Should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  const dataset = datasets[0]
  const tags = ['is_pii']
  wrapper.setProps({ ...dataset, tags })
  const componentText = wrapper.render().text()

  it('should render the dataset name', () => {
    expect(componentText).toContain(dataset.name)
  })
  it('should render the description', () => {
    expect(componentText).toContain(dataset.description)
  })
  it('should render the time', () => {
    expect(
      wrapper
        .find(Typography)
        .last()
        .text()
    ).toContain(formatUpdatedAt(dataset.updatedAt))
  })
  it('should render a badge per tag that has a corresponding entry in the tagToBadge config', () => {
    // const tagIsInFakeConfig = tag => !!fakeTagToBadge[tag]

    expect(wrapper.find('#tagContainer').children().filterWhere((item) => item.prop('color') === 'secondary')).toHaveLength(
      tags.length
    )
  })
  it('renders a snapshot that matches previous', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
