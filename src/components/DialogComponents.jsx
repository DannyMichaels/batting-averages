import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
});

export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <>
      <Grid
        className={classes.root}
        container
        alignItems="center"
        justifyContent="space-between">
        <Grid item xs={11}>
          <Typography variant="h6">{children}</Typography>
        </Grid>
        <Grid item xs={1}>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
});

export const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
