import { csv } from 'd3-fetch';
import { useEffect, useState, useMemo } from 'react';
import './App.css';
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
      // {
      //   Header: 'Team name(s)',
      //   accessor: 'teamName',
      //   Cell: (props) => {
      //     console.log({ props });
      //     return <span>teamName Cell</span>;
      //   },
      // },

      {
        Header: 'Batting Average',
        accessor: 'battingAverage',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return <span>{calculateBA(playerData)}</span>;
        },
      },
    ],
    // check for these dependencies changing to rerender the data.
    [players]
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
      console.log('teams.scsv', data);
      let dataWithoutColumns = data.slice(0, -1);
      setTeams(dataWithoutColumns);
    });

    csv(BattingCSV).then((data) => {
      console.log('batting.csv', data);
      let dataWithoutColumns = data.slice(0, -1);
      setPlayers(dataWithoutColumns);
    });
  }, []);

  return (
    <div className="App">
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
              console.log({ row });
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
    </div>
  );
}

export default App;
