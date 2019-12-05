import { mount } from 'enzyme'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import DatasetDetailPage from '../../components/DatasetDetailPage'
import { formatUpdatedAt } from '../../helpers'

const datasets = require('../../../docker/db/data/datasets.json')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: jest.fn()
}))

import { useParams } from 'react-router-dom'

describe('JobDetailPage Component', () => {
  describe('when there is no match for the jobName in url params', () => {
    useParams.mockImplementation(() => ({
      jobName: 'test.dataset'
    }))

    const wrapper = mount(<DatasetDetailPage />)

    it('should render', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})