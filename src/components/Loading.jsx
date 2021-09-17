import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center">
      <Grid item>
        <Typography variant="h3" component="h1" gutterBottom>
          Loading...
        </Typography>
      </Grid>
      <Grid item>
        <CircularProgress style={{ color: '#fff' }} size={100} />
      </Grid>
    </Grid>
  );
}
