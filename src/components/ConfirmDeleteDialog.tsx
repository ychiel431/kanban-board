import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;