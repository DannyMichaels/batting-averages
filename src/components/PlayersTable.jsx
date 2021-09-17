// hooks
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
} from 'react-table';
import { useMemo } from 'react';

// utils
import { makeStyles } from '@mui/styles';

// components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

// icons
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

/**
 * @method calculateBA
 * takes a player object, calculates Batting Average and returns the result.
 * @param {Object} playerData  // the player containing the H and AB entries
 * @returns {Number}
 */
const calculateBA = (playerData) => {
  // Batting Average is calculated as: BA = H/AB (Hits / At Bats).
  if (!playerData?.H || !playerData?.AB) return;

  let hits = Number(playerData.H),
    atBats = Number(playerData.AB);

  let battingAverage = hits / atBats;

  return battingAverage;
};

const useStyles = makeStyles((theme) => ({
  tableRoot: {
    width: '100%',
  },
  tableContainer: {
    maxHeight: 500,
  },
  paginationSpacer: {
    flex: '1 1 100%',
    [theme.breakpoints.down('md')]: {
      flex: '0 0',
    },
  },
  paginationActions: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      flexShrink: 1, // direction buttons in a column in small screen
    },
  },
}));

export default function PlayersTable({ players, teams, toggleMoreOpen }) {
  // The application should also accept filter options:

  // Year
  // Team name
  // Year and Team name
  const columns = useMemo(
    () => [
      {
        Header: 'playerId',
        accessor: 'playerId',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{playerData.playerID}</span>;
        },
      },
      {
        Header: 'yearId',
        accessor: 'yearId',
        Filter: ({ ColumnFilter }) => ColumnFilter,

        Cell: ({ cell }) => {
          const playerData = cell.row.original;
          return <span>{playerData.yearID}</span>;
        },
      },
      {
        Header: 'stint',
        accessor: 'stint',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{playerData.stint}</span>;
        },
      },
      {
        Header: 'teamID',
        accessor: 'teamID',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{playerData.teamID}</span>;
        },
      },
      {
        Header: 'AB',
        accessor: 'AB',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{playerData.AB}</span>;
        },
      },
      {
        Header: 'H',
        accessor: 'H',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{playerData.H}</span>;
        },
      },
      {
        Header: 'Team name(s)',
        accessor: 'teamName',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;
          // find the team of the player by teamId
          // return the team's name

          let team = [...teams].find(
            ({ teamID }) => teamID === playerData.teamID
          );

          return <span>{team.name}</span>;
        },
      },
      {
        Header: 'Batting Average',
        accessor: 'battingAverage',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{calculateBA(playerData)}</span>;
        },
      },
    ],
    // check for these dependencies changing to trigger a rerender change.
    [teams]
  );

  const {
    gotoPage,
    setPageSize,
    canPreviousPage,
    pageOptions,
    canNextPage,
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: rows, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    prepareRow,
  } = useTable(
    {
      columns,
      data: players, // passing the players as data for the table
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useFilters,

    useGlobalFilter,
    usePagination
  ); // react-table hooks

  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader className={classes.table} {...getTableProps()}>
          <TableHead>
            {/* COLUMN HEADERS */}
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, key) => {
                  return (
                    <TableCell
                      key={key}
                      {...column.getHeaderProps()}
                      className={classes.tableHeader}>
                      <Grid container direction="column">
                        <Grid item>{column.render('Header')}</Grid>
                        <Grid item>
                          {/* {column.canFilter
                                ? column.render('Filter')
                                : null} */}
                        </Grid>
                      </Grid>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row, idx) => {
              prepareRow(row);
              // table rows
              return (
                <TableRow {...row.getRowProps()} hover key={idx}>
                  {row.cells.map((cell, idx) => {
                    let playerData = row.original;
                    return (
                      // cell of row.
                      <Tooltip
                        title={`view more about ${playerData.playerID}`}
                        arrow
                        key={idx}
                        placement="top">
                        <TableCell
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleMoreOpen(playerData)}
                          {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      </Tooltip>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Table>
        <TableFooter>
          <TableRow>
            {/* TABLE PAGINATION */}

            {/* Material UI TablePagination component */}
            <TablePagination
              rowsPerPageOptions={[10, 20, 30, 40, 50]}
              colSpan={0}
              className={classes.pagination}
              count={pageOptions.length}
              rowsPerPage={pageSize}
              onPageChange={gotoPage}
              page={pageIndex}
              classes={{ spacer: classes.paginationSpacer }}
              onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
              ActionsComponent={(props) => {
                const { count, page, rowsPerPage, onPageChange } = props;

                const handleFirstPageButtonClick = () => {
                  onPageChange(0);
                };

                const handleBackButtonClick = () => {
                  if (!canPreviousPage) return;

                  const previousPage = page - 1;
                  onPageChange(previousPage);
                };

                const handleNextButtonClick = () => {
                  if (!canNextPage) return;

                  const nextPage = page + 1;
                  onPageChange(nextPage);
                };

                const handleLastPageButtonClick = () => {
                  onPageChange(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
                };

                return (
                  <div id="ACTIONS" className={classes.paginationActions}>
                    <IconButton
                      onClick={handleFirstPageButtonClick}
                      disabled={page === 0}
                      aria-label="first page">
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleBackButtonClick}
                      disabled={page === 0}
                      aria-label="previous page">
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={handleNextButtonClick}
                      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                      aria-label="next page">
                      <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                      onClick={handleLastPageButtonClick}
                      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                      aria-label="last page">
                      <LastPageIcon />
                    </IconButton>
                  </div>
                );
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
