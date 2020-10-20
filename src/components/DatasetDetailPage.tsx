import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import {
  Theme as ITheme,
  WithStyles as IWithStyles,
  createStyles,
  withStyles
} from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'

import InfoIcon from '@material-ui/icons/Info'

import { formatUpdatedAt } from '../helpers'

import { useParams } from 'react-router-dom'
import _find from 'lodash/find'

import * as Redux from 'redux'
import { Dataset } from '../types/api'
import {IState} from '../reducers'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import MqText from './core/text/MqText'

const styles = ({ shadows, spacing }: ITheme) => {
  return createStyles({
    root: {
      padding: `0 ${spacing(2)}px`
    },
    noData: {
      padding: '125px 0 0 0'
    },
    noSchema: {
      boxShadow: shadows[1],
      padding: '1rem'
    },
    noSchemaTitle: {
      fontSize: '14px'
    },
    infoIcon: {
      paddingLeft: '3px',
      paddingTop: '3px'
    },
    tableCell: {
      display: 'flex',
      paddingTop: '12px',
      flexFlow: 'row nowrap',
      flexGrow: 1,
      flexBasis: 0
    },
    tableRow: {
      display: 'flex',
      width: '100%'
    },
    paper: {
      overflowX: 'auto',
      marginTop: '10px',
      display: 'flex',
      flexFlow: 'column nowrap'
    },
    updated: {
      marginTop: '10px'
    },
  })
}

type IProps = IWithStyles<typeof styles> & { datasets: Dataset[] }

const DatasetDetailPage: FunctionComponent<IProps> = props => {
  const { datasets, classes } = props
  const {
    root, paper, updated, noSchema, noSchemaTitle, infoIcon, tableCell, tableRow
  } = classes
  const { datasetName } = useParams()
  const dataset = _find(datasets, d => d.name === datasetName)
  if (!dataset) {
    return (
      <Box
        mt={10}
        display='flex'
        justifyContent="center"
        className={root}
      >
        <MqText>
          No dataset by the name of <strong>&quot;{datasetName}&quot;</strong> found
        </MqText>
      </Box>
    )
  } else {
    const {
      name,
      description,
      updatedAt,
      fields
    } = dataset

    return (
      <Box mt={10} className={root}>
        <Box display='flex' justifyContent='space-between'>
          <div>
            <MqText subheading font={'mono'}>
              {name}
            </MqText>
            <MqText subdued>
              {description}
            </MqText>
          </div>
        </Box>
        {fields && fields.length > 0 ? (
          <Paper className={paper}>
            <Table size="small">
              <TableHead>
                <TableRow className={tableRow}>
                  {
                    fields.map((field) => {
                      return (
                      <TableCell className={tableCell} key={field.name} align="center"><strong>{field.name}</strong>
                        <Tooltip title={field.type} placement="top">
                          <div className={infoIcon}>
                            <InfoIcon color='disabled' fontSize='small' />
                          </div>
                        </Tooltip>
                      </TableCell>
                      )
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={tableRow}>
                  {fields.map((field) => {
                    return <TableCell className={tableCell} key={field.name} align="left">{field.description || 'no description'}</TableCell>
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <div className={noSchema}>
            <Typography className={noSchemaTitle}>
              schema not present
            </Typography>
          </div>
        )}
        <Typography className={updated} color='primary' align='right'>
          last updated: {formatUpdatedAt(updatedAt)}
        </Typography>
      </Box>
    )
  }
}

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DatasetDetailPage))
