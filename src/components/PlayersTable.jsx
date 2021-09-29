// hooks
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
} from 'react-table';
import { useCallback, useMemo, useState } from 'react';

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
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// icons
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import AutoComplete from './AutoComplete';
import { debounce } from '../utils/debounce';
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

// sort players according to their batting average.
const sortPlayers = (a, b) => {
  const playerOneBA = calculateBA(a);
  const playerTwoBA = calculateBA(b);

  // desc, highest avg showing at top.
  return playerTwoBA - playerOneBA;
};

const TeamsFilter = ({ column }) => {
  // not using filterValue, using state here instead to optimize performance.
  const { /*filterValue,*/ setFilter } = column;
  const [inputValue, setInputValue] = useState('');

  // optimize table rerender with debounce
  const handleChangeFilterValue = debounce((e) => {
    setFilter(e.target.value);
  }, 250);

  return (
    <span>
      <TextField
        variant="outlined"
        style={{ color: '#000 !important' }}
        placeholder={`Filter by ${column.Header}`}
        value={inputValue || ''}
        onChange={(e) => {
          setInputValue(e.target.value); // user input to see on UI (can't take e.target from debounce)
          handleChangeFilterValue(e); // debounced handlechange.
        }}
      />
    </span>
  );
};

const YearFilter = ({ column, yearIds }) => {
  const { filterValue, setFilter } = column;

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select year</InputLabel>
      <Select
        style={{ width: '120px' }}
        value={filterValue || ''}
        label="Filter by yearId"
        onChange={handleChange}>
        <MenuItem value={''}>All</MenuItem>
        {[...yearIds]
          // latest year at top
          .sort((a, b) => b - a)
          .map((yearId, idx) => (
            <MenuItem value={yearId} key={idx}>
              {yearId}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

const PlayerFilter = ({ column }) => {
  const { filterValue, setFilter, filteredRows } = column;

  // new set for repeating player IDs...
  const filteredOptions = useMemo(
    () => [...new Set(filteredRows.map(({ original }) => original.playerID))],
    [filteredRows]
  );

  // filters by column.accessor: playerID
  const handleChange = useCallback(
    (value) => {
      setFilter(value);
    },

    // whenever setFilter changes this function will be recreated  amd put into the handleChange variable
    [setFilter]
  );

  return (
    <AutoComplete
      filteredOptions={filteredOptions}
      valueProp={filterValue}
      setFilterValue={handleChange} // passing the handleChange as props.
      fullWidth
      placeholder={'Filter by playerId'}
    />
  );
};

export default function PlayersTable({ players, teams, toggleMoreOpen }) {
  /* add another property for each player, called teamName.
  find the team of the player by teamId
   return the team's name,
   sort by BA
   */
  let tablePlayersData = useMemo(
    () =>
      [...players]
        .map((player) => ({
          ...player,
          teamName: [...teams].find(({ teamID }) => teamID === player.teamID)
            .name,
        }))
        .sort(sortPlayers),
    // change this whenever players or teams change
    [players, teams]
  );

  const yearIds = useMemo(
    () => [...new Set([...tablePlayersData].map(({ yearID }) => yearID))],
    [tablePlayersData]
  );

  // react-table requires a default column when using filters.
  const defaultColumn = useMemo(
    () => ({
      Filter: <></>,
    }),
    []
  );

  /* Filterable columns:  
  Year
  Team name
  */
  const columns = useMemo(
    () => [
      {
        Header: 'playerId',
        accessor: 'playerID',
        Filter: PlayerFilter,
      },
      {
        Header: 'yearId',
        accessor: 'yearID', // when filters will look for yearID to change.
        Filter: YearFilter,
      },
      {
        Header: 'Team name(s)',
        accessor: 'teamName',
        Filter: TeamsFilter,
      },
      {
        Header: 'Batting Average',
        accessor: 'battingAverage',
        Cell: ({ cell }) => {
          const playerData = cell.row.original;

          return calculateBA(playerData).toString();
        },
      },
    ],

    []
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
      defaultColumn,
      columns,
      data: tablePlayersData, // passing the players as data for the table
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
                          {column.canFilter
                            ? column.render('Filter', { yearIds }) // pass props to column
                            : null}
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
