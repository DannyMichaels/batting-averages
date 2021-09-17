import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import './App.css';
import TeamsCSV from './Teams.csv';
import BattingCSV from './Batting.csv';

// components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

function App() {
  const [teams, setTeams] = useState([]); // use teams to get teamname
  const [players, setPlayers] = useState([]); // each individual players data, use teams to get the teamname

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

  const COLUMNS = ['playerID', 'yearId', 'Team name(s)', 'Batting Average'];

  return (
    <div className="App">
      <table>
        <thead>
          {COLUMNS.map((columnText) => (
            <th>{columnText}</th>
          ))}
        </thead>
        <tr>
          {/* {players.map((player) => {
            return <>text</>;
          })} */}
        </tr>
      </table>
    </div>
  );
}

export default App;
