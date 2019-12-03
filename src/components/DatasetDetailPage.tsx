import React, { FunctionComponent } from 'react'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme as ITheme
} from '@material-ui/core/styles'
import { Typography, Box, Tooltip } from '@material-ui/core'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import tagToBadge from '../config/tag-to-badge'


import { useParams } from 'react-router-dom'
import _find from 'lodash/find'
import _keys from 'lodash/keys'

import { IDataset } from '../types'

const styles = ({ palette, spacing }: ITheme) => {
  return createStyles({
    root: {
      padding: '42vh 6% 1%',
      position: 'absolute',
      zIndex: 1,
      width: '100%'
    },
    tagContainer: {
      display: 'flex',
      margin: '12px 12px 0px 0px'
    },
    paper: {
      width: '100%',
      overflowX: 'auto',
      marginTop: '6px'
    },
    table: {
      minWidth: 650
    },
    updated: {
      marginTop: '10px'
    }
  })
}

type IProps = IWithStyles<typeof styles> & { datasets: IDataset[] }

const DatasetDetailPage: FunctionComponent<IProps> = props => {
  const { datasets, classes } = props
  const {
    root, paper, table, updated, tagContainer
  } = classes
  const { datasetName } = useParams()
  const dataset = _find(datasets, d => d.name === datasetName)
  if (!dataset) {
    return (
      <Box
        p={4}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        className={root}
      >
        <Typography align='center'>
          No dataset by the name of <strong>&quot;{datasetName}&quot;</strong> found
        </Typography>
      </Box>
    )
  } else {
    const {
      name,
      description,
      tags = [],
      updatedAt
    } = dataset

    const fakeHeaders = ['uuid', 'name', 'location', 'usf', 'open']

    const createFakeData = function(uuid: string, name: string, location: string, usf: number, open: boolean) {
      return { uuid, name, location, usf, open };
    }
    
    const rows = [
      createFakeData('8dg2j54ldkg93d', '555 Burrard Street', 'Atlanta', 25000, true),
      createFakeData('kj5ld89gjk3ld9', '595 Weston Lane', 'Philadelphia', 50000, false),
    ];
  
    return (
      <Box mt={10} className={root}>
        <Box display='flex' justifyContent='space-between'>
          <div>
            <Typography color='secondary' align='left'>
              <strong>{name}</strong>
            </Typography>
            <Typography color='primary' align='left'>
              {description}
            </Typography>
          </div>
          <div id='tagContainer' className={tagContainer}>
            {_keys(tagToBadge.default).map((key: string) => {
              return (
                <div key={key}>
                  <Tooltip className="tagWrapper" title={key} placement="top">
                    {tags.includes(key) ? tagToBadge.highlighted[key] : tagToBadge.default[key]}
                  </Tooltip>
                </div>
              )
            })}
          </div>
        </Box>
        <Paper className={paper}>
          <Table className={table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {
                  fakeHeaders.map((header: string) => {
                    return <TableCell key={header} align="left"><strong>{header}</strong></TableCell>
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.uuid}>
                  {
                    fakeHeaders.map((header: string) => {
                      return <TableCell key={header} align="left">{row[header].toString()}</TableCell>
                    })
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Typography className={updated} color='primary' align='right'>
          {updatedAt}
        </Typography>
      </Box>
    )
  }
}

export default withStyles(styles)(DatasetDetailPage)

