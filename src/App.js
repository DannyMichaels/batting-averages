import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import TeamsCSV from './Teams.csv';
import BattingCSV from './Batting.csv';

// components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// utils
import ShowMoreDialog from './components/ShowMoreDialog';
import PlayersTable from './components/PlayersTable';

function App() {
  const [teams, setTeams] = useState([]); // use teams to get teamname
  const [players, setPlayers] = useState([]); // each individual players data, use teams to get the teamname
  const [showMore, setShowMore] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMoreOpen = (playerData) => {
    setShowMore(playerData.playerID);
    setSelectedPlayer(playerData);
  };

  const closeMoreOpen = () => {
    setShowMore(false);
    setSelectedPlayer(null);
  };

  useEffect(() => {
    const fetchCSVDataOnMount = async () => {
      const teamsData = await csv(TeamsCSV);
      setTeams(teamsData.slice(0, -1)); // get rid of the columns object in the array with slice.

      const playersData = await csv(BattingCSV);
      setPlayers(playersData.slice(0, -1)); // get rid of the columns object in the array with slice

      setIsLoading(false);
    };

    fetchCSVDataOnMount();
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        {/* if is loading, show loading, else show table */}
        {isLoading ? (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center">
            <Grid item>
              <Typography variant="h3" component="h1">
                Loading...
              </Typography>
            </Grid>
            <Grid item>
              <CircularProgress style={{ color: '#fff' }} size={100} />
            </Grid>
          </Grid>
        ) : (
          <Paper>
            <PlayersTable
              players={players}
              teams={teams}
              toggleMoreOpen={toggleMoreOpen}
            />
          </Paper>
        )}
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
