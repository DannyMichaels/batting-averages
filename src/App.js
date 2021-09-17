import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import './App.css';
import TeamsCSV from './Teams.csv';
import BattingCSV from './Batting.csv';

function App() {
  const [teams, setTeams] = useState([]); // use teams to get teamname
  const [batting, setBatting] = useState([]); // each individual players data, use teams to get the teamname

  useEffect(() => {
    csv(TeamsCSV).then((data) => {
      console.log('teams.scsv', data);
      let dataWithoutColumns = data.slice(0, -1);
      setTeams(dataWithoutColumns);
    });

    csv(BattingCSV).then((data) => {
      console.log('batting.csv', data);
      let dataWithoutColumns = data.slice(0, -1);

      setBatting(dataWithoutColumns);
    });
  }, []);

  return <div className="App">App</div>;
}

export default App;
