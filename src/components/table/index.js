import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import OriginTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from 'src/components/paper'
import Typography from 'src/components/typography'
import TableHead from './table-head'
import indigo from '@material-ui/core/colors/indigo'

const debug = require('debug')(`${__PROJECT__}:${__dirname}`)

const styles = theme => ({
  root: {
    '& a': {
      textDecoration: 'none',
      color: theme.palette.secondary.light,
    },
    '& a:visited': {
      color: theme.palette.secondary.light,
    },
  },
  nothing: {
    marginTop: theme.spacing.unit * 6,
  },
  cell: {
    whiteSpace: 'normal',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  highlight: {
    backgroundColor: indigo[50],
  },
  pointer: {
    cursor: 'pointer',
  },
})

class Table extends PureComponent {
  render() {
    const {
      className,
      classes,
      columns,
      orderBy,
      orderDirection,
      rows = [],
      clickable,
      onRequestSort,
      rowActions,
    } = this.props
    debug('render', this.props)

    if (!rows.length) {
      return (
        <Typography
          className={cn(className, classes.nothing)}
          variant="subheading"
          align="center"
        >
          No entries to display
        </Typography>
      )
    }

    return (
      <Paper className={cn(className, classes.root)} >
        <OriginTable>
          <TableHead
            columns={columns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestSort={onRequestSort}
          />
          <TableBody>
            { rows.map(row => (
              <TableRow
                key={row.id}
                tabIndex={-1}
                className={cn(row.highlight && classes.highlight, clickable && classes.pointer)}
                hover
                onClick={this.handleRowClick(row.clickAction)}
              >
                { columns.map(column => (
                  <TableCell
                    key={String(column.id) + String(row.id)}
                    classes={{ root: cn(classes.cell) }}
                    numeric={column.numeric}
                    padding={column.padding}
                  >
                    { column.component && (
                      <column.component
                        rowId={row.id}
                        {...row[column.id]}
                        rowActions={rowActions}
                      />
                    ) }
                    { !column.component && (
                      row[column.id]
                    ) }
                  </TableCell>
                )) }
              </TableRow>
            )) }
          </TableBody>
        </OriginTable>
      </Paper>
    )
  }

  handleRowClick = action => () => {
    const { clickable, dispatch } = this.props
    if (clickable) {
      dispatch(action)
    }
  }
}

const WrappedTable = withStyles(styles, { name: 'fcTable' })(Table)

const rowSchema = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  // other fields
  highlight: PropTypes.bool,
})

WrappedTable.propTypes = {
  className: PropTypes.string,
  columns: TableHead.propTypes.columns,
  orderBy: PropTypes.string,
  orderDirection: PropTypes.string,
  rows: PropTypes.arrayOf(rowSchema),
  onRequestSort: PropTypes.func,
}

export default WrappedTable
