import { mount } from 'enzyme'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'

import JobDetailPage from '../../components/JobDetailPage'
import { formatUpdatedAt } from '../../helpers'

const jobs = require('../../../docker/db/data/jobs.json')

describe('formatUpdated Function', () => {
  const updatedAt = ''
  const formattedDate = formatUpdatedAt(updatedAt)
  it('Should return an empty string when passed a falsey value', () => {
    expect(formattedDate).toBe('')
  })
})

describe('JobDetailPage Component', () => {
  const wrapper = mount(<JobDetailPage />)
  it('Should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  const job = jobs[0]

  wrapper.setProps(job)
  const componentText = wrapper.render().text()

  it('should render the job name', () => {
    expect(
      wrapper
        .find(Typography)
        .first()
        .text()
    ).toContain(job.name)
  })
  it('job name should contain a link to the job description', () => {
    expect(
      wrapper
        .find(Typography)
        .first()
        .find('a')
        .first()
        .text()
    ).toContain(job.location)
  })
  it('should render the job description', () => {
    expect(
      wrapper
        .find(Typography)
        .at(1) // zero-indexed
        .text()
    ).toContain(job.description)
  })
  it('should render the job time', () => {
    expect(componentText).toContain(formatUpdatedAt(job.updatedAt))
  })
  test.skip('should render the job status', () => {
    expect(componentText).toContain(job.status)
  })
  it('renders a snapshot that matches previous', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
