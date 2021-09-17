import { csv } from 'd3-fetch';
import { useEffect, useState, useMemo } from 'react';
import TeamsCSV from './Teams.csv';
import BattingCSV from './Batting.csv';
import { useTable, usePagination } from 'react-table';

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
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// icons
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// utils
import { makeStyles } from '@mui/styles';

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

function App() {
  const [teams, setTeams] = useState([]); // use teams to get teamname
  const [players, setPlayers] = useState([]); // each individual players data, use teams to get the teamname

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
        Cell: ({ cell }) => {
          const playerData = cell.row.original;
          return <span>{playerData.yearID}</span>;
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
    // check for these dependencies changing to trigger a variable change.
    [players, teams]
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
      data: players,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    usePagination
  ); // react-table hooks

  const classes = useStyles();

  useEffect(() => {
    csv(TeamsCSV).then((data) => {
      let dataWithoutColumns = data.slice(0, -1); // get rid of the columns object in the array.
      setTeams(dataWithoutColumns);
    });

    csv(BattingCSV).then((data) => {
      let dataWithoutColumns = data.slice(0, -1); // get rid of the columns object in the array.
      setPlayers(dataWithoutColumns);
    });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh">
      <Paper>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader className={classes.table} {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                // table headers
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <TableCell
                        {...column.getHeaderProps()}
                        className={classes.tableHeader}>
                        {column.render('Header')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                // table rows
                return (
                  <TableRow {...row.getRowProps()} hover key={i}>
                    {row.cells.map((cell, i) => {
                      return (
                        // cell of row.
                        <TableCell key={i} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

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
      </Paper>
    </Box>
  );
}

export default App;
