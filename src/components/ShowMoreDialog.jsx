import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import { DialogContent, DialogTitle, DialogActions } from './DialogComponents';

export default function ShowMoreDialog({ open, onClose, playerData }) {
  return (
    playerData && (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Typography
            style={{
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
            }}>
            More Info about {playerData.playerID}
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            overflowWrap: 'break-word',
          }}>
          {Object.entries(playerData).map(([key, value], idx) => (
            <Typography paragraph key={idx}>
              {/* show N/A if value is null */}
              <strong>{key}:</strong> {value || 'N/A'}
            </Typography>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}
