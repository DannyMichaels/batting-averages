import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import TeamsCSV from './Teams.csv';
import BattingCSV from './Batting.csv';

// components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// utils
import ShowMoreDialog from './components/ShowMoreDialog';
import PlayersTable from './components/PlayersTable';

function App() {
  const [teams, setTeams] = useState([]); // use teams to get teamname
  const [players, setPlayers] = useState([]); // each individual players data, use teams to get the teamname
  const [showMore, setShowMore] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const toggleMoreOpen = (playerData) => {
    setShowMore(playerData.playerID);
    setSelectedPlayer(playerData);
  };

  const closeMoreOpen = () => {
    setShowMore(false);
    setSelectedPlayer(null);
  };

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
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Paper>
          <PlayersTable
            players={players}
            teams={teams}
            toggleMoreOpen={toggleMoreOpen}
          />
        </Paper>
      </Box>

      {/* show more dialog */}
      <ShowMoreDialog
        open={showMore === selectedPlayer?.playerID ?? false}
        onClose={closeMoreOpen}
        playerData={selectedPlayer}
      />
    </>
  );
}

export default App;
